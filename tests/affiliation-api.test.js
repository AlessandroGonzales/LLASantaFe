import assert from "node:assert/strict";
import test from "node:test";
import { createAccountService } from "../src/lib/accountService.js";
import { createAffiliationService, affiliationBody, isAdministrator } from "../src/lib/affiliationService.js";
import { accountReturn, affiliationReturn, affiliationPhotoSource } from "../src/lib/affiliationFormat.js";

test("la miniatura de afiliación solo admite JPEG en base64 y con tamaño acotado", () => {
  assert.equal(affiliationPhotoSource("/9j/AA=="), "data:image/jpeg;base64,/9j/AA==");
  for (const value of [null, undefined, {}, "", "https://externo.example/foto.jpg", "data:image/svg+xml,<svg/>", "iVBORw0KGgo=", "/9j/AA==\n", "/9j/" + "A".repeat(10924)]) {
    assert.equal(affiliationPhotoSource(value), null);
  }
});

const id = "11111111-1111-4111-8111-111111111111", city = "22222222-2222-4222-8222-222222222222";
const own = { id, estado: "pendiente", fechaSolicitud: "2026-10-24T10:00:00Z", dni: "30123456", quiereFiscalizar: false };
const values = { confirmacion: true, dni: "30123456", telefono: "+5493411234567", ciudadId: city, quiereFiscalizar: false };
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
function setup(handler) {
  const calls = [];
  const account = createAccountService({ baseUrl: "https://api.example.invalid", fetchImpl: async (url, init) => {
    const call = { path: new URL(url).pathname, query: new URL(url).searchParams, ...init }; calls.push(call);
    if (call.path.endsWith("/login")) return json({ tokenType: "Bearer", token: `token.${calls.length}.signature`, expiresAt: new Date(Date.now() + 900000).toISOString() });
    if (call.path.endsWith("/cerrar-sesion")) return new Response(null, { status: 204 });
    if (call.path === "/api/Usuario/me") return json({ idUsuario: id, email: "test@example.invalid", nombre: "Prueba" });
    return handler(call, calls);
  } });
  return { account, affiliation: createAffiliationService(account), calls };
}

test("afiliación anónima no consulta API; el servicio no agrega polling", async () => {
  const { affiliation, calls } = setup(() => assert.fail());
  assert.equal(affiliation.getSnapshot().status, "idle");
  assert.equal(calls.length, 0);
  await assert.rejects(affiliation.loadOwn(), { status: 401 });
  assert.equal(calls.length, 0);
});
test("formulario solo envía campos permitidos, mantiene fiscalización false y requiere confirmación", () => {
  assert.deepEqual(affiliationBody({ ...values, usuarioId: "forged", email: "forged", estado: "aprobada" }), values);
  for (const invalid of [{ confirmacion: false }, { dni: "12.345.678" }, { telefono: "        " }, { telefono: "javascript:alert(1)" }, { ciudadId: "Rosario" }, { quiereFiscalizar: "false" }, { quiereFiscalizar: undefined }]) {
    assert.throws(() => affiliationBody({ ...values, ...invalid }));
  }
});
test("404 propio se distingue de error y se comparte sin repetir consultas", async () => {
  const { account, affiliation, calls } = setup(() => json({ title: "Sin solicitud" }, 404));
  await account.login({});
  assert.deepEqual(await Promise.all([affiliation.loadOwn(), affiliation.loadOwn()]), [null, null]);
  await affiliation.loadOwn();
  assert.equal(calls.length, 2);
  assert.equal(affiliation.getSnapshot().status, "ready");
  assert.equal(affiliation.getSnapshot().checked, true);
});
test("una solicitud existente se muestra y no vuelve a enviarse", async () => {
  const { account, affiliation, calls } = setup(() => json(own));
  await account.login({}); await affiliation.loadOwn();
  assert.deepEqual(await affiliation.submit(values), own);
  assert.equal(calls.filter(call => call.method === "POST").length, 1); // solo login
});
test("crear confirma mediante estado propio y refresca una vez el perfil", async () => {
  let saved = false;
  const { account, affiliation, calls } = setup(call => {
    if (call.method === "POST") { saved = true; assert.deepEqual(JSON.parse(call.body), values); return json({ id, estado: "pendiente" }, 201); }
    return saved ? json(own) : json({}, 404);
  });
  await account.login({}); const result = await affiliation.submit(values);
  assert.equal(result.id, id); assert.equal(affiliation.getSnapshot().request.id, id);
  assert.equal(calls.filter(call => call.path.endsWith("SolicitudAfiliacion/me")).length, 2);
  assert.equal(calls.filter(call => call.path === "/api/Usuario/me").length, 1);
});
test("corte de red después de guardar se recupera con GET, sin otro POST", async () => {
  let saved = false;
  const { account, affiliation, calls } = setup(call => {
    if (call.method === "POST") { saved = true; throw new TypeError("desconexión"); }
    return saved ? json(own) : json({}, 404);
  });
  await account.login({}); assert.equal((await affiliation.submit(values)).id, id);
  assert.equal(calls.filter(call => call.path === "/api/SolicitudAfiliacion" && call.method === "POST").length, 1);
  assert.equal(calls.filter(call => call.path.endsWith("SolicitudAfiliacion/me")).length, 2);
});
test("un 409 de alta recupera la solicitud existente", async () => {
  let saved = false;
  const { account, affiliation } = setup(call => {
    if (call.method === "POST") { saved = true; return json({ title: "Duplicada" }, 409); }
    return saved ? json(own) : json({}, 404);
  });
  await account.login({}); assert.equal((await affiliation.submit(values)).id, id);
});
test("429 no se reintenta y conserva Retry-After para bloquear el botón", async () => {
  const { account, affiliation, calls } = setup(call => call.method === "POST" ? json({ title: "Esperá" }, 429, { "Retry-After": "30" }) : json({}, 404));
  await account.login({}); await assert.rejects(affiliation.submit(values), error => error.status === 429 && error.retryAfterSeconds === 30);
  assert.equal(calls.length, 3);
  assert.equal(affiliation.getSnapshot().checked, true);
});
test("validación incorrecta no llega a POST y un catálogo privado mal formado no simula éxito", async () => {
  const { account, affiliation, calls } = setup(() => json({ id, estado: "desconocido" }));
  await account.login({}); await assert.rejects(affiliation.submit({ ...values, dni: "" }));
  assert.equal(calls.length, 1);
  await assert.rejects(affiliation.loadOwn(), { code: "invalid_response" });
  assert.equal(affiliation.getSnapshot().status, "error");
});
test("cierre y nuevo login eliminan DNI y estado de la cuenta anterior", async () => {
  const { account, affiliation } = setup(() => json(own));
  await account.login({}); await affiliation.loadOwn(); await account.logout();
  assert.equal(affiliation.getSnapshot().request, null);
  await account.login({}); assert.equal(affiliation.getSnapshot().checked, false);
});
test("respuesta atrasada de otra sesión no mezcla información privada", async () => {
  let finish, oldSignal;
  const { account, affiliation } = setup(call => new Promise(resolve => { finish = resolve; oldSignal = call.signal; }));
  await account.login({}); const waiting = affiliation.loadOwn(); await new Promise(resolve => setImmediate(resolve));
  await account.login({}); assert.equal(oldSignal.aborted, true); finish(json(own));
  await assert.rejects(waiting, { name: "AbortError" });
  assert.equal(affiliation.getSnapshot().request, null);
  assert.equal(affiliation.getSnapshot().status, "idle");
});
test("la lectura propia encolada no se ejecuta con el token de otra sesión", async () => {
  let state = { authenticated: true, sessionId: 1 }, changed, calls = 0;
  const account = { getSnapshot: () => state, subscribe: listener => { changed = listener; },
    api: { request: () => { calls++; assert.fail("No consultar otra cuenta"); } } };
  const affiliation = createAffiliationService(account), waiting = affiliation.loadOwn();
  state = { authenticated: true, sessionId: 2 }; changed();
  await assert.rejects(waiting, { name: "AbortError" }); assert.equal(calls, 0);
});
test("administración envía filtros/cursor, JWT y no-store sin consultar detalles por fila", async () => {
  const { account, affiliation, calls } = setup(() => json({ items: [{ id, estado: "aprobada" }], siguienteCursor: null }));
  await account.login({}); await affiliation.list({ estado: "aprobada", cursor: id, limite: 10 });
  const call = calls.at(-1);
  assert.equal(call.path, "/api/SolicitudAfiliacion"); assert.equal(call.query.get("estado"), "aprobada"); assert.equal(call.query.get("cursor"), id);
  assert.equal(call.cache, "no-store"); assert.ok(call.headers.get("Authorization")); assert.equal(calls.length, 2);
  await assert.rejects(affiliation.list({ estado: "todas" })); assert.equal(calls.length, 2);
});
test("aprobar y rechazar son acciones explícitas; resolución no reintenta ni agrega consultas", async () => {
  const { account, affiliation, calls } = setup(() => new Response(null, { status: 204 }));
  await account.login({}); await affiliation.resolve(id, "aprobar", "", undefined);
  assert.deepEqual(JSON.parse(calls.at(-1).body), { observacion: null });
  await affiliation.resolve(id, "rechazar", "Un motivo público claro.", undefined);
  assert.deepEqual(JSON.parse(calls.at(-1).body), { motivo: "Un motivo público claro." });
  await assert.rejects(affiliation.resolve(id, "rechazar", "corto"));
  assert.equal(calls.length, 3);
});
test("acceso y retorno de login admiten roles y rutas exactos", () => {
  assert.equal(isAdministrator({ roleNombre: "Usuario" }), false);
  assert.equal(isAdministrator({ roleNombre: "Admin" }), true);
  assert.equal(isAdministrator({ roleNombre: "SuperAdmin" }), true);
  assert.equal(accountReturn(affiliationReturn), affiliationReturn);
  assert.equal(accountReturn("https://evil.example.invalid"), "/mi-cuenta");
  assert.equal(accountReturn("//evil.example.invalid"), "/mi-cuenta");
});
