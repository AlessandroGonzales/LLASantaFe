import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPublication, publicationOrigin, runBoundedLoad } from '../scripts/check-publication.mjs';
import { contentSecurityPolicy } from '../scripts/deployment-policy.mjs';

test('el ensayo rechaza credenciales, rutas y HTTP remoto antes de enviar tráfico', async () => {
  for (const value of ['http://example.invalid', 'https://user:secret@example.invalid', 'https://example.invalid/api',
    'https://example.invalid/?token=private', 'https://example.invalid/#private'])
    assert.throws(() => publicationOrigin(value), error => !error.message.includes(value));
  assert.equal(publicationOrigin('http://127.0.0.1:5191/'), 'http://127.0.0.1:5191');
  let calls = 0;
  await assert.rejects(runBoundedLoad({ api: 'http://example.invalid', fetchImpl: () => calls++ }));
  assert.equal(calls, 0);
});

test('la carga tiene un presupuesto fijo, concurrencia limitada y ninguna escritura', async () => {
  let clock = 0, active = 0, maximum = 0, count = 0;
  const result = await runBoundedLoad({ api: 'https://api.example.invalid', now: () => clock,
    wait: async ms => { clock += ms; }, fetchImpl: async (url, options) => {
      assert.ok(['/health', '/api/Departamento', '/api/Encuesta/publicas'].includes(new URL(url).pathname));
      assert.equal(options.method, 'GET'); assert.equal(options.credentials, 'omit'); assert.equal(options.redirect, 'error');
      assert.deepEqual(options.headers, {}); assert.equal(options.body, undefined);
      active++; maximum = Math.max(maximum, active); count++;
      await new Promise(resolve => setImmediate(resolve)); active--;
      return new Response('ok');
    } });
  assert.equal(count, 60); assert.equal(maximum, 4); assert.equal(result.durationMs, 60000);
  assert.deepEqual(result.phases.map(phase => phase.requests), [20, 20, 20]);
});

test('429, 503 y errores de red detienen el ensayo sin reintentos', async () => {
  for (const status of [429, 503, 'network']) {
    let calls = 0;
    await assert.rejects(runBoundedLoad({ api: 'https://api.example.invalid', wait: async () => {},
      fetchImpl: async () => { calls++; if (status === 'network') throw new TypeError('network');
        return new Response('', { status, headers: { 'retry-after': '60' } }); } }));
    assert.equal(calls, 1);
  }
});

test('el ensayo impone timeout y tamaño de respuesta antes de continuar la carga', async () => {
  let calls = 0;
  await assert.rejects(runBoundedLoad({ api: 'https://api.example.invalid', fetchImpl: async (_, options) => {
    calls++; assert.ok(options.signal instanceof AbortSignal); return new Response('x'.repeat(262145));
  } }), /256 KiB/);
  assert.equal(calls, 1);
});

function publicationFixture({ mode = 'preview', cors = true, swagger = 404 } = {}) {
  const frontend = 'https://preview.example.invalid', api = 'https://api.example.invalid';
  const calls = [];
  return { frontend, api, mode, calls, fetchImpl: async (url, options) => {
    calls.push({ url, method: options.method });
    const { origin, pathname } = new URL(url);
    if (origin === frontend) {
      if (pathname === '/logoweb.jpg') return new Response('image', { headers: { 'content-type': 'image/jpeg' } });
      if (pathname === '/robots.txt') return new Response('Sitemap: /sitemap.xml', { headers: { 'content-type': 'text/plain' } });
      if (pathname === '/sitemap.xml') return new Response('<loc>/privacidad</loc>', { headers: { 'content-type': 'application/xml' } });
      const headers = { 'content-type': 'text/html', 'x-frame-options': 'DENY', 'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin', 'permissions-policy': 'camera=(), microphone=()',
        'content-security-policy': "frame-ancestors 'none'" };
      if (['/registro', '/mi-cuenta', '/administracion/afiliaciones'].includes(pathname)) headers['x-robots-tag'] = 'noindex, nofollow';
      return new Response(`<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy('', api)}">` +
        (mode === 'preview' ? '<meta name="robots" content="noindex, nofollow">' : ''), { headers });
    }
    if (options.method === 'OPTIONS') return new Response(null, { status: 204, headers: {
      'access-control-allow-origin': frontend, 'access-control-allow-headers': 'content-type, x-turnstile-token',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
    } });
    if (pathname === '/health') return new Response('ok');
    if (pathname.startsWith('/swagger')) return new Response('', { status: swagger });
    if (pathname.endsWith('/pdf')) return Response.json({ code: 'pdf_disabled' }, { status: 404 });
    if (['/api/Usuario/me', '/api/Encuesta/administracion'].includes(pathname)) return new Response('', { status: 401 });
    const headers = { 'cache-control': 'public, max-age=30' };
    if (options.headers.Origin === frontend && cors) headers['access-control-allow-origin'] = frontend;
    return Response.json(pathname === '/api/Departamento' ? [{ idDepartamento: 'synthetic', nombre: 'Prueba' }] :
      { items: [], siguienteCursor: null }, { headers });
  } };
}

test('el ensayo distingue Preview de Production y comprueba rutas, permisos y CORS sin POST', async () => {
  for (const mode of ['preview', 'production']) {
    const fixture = publicationFixture({ mode });
    const report = await checkPublication(fixture);
    assert.equal(report.checks, 18); assert.equal(fixture.calls.length, 18);
    assert.ok(fixture.calls.every(call => ['GET', 'OPTIONS'].includes(call.method)));
  }
});

test('una API sin CORS correcto o con Swagger público no se acepta como publicación', async () => {
  // La política de autorización por defecto puede devolver 401 antes del 404 de una ruta no registrada.
  assert.equal((await checkPublication(publicationFixture({ swagger: 401 }))).checks, 18);
  await assert.rejects(checkPublication(publicationFixture({ cors: false })), /CORS/);
  await assert.rejects(checkPublication(publicationFixture({ swagger: 200 })), /swagger/);
});
