// Comprobación manual de solo lectura. Nunca registra personas ni envía correos.
import { setTimeout as delay } from 'node:timers/promises';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { randomUUID } from 'node:crypto';

const publicPaths = ['/health', '/api/Departamento', '/api/Encuesta/publicas'];
export function publicationOrigin(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Indicá un origen válido, sin rutas ni credenciales.'); }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) ||
      url.username || url.password || url.pathname !== '/' || url.search || url.hash)
    throw new Error('Solo se admiten orígenes HTTPS; HTTP únicamente en loopback.');
  return url.origin;
}

function reader(fetchImpl) {
  return async (origin, path, { method = 'GET', headers = {} } = {}) => {
    const started = performance.now();
    const response = await fetchImpl(origin + path, {
      method, headers, credentials: 'omit', redirect: 'error', signal: AbortSignal.timeout(5000),
    });
    const retry = Number(response.headers.get('retry-after'));
    if (response.status === 429 || response.status >= 500) {
      await response.body?.cancel();
      throw new Error(`Ensayo detenido: HTTP ${response.status} en ${path}. Sin reintentos.` +
        (Number.isFinite(retry) && retry > 0 ? ` Retry-After=${Math.min(retry, 86400)}s.` : ''));
    }
    const chunks = []; let size = 0;
    if (response.body) {
      const stream = response.body.getReader();
      try {
        while (true) {
          const part = await stream.read();
          if (part.done) break;
          size += part.value.byteLength;
          if (size > 262144) { await stream.cancel(); throw new Error('Respuesta de ensayo superior a 256 KiB.'); }
          chunks.push(part.value);
        }
      } finally { stream.releaseLock(); }
    }
    const sample = { path, status: response.status, ms: Math.round(performance.now() - started) };
    return { ...sample, headers: response.headers, text: Buffer.concat(chunks).toString('utf8') };
  };
}

function requireValue(condition, message) { if (!condition) throw new Error(message); }
function robotsBlocked(headers, text) {
  return /noindex/i.test(headers.get('x-robots-tag') || '') || /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(text);
}

export async function checkPublication({ frontend, api, mode = 'preview', fetchImpl = globalThis.fetch }) {
  frontend = publicationOrigin(frontend); api = publicationOrigin(api);
  requireValue(['preview', 'production'].includes(mode), 'Modo inválido.');
  const read = reader(fetchImpl), samples = [];
  for (const path of ['/', '/privacidad', '/registro', '/mi-cuenta', '/administracion/afiliaciones', '/encuestas']) {
    const response = await read(frontend, path);
    samples.push({ path, status: response.status, ms: response.ms });
    requireValue(response.status === 200 && response.headers.get('content-type')?.includes('text/html'), `Ruta React inválida: ${path}`);
    requireValue(response.headers.get('x-content-type-options') === 'nosniff', `Falta nosniff en ${path}`);
    requireValue(response.headers.get('x-frame-options') === 'DENY' &&
      response.headers.get('content-security-policy')?.includes("frame-ancestors 'none'"), `Falta protección de marcos en ${path}`);
    requireValue(response.headers.get('referrer-policy') === 'strict-origin-when-cross-origin' &&
      response.headers.get('permissions-policy')?.includes('camera=()'), `Faltan políticas de navegador en ${path}`);
    const meta = response.text.match(/<meta\b[^>]*http-equiv="Content-Security-Policy"[^>]*content="([^"]*)"/i)?.[1];
    const connect = meta?.split(';').map(part => part.trim()).find(part => part.startsWith('connect-src '))?.split(/\s+/);
    requireValue(connect?.includes(api), `CSP no permite el origen exacto de la API en ${path}`);
    const privatePage = ['/registro', '/mi-cuenta', '/administracion/afiliaciones'].includes(path);
    requireValue(robotsBlocked(response.headers, response.text) === (mode === 'preview' || privatePage), `Indexación incorrecta en ${path}`);
    // En acceso directo la cabecera protege la ruta incluso antes de ejecutar React.
    if (privatePage) requireValue(/noindex/i.test(response.headers.get('x-robots-tag') || ''), `Falta noindex por cabecera en ${path}`);
  }
  for (const [path, type, fragment] of [
    ['/logoweb.jpg', 'image/', null], ['/robots.txt', 'text/', 'Sitemap:'], ['/sitemap.xml', 'xml', '/privacidad'],
  ]) {
    const response = await read(frontend, path);
    requireValue(response.status === 200 && response.headers.get('content-type')?.includes(type) &&
      (!fragment || response.text.includes(fragment)), `Recurso público inválido: ${path}`);
    samples.push({ path, status: response.status, ms: response.ms });
  }
  for (const path of publicPaths) {
    const response = await read(api, path, { headers: { Origin: frontend } });
    requireValue(response.status === 200, `Lectura pública inválida: ${path}`);
    if (path === '/health') requireValue(response.text.trim() === 'ok', 'Health no devolvió ok.');
    else {
      requireValue(response.headers.get('access-control-allow-origin') === frontend, `CORS no autoriza la Preview exacta: ${path}`);
      requireValue(/public/.test(response.headers.get('cache-control') || ''), `Falta caché pública en ${path}`);
      let data;
      try { data = JSON.parse(response.text); } catch { throw new Error(`JSON público inválido: ${path}`); }
      requireValue(path === '/api/Departamento' ? Array.isArray(data) && data.length > 0 :
        Array.isArray(data.items) && Object.hasOwn(data, 'siguienteCursor'), `Contrato público incorrecto: ${path}`);
    }
    samples.push({ path, status: response.status, ms: response.ms });
  }
  for (const [path, expected] of [
    ['/api/Usuario/me', 401], ['/api/Encuesta/administracion', 401], ['/swagger/v1/swagger.json', [401, 404]],
    ['/api/SolicitudCiudadana/00000000-0000-0000-0000-000000000001/pdf', 404],
  ]) {
    const response = await read(api, path);
    requireValue((Array.isArray(expected) ? expected : [expected]).includes(response.status), `Acceso/configuración inesperado: ${path}`);
    if (path.endsWith('/pdf')) requireValue(response.text.includes('pdf_disabled'), 'PDF no está deshabilitado explícitamente.');
    samples.push({ path, status: response.status, ms: response.ms });
  }
  const preflight = await read(api, '/api/Usuario', { method: 'OPTIONS', headers: {
    Origin: frontend, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type,x-turnstile-token',
  } });
  requireValue([200, 204].includes(preflight.status) && preflight.headers.get('access-control-allow-origin') === frontend,
    'Preflight de registro rechazado.');
  requireValue((preflight.headers.get('access-control-allow-methods') || '').split(',').map(value => value.trim()).includes('POST'),
    'CORS no permite el método del registro.');
  const allowedHeaders = (preflight.headers.get('access-control-allow-headers') || '').toLowerCase().split(',').map(value => value.trim());
  requireValue(['content-type', 'x-turnstile-token'].every(name => allowedHeaders.includes(name)), 'Faltan cabeceras del registro en CORS.');
  const forbidden = await read(api, '/api/Departamento', { headers: { Origin: 'https://no-autorizado.example.invalid' } });
  requireValue(!forbidden.headers.has('access-control-allow-origin'), 'CORS admite un origen no autorizado.');
  return { mode, frontend, api, checks: samples.length + 2, samples };
}

export async function runBoundedLoad({ api, fetchImpl = globalThis.fetch, wait = delay,
  now = () => performance.now(), onPhase = () => {} }) {
  api = publicationOrigin(api);
  const read = reader(fetchImpl), started = now(), samples = [], phases = [];
  for (const concurrency of [1, 2, 4]) {
    const phaseStart = now(), times = [];
    for (let sent = 0; sent < 20; sent += concurrency) {
      requireValue(now() - started < 90000, 'Ensayo detenido: excedió 90 segundos.');
      const count = Math.min(concurrency, 20 - sent);
      // Espera también las peticiones del lote que ya salieron si alguna falla.
      const batch = await Promise.allSettled(Array.from({ length: count }, (_, index) =>
        read(api, publicPaths[(samples.length + index) % publicPaths.length])));
      for (const result of batch) {
        if (result.status === 'rejected') throw result.reason;
        const response = result.value;
        requireValue(response.status === 200, `Carga detenida: HTTP ${response.status} en ${response.path}`);
        samples.push({ path: response.path, status: response.status, ms: response.ms }); times.push(response.ms);
      }
      // Un GET/segundo en promedio; máximo cuatro solicitudes simultáneas y sesenta en total.
      await wait(Math.max(0, phaseStart + (sent + count) * 1000 - now()));
    }
    times.sort((a, b) => a - b);
    const phase = { concurrency, requests: times.length, p50Ms: times[Math.ceil(times.length * .5) - 1],
      p95Ms: times[Math.ceil(times.length * .95) - 1], maxMs: times.at(-1), durationMs: Math.round(now() - phaseStart) };
    phases.push(phase); onPhase(phase);
  }
  return { api, requests: samples.length, durationMs: Math.round(now() - started), phases, samples };
}

async function main() {
  const { values } = parseArgs({ options: { frontend: { type: 'string' }, api: { type: 'string' },
    mode: { type: 'string', default: 'preview' }, load: { type: 'boolean', default: false } } });
  requireValue(values.api && (values.load || values.frontend), 'Uso: node scripts/check-publication.mjs --api ORIGEN --frontend ORIGEN [--mode preview|production]; --api ORIGEN --load para carga acotada.');
  const report = values.load ? await runBoundedLoad({ api: values.api, onPhase: phase => console.log(JSON.stringify(phase)) }) :
    await checkPublication({ frontend: values.frontend, api: values.api, mode: values.mode });
  const directory = fileURLToPath(new URL('../.artifacts/publication/', import.meta.url));
  await mkdir(directory, { recursive: true });
  const reportPath = resolve(directory, randomUUID() + '.json');
  await writeFile(reportPath, JSON.stringify({ observedAtUtc: new Date().toISOString(), ...report }, null, 2));
  console.log(`OK: ${values.load ? report.requests + ' GET de carga acotada' : report.checks + ' comprobaciones de publicación'}. Informe: ${reportPath}`);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch(error => { console.error(error instanceof TypeError ? 'Falló la conexión o TLS; no se reintenta ni se omiten certificados.' : error.message); process.exitCode = 1; });
