import assert from "node:assert/strict";
import test from "node:test";
import { createAccountService } from "../src/lib/accountService.js";
import { createSurveyService } from "../src/lib/surveyService.js";
import { parseSurveyConfiguration, buildSurveyAnswers, surveyNumber } from "../src/lib/surveyContract.js";
import { accountReturn } from "../src/lib/affiliationFormat.js";

const id = "11111111-1111-4111-8111-111111111111", responseId = "22222222-2222-4222-8222-222222222222";
const config = { version: 1, preguntas: [
  { id: "cantidad", texto: "Valor observado", tipo: "numero", obligatoria: true, min: 0, max: 5 },
  { id: "categoria", texto: "Sección consultada", tipo: "opcion_unica", obligatoria: true, opciones: [{ id: "a", texto: "Noticias" }, { id: "b", texto: "Sedes" }] },
  { id: "varias", texto: "Dispositivos utilizados", tipo: "opcion_multiple", opciones: [{ id: "movil", texto: "Teléfono" }, { id: "pc", texto: "Computadora" }] },
  { id: "texto", texto: "Comentario", tipo: "texto", maxLongitud: 50 },
] };
const meta = { id, titulo: "Experiencia con la aplicación", descripcion: "Conocer su funcionamiento.", tipo: "general", fechaInicio: null, fechaFin: null };
const detail = { ...meta, configuracion: config };
const proof = { id: responseId, createdAt: "2026-10-24T10:00:00Z" };
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
const values = { cantidad: "3.5", categoria: "a", varias: ["movil", "pc"], texto: "Lectura clara. 🧉" };
const tick = () => new Promise(resolve => setImmediate(resolve));
function setup(handler, options) {
  const calls = [];
  const account = createAccountService({ baseUrl: "https://api.example.invalid", fetchImpl: async (url, init) => {
    const call = { path: new URL(url).pathname, query: new URL(url).searchParams, ...init }; calls.push(call);
    if (call.path.endsWith("/login")) return json({ tokenType: "Bearer", token: `test.${calls.length}.signature`, expiresAt: new Date(Date.now() + 900000).toISOString() });
    if (call.path.endsWith("/cerrar-sesion")) return new Response(null, { status: 204 });
    return handler(call, calls);
  } });
  return { account, surveys: createSurveyService(account, options), calls };
}

test("v1 conserva orden, IDs y controles; admite textos Unicode", () => {
  const parsed = parseSurveyConfiguration(config);
  assert.deepEqual(parsed.preguntas.map(p => p.tipo), ["numero", "opcion_unica", "opcion_multiple", "texto"]);
  assert.deepEqual(JSON.parse(JSON.stringify(buildSurveyAnswers(parsed, values))), { respuestas: { cantidad: 3.5, categoria: "a", varias: ["movil", "pc"], texto: "Lectura clara. 🧉" } });
});
test("variables numéricas: cero, decimales y opcionales vacías no se confunden", () => {
  const body = buildSurveyAnswers(config, { cantidad: "0", categoria: "a", varias: [], texto: "   " });
  assert.deepEqual(JSON.parse(JSON.stringify(body)), { respuestas: { cantidad: 0, categoria: "a" } });
  for (const value of ["", "6", "-1", "Infinity", "0x10", "1,5", false, 3.5]) assert.throws(() => buildSurveyAnswers(config, { cantidad: value, categoria: "a" }));
});
test("decimales no cambian silenciosamente al serializar y respetan decimal de .NET", () => {
  for (const value of ["0", "-0", "0.1", "1.2500", "1e3", "1e-28", "1e28"]) assert.equal(surveyNumber(value), Number(value));
  for (const value of ["9007199254740993", "0.123456789012345678", "1e-29", "8e28", "1e309", "NaN"]) assert.throws(() => surveyNumber(value));
});
test("categorías envían IDs exactos y no admiten opciones duplicadas o inventadas", () => {
  for (const change of [{ categoria: "Noticias" }, { categoria: "A" }, { varias: ["movil", "movil"] }, { varias: ["otro"] }, { categoria: ["a"] }]) assert.throws(() => buildSurveyAnswers(config, { ...values, ...change }));
  assert.throws(() => buildSurveyAnswers(config, { ...values, usuarioId: "forged" }));
});
test("contratos desconocidos, campos incompatibles y obligatorios ausentes fallan cerrados", () => {
  for (const value of [{ ...config, version: 2 }, { ...config, preguntas: [] }, { ...config, secreto: true }, { version: 1, preguntas: [{ ...config.preguntas[0], tipo: "fecha" }] }, { version: 1, preguntas: [config.preguntas[0], config.preguntas[0]] }, { version: 1, preguntas: [{ ...config.preguntas[0], opciones: [] }] }]) assert.throws(() => parseSurveyConfiguration(value), { code: "survey_configuration" });
  assert.throws(() => buildSurveyAnswers(config, { categoria: "a" }), { code: "survey_validation" });
  assert.throws(() => buildSurveyAnswers({ version: 1, preguntas: [{ id: "opcional", texto: "Comentario", tipo: "texto" }] }, {}));
});
test("normaliza nombres de propiedades admitidos por .NET, sin cambiar IDs", () => {
  const parsed = parseSurveyConfiguration({ Version: 1, Preguntas: [{ Id: "Mayuscula", Texto: "Pregunta", Tipo: "texto" }] });
  assert.equal(parsed.preguntas[0].id, "Mayuscula");
  assert.throws(() => parseSurveyConfiguration({ version: 1, Version: 1, preguntas: config.preguntas }));
});
test("IDs especiales no modifican prototipos ni se convierten en propiedades heredadas", () => {
  const special = { version: 1, preguntas: [{ id: "__proto__", texto: "Comentario", tipo: "texto", obligatoria: true }] };
  assert.throws(() => buildSurveyAnswers(special, {}));
  const data = Object.create(null); data.__proto__ = "Respuesta";
  const body = buildSurveyAnswers(special, data);
  assert.equal(Object.getPrototypeOf(body.respuestas), null);
  assert.equal(JSON.parse(JSON.stringify(body)).respuestas.__proto__, "Respuesta");
});
test("NUL, Unicode incompleto, textos excesivos y cuerpo HTTP grande se rechazan", () => {
  for (const texto of ["Texto\0inválido", "\uD800", "x".repeat(51)]) assert.throws(() => buildSurveyAnswers(config, { ...values, texto }));
  const large = { version: 1, preguntas: Array.from({ length: 40 }, (_, i) => ({ id: `p${i}`, texto: `Pregunta ${i}`, tipo: "texto" })) };
  assert.throws(() => buildSurveyAnswers(large, Object.fromEntries(large.preguntas.map(p => [p.id, "x".repeat(2000)]))));
});
test("lectura pública no necesita sesión ni JWT; crear el servicio no llama a la API", async () => {
  const { surveys, calls } = setup(call => call.path.endsWith("publicas") ? json({ items: [meta], siguienteCursor: null }) : json(detail));
  assert.equal(calls.length, 0);
  await surveys.list(); await surveys.detail(id);
  for (const call of calls) { assert.equal(call.headers.has("Authorization"), false); assert.equal(call.credentials, "omit"); }
  await assert.rejects(surveys.submit(id, config, values), { status: 401 }); assert.equal(calls.length, 2);
});
test("páginas y detalles se comparten, expiran y no descargan respuestas por cada tarjeta", async () => {
  let now = 0;
  const { surveys, calls } = setup(() => json({ items: [meta], siguienteCursor: null }), { now: () => now });
  await Promise.all([surveys.list(), surveys.list()]); await surveys.list(); assert.equal(calls.length, 1);
  now = 30001; await surveys.list(); assert.equal(calls.length, 2);
  await surveys.list({ cursor: id }); assert.equal(calls.length, 3);
  await assert.rejects(surveys.list({ limite: 21 })); assert.equal(calls.length, 3);
});
test("una lectura compartida solo se cancela cuando no queda ningún consumidor", async () => {
  let finish, networkSignal;
  const { surveys, calls } = setup(call => new Promise(resolve => { finish = resolve; networkSignal = call.signal; }));
  const first = new AbortController(), second = new AbortController();
  const one = surveys.detail(id, { signal: first.signal }), two = surveys.detail(id, { signal: second.signal });
  await tick(); first.abort(); await assert.rejects(one, { name: "AbortError" }); assert.equal(networkSignal.aborted, false);
  finish(json(detail)); assert.equal((await two).id, id); assert.equal(calls.length, 1);
});
test("cerrar la única vista aborta la lectura y no conserva un resultado tardío", async () => {
  let finish, networkSignal;
  const { surveys, calls } = setup(call => new Promise(resolve => { finish = resolve; networkSignal = call.signal; }));
  const controller = new AbortController(), reading = surveys.detail(id, { signal: controller.signal });
  await tick(); controller.abort(); await assert.rejects(reading, { name: "AbortError" }); assert.equal(networkSignal.aborted, true);
  finish(json(detail)); await tick();
  const next = surveys.detail(id); await tick(); assert.equal(calls.length, 2); finish(json(detail)); await next;
});
test("la caché está acotada aunque se consulten muchos IDs", async () => {
  const { surveys, calls } = setup(call => json({ ...detail, id: call.path.split("/").at(-1) }));
  await surveys.detail(id);
  for (let i = 1; i <= 33; i++) await surveys.detail(`00000000-0000-4000-8000-${String(i).padStart(12, "0")}`);
  await surveys.detail(id); assert.equal(calls.length, 35);
});
test("las lecturas públicas siguen sin JWT después de iniciar sesión", async () => {
  const { account, surveys, calls } = setup(() => json(detail));
  await account.login({}); await surveys.detail(id);
  assert.equal(calls.at(-1).headers.has("Authorization"), false);
});
test("la caché compartida conserva solo campos públicos del contrato", async () => {
  const { surveys } = setup(call => call.path.endsWith("publicas") ? json({ items: [{ ...meta, usuarioId: "private", respondida: true }], siguienteCursor: null }) : json({ ...detail, usuarioId: "private" }));
  const page = await surveys.list(), survey = await surveys.detail(id);
  assert.equal("usuarioId" in page.items[0], false); assert.equal("respondida" in page.items[0], false); assert.equal("usuarioId" in survey, false);
});
test("alta normal conserva tipos JSON, confirma comprobante y nunca recarga el perfil", async () => {
  let saved = false;
  const { account, surveys, calls } = setup(call => {
    if (call.method === "POST") { saved = true; assert.deepEqual(JSON.parse(call.body).respuestas, { cantidad: 3.5, categoria: "a", varias: ["movil", "pc"], texto: "Lectura clara. 🧉" }); return json({ id: responseId, estado: "registrada" }, 201); }
    return saved ? json(proof) : json({}, 404);
  });
  await account.login({}); const result = await surveys.submit(id, config, values);
  assert.deepEqual(result, proof); assert.deepEqual(surveys.knownReceipt(id), proof);
  assert.equal(calls.length, 4); assert.equal(calls.some(call => call.path === "/api/Usuario/me"), false);
});
test("una respuesta ya registrada impide otro POST", async () => {
  const { account, surveys, calls } = setup(() => json(proof));
  await account.login({}); await surveys.submit(id, config, values);
  assert.equal(calls.filter(call => call.method === "POST").length, 1); // solo login
});
test("resultado incierto con comprobante se recupera sin reintentar el POST", async () => {
  let saved = false;
  const { account, surveys, calls } = setup(call => { if (call.method === "POST") { saved = true; throw new TypeError("desconexión"); } return saved ? json(proof) : json({}, 404); });
  await account.login({}); assert.deepEqual(await surveys.submit(id, config, values), proof);
  assert.equal(calls.filter(call => call.method === "POST").length, 2);
});
test("409 sin comprobante queda incierto: no se interpreta como respuesta duplicada", async () => {
  const { account, surveys, calls } = setup(call => call.method === "POST" ? json({ title: "Encuesta cerrada" }, 409) : json({}, 404));
  await account.login({}); await assert.rejects(surveys.submit(id, config, values), { code: "survey_uncertain" });
  assert.equal(calls.filter(call => call.method === "POST").length, 2); assert.equal(surveys.knownReceipt(id), null);
});
test("400/429 conservan el error y no disparan otras consultas ni reenvíos", async () => {
  for (const status of [400, 429]) {
    const { account, surveys, calls } = setup(call => call.method === "POST" ? json({ title: "Revisá el envío" }, status, { "Retry-After": "30" }) : json({}, 404));
    await account.login({}); await assert.rejects(surveys.submit(id, config, values), error => error.status === status && error.retryAfterSeconds === 30);
    assert.equal(calls.length, 3);
  }
});
test("comprobantes privados se eliminan al cerrar o cambiar de cuenta", async () => {
  const { account, surveys, calls } = setup(() => json(proof));
  await account.login({}); await surveys.loadReceipt(id); await surveys.loadReceipt(id); assert.equal(calls.length, 2);
  await account.logout(); assert.equal(surveys.knownReceipt(id), null);
  await account.login({}); await surveys.loadReceipt(id); assert.equal(calls.length, 5);
});
test("una respuesta privada atrasada no aparece en otra sesión", async () => {
  let finish, networkSignal;
  const { account, surveys } = setup(call => new Promise(resolve => { finish = resolve; networkSignal = call.signal; }));
  await account.login({}); const reading = surveys.loadReceipt(id); await tick();
  await account.login({}); assert.equal(networkSignal.aborted, true); finish(json(proof));
  await assert.rejects(reading, { name: "AbortError" }); assert.equal(surveys.knownReceipt(id), null);
});
test("login vuelve únicamente a rutas internas de encuestas válidas", () => {
  assert.equal(accountReturn(`/encuestas/${id}`), `/encuestas/${id}`);
  assert.equal(accountReturn("/encuestas"), "/encuestas");
  for (const path of ["/encuestas//evil", "/encuestas/../../", "/encuestas?redirect=https://evil", "//evil", "https://evil"]) assert.equal(accountReturn(path), "/mi-cuenta");
});
