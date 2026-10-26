import assert from "node:assert/strict";
import test from "node:test";
import { createApiClient } from "../src/lib/apiClient.js";
import { createAccountService } from "../src/lib/accountService.js";
import { createSurveyService } from "../src/lib/surveyService.js";
import { prepareProfilePhoto } from "../src/lib/profilePhoto.js";
const origin = "https://api.example.invalid", id = "11111111-1111-4111-8111-111111111111";
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } });
const jpeg = () => new Response(new Uint8Array(150), { headers: { "Content-Type": "image/jpeg" } });
const tick = () => new Promise(resolve => setImmediate(resolve));
function setup(handler) {
  const calls = [], revoked = []; let urlId = 0;
  const account = createAccountService({ baseUrl: origin, createObjectURL: () => `blob:photo-${++urlId}`, revokeObjectURL: url => revoked.push(url), fetchImpl: async (url, init) => {
    const call = { path: new URL(url).pathname, ...init }; calls.push(call);
    if (call.path.endsWith("/login")) return json({ tokenType: "Bearer", token: `fake.${calls.length}.signature`, expiresAt: new Date(Date.now() + 900000).toISOString() });
    if (call.path.endsWith("/cerrar-sesion")) return new Response(null, { status: 204 });
    return handler(call);
  } });
  return { account, calls, revoked };
}
test("foto binaria: envía bytes con JWT y recibe Blob sin JSON ni cookies", async () => {
  let called;
  const client = createApiClient({ baseUrl: origin, getToken: () => "test.token", fetchImpl: async (_url, init) => { called = init; return init.method === "PUT" ? new Response(null, { status: 204 }) : jpeg(); } });
  const blob = new Blob([new Uint8Array(40)], { type: "image/jpeg" });
  await client.request("/api/Usuario/me/foto", { method: "PUT", body: blob, auth: true });
  assert.equal(called.body, blob); assert.equal(called.headers.get("Content-Type"), "image/jpeg"); assert.equal(called.headers.get("Authorization"), "Bearer test.token");
  const result = await client.request("/api/Usuario/me/foto", { auth: true, responseType: "blob" });
  assert.ok(result instanceof Blob); assert.equal(result.size, 150); assert.equal(called.credentials, "omit"); assert.equal(called.cache, "no-store");
});
test("foto binaria rechaza MIME o tamaño inválidos y conserva ProblemDetails/401", async () => {
  for (const response of [new Response("<svg/>", { headers: { "Content-Type": "image/svg+xml" } }), new Response(new Uint8Array(65537), { headers: { "Content-Type": "image/jpeg" } })]) {
    const client = createApiClient({ baseUrl: origin, fetchImpl: async () => response });
    await assert.rejects(client.request("/api/Usuario/me/foto", { responseType: "blob" }), { code: "invalid_response" });
  }
  let clear = 0;
  const client = createApiClient({ baseUrl: origin, getToken: () => "fake", onUnauthorized: () => clear++, fetchImpl: async () => json({ title: "Acceso no vigente" }, 401) });
  await assert.rejects(client.request("/api/Usuario/me/foto", { responseType: "blob", auth: true }), { status: 401 }); assert.equal(clear, 1);
});
test("foto compartida: una descarga por versión y revocación al salir o cambiar de cuenta", async () => {
  const { account, calls, revoked } = setup(call => call.path.endsWith("/foto") ? jpeg() : json({ idUsuario: id, email: "fixture@example.invalid", fotoPerfilVersion: "a" }));
  await account.login({}); await account.loadProfile(); await Promise.all([account.loadPhoto(), account.loadPhoto()]); await account.loadProfile();
  assert.equal(calls.filter(c => c.path.endsWith("/foto")).length, 1); assert.equal(account.getSnapshot().avatarUrl, "blob:photo-1");
  await account.logout(); assert.deepEqual(revoked, ["blob:photo-1"]); assert.equal(account.getSnapshot().avatarUrl, null);
  await account.login({}); await account.loadProfile(); await account.loadPhoto(); await account.login({});
  assert.deepEqual(revoked, ["blob:photo-1", "blob:photo-2"]);
});
test("una descarga atrasada no instala la foto de la cuenta anterior", async () => {
  let finish;
  const { account, revoked } = setup(call => call.path.endsWith("/foto") ? new Promise(resolve => { finish = resolve; }) : json({ idUsuario: id, email: "fixture@example.invalid", fotoPerfilVersion: "a" }));
  await account.login({}); await account.loadProfile(); const task = account.loadPhoto();
  await account.login({}); finish(jpeg()); await assert.rejects(task); await tick();
  assert.equal(account.getSnapshot().avatarUrl, null); assert.deepEqual(revoked, []);
});
test("rechaza formatos y archivos grandes antes de decodificar o llamar al backend", async () => {
  for (const file of [null, { type: "image/svg+xml", size: 100 }, { type: "image/jpeg", size: 2097153 }]) await assert.rejects(prepareProfilePhoto(file));
});
test("historial privado pagina sin descargar respuestas y conserva decimales como texto", async () => {
  const answer = { id, encuestaId: id, titulo: "Consulta finalizada", createdAt: "2026-10-25T12:00:00Z" };
  const { account, calls } = setup(call => json(call.path.endsWith(`/respuestas/${id}`) ? { ...answer, preguntas: [{ pregunta: "Valor", tipo: "numero", respondida: true, valores: ["0.1234567890123456789012345678"] }] } : { items: [answer], siguienteCursor: null }));
  const surveys = createSurveyService(account);
  assert.throws(() => surveys.ownResponses(), { status: 401 }); assert.equal(calls.length, 0);
  await account.login({}); await Promise.all([surveys.ownResponses(), surveys.ownResponses()]);
  assert.equal(calls.filter(c => c.path.endsWith("respuestas")).length, 1);
  const detail = await surveys.ownResponse(id); assert.equal(detail.preguntas[0].valores[0], "0.1234567890123456789012345678");
  await account.logout(); await account.login({}); await surveys.ownResponses();
  assert.equal(calls.filter(c => c.path.endsWith("respuestas")).length, 2);
});
test("cerrar sesión cancela una lectura privada del historial", async () => {
  let finish;
  const { account } = setup(() => new Promise(resolve => { finish = resolve; })); const surveys = createSurveyService(account);
  await account.login({}); const pending = surveys.ownResponses(); await tick(); await account.logout(); finish(json({ items: [], siguienteCursor: null }));
  await assert.rejects(pending, { name: "AbortError" });
});
