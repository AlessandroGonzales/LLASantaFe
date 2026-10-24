import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, createApiClient } from "../src/lib/apiClient.js";
import { createAccountService } from "../src/lib/accountService.js";
import { captureAccountCode, clearAccountCode, getAccountCode, validateNewPassword } from "../src/lib/accountLinks.js";

const origin = "https://api.example.invalid";
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });
const session = token => ({ token, tokenType: "Bearer", expiresAt: new Date(Date.now() + 900000).toISOString() });
const profile = { idUsuario: "test-user", email: "test@example.invalid", nombre: "Ana", apellido: "Prueba" };
function setup(handler) {
  const calls = [];
  const service = createAccountService({ baseUrl: origin, fetchImpl: async (url, init) => {
    const call = { path: new URL(url).pathname, ...init }; calls.push(call);
    return handler ? handler(call, calls) : call.path.endsWith("login") ? json(session("test.token.signature")) : json(profile);
  } });
  return { service, calls };
}

test("crear el servicio y leer la sesión no consulta la API ni persiste credenciales", () => {
  const { service, calls } = setup();
  assert.equal(service.getSnapshot().authenticated, false);
  assert.equal(service.getSnapshot().profile, null);
  assert.equal(calls.length, 0);
  assert.equal("token" in service.getSnapshot(), false);
});
test("el cliente separa origen .NET y ruta, omite cookies y no agrega JWT a endpoints públicos", async () => {
  const calls = [];
  const client = createApiClient({ baseUrl: `${origin}/`, getToken: () => "private.token", fetchImpl: async (url, init) => { calls.push({ url, ...init }); return json({ ok: true }); } });
  await client.request("/api/Usuario/login", { method: "POST", body: { email: "a@example.invalid" }, headers: { Authorization: "injected" } });
  await client.request("/api/Usuario/me", { auth: true });
  assert.equal(calls[0].url, `${origin}/api/Usuario/login`);
  assert.equal(calls[0].headers.has("Authorization"), false);
  assert.equal(calls[1].headers.get("Authorization"), "Bearer private.token");
  assert.equal(calls[1].cache, "no-store");
  for (const call of calls) { assert.equal(call.credentials, "omit"); assert.equal(call.redirect, "error"); }
});
test("origen ausente, credenciales en URL, ruta duplicada y HTTP público se rechazan sin fetch", async () => {
  for (const baseUrl of [undefined, "", "http://api.example.invalid", "https://user:secret@example.invalid", `${origin}/api`, `${origin}?secret=x`]) {
    const client = createApiClient({ baseUrl, fetchImpl: () => assert.fail("No debe consultar un origen inválido") });
    assert.equal(client.configured, false);
    await assert.rejects(client.request("/api/Usuario"), { code: "configuration" });
  }
  const local = createApiClient({ baseUrl: "http://localhost:5275", allowLocalHttp: true, fetchImpl: async () => json({}) });
  assert.equal(local.configured, true);
  await assert.rejects(local.request("https://other.example.invalid/api/Usuario"), ApiError);
});
test("una petición privada sin sesión no llega a la red", async () => {
  await assert.rejects(createApiClient({ baseUrl: origin, fetchImpl: () => assert.fail() }).request("/api/Usuario/me", { auth: true }), { status: 401 });
});
test("204 no intenta leer JSON; una respuesta exitosa inválida no se presenta como éxito", async () => {
  const client = createApiClient({ baseUrl: origin, fetchImpl: async () => new Response(null, { status: 204 }) });
  assert.equal(await client.request("/api/Usuario/email/confirmar", { method: "POST" }), null);
  const broken = createApiClient({ baseUrl: origin, fetchImpl: async () => new Response("<html>proxy</html>") });
  await assert.rejects(broken.request("/api/Usuario"), { code: "invalid_response" });
});
test("ProblemDetails conserva validaciones, traceId y Retry-After sin reintentos", async () => {
  let calls = 0;
  const client = createApiClient({ baseUrl: origin, fetchImpl: async () => { calls++; return json({ title: "Esperá", code: "rate_limit", traceId: "fixture", errors: { Email: ["Email inválido"] } }, 429, { "Retry-After": "30" }); } });
  await assert.rejects(client.request("/api/Usuario"), error => {
    assert.equal(error.status, 429); assert.equal(error.code, "rate_limit"); assert.equal(error.traceId, "fixture");
    assert.equal(error.retryAfterSeconds, 30); assert.deepEqual(error.errors.Email, ["Email inválido"]); return true;
  });
  assert.equal(calls, 1);
});
test("un 401 de login público y un 403 no revocan otra sesión", async () => {
  let clears = 0;
  const client = createApiClient({ baseUrl: origin, getToken: () => "token", onUnauthorized: () => clears++, fetchImpl: async (_url, init) => json({ title: "Rechazado" }, init.headers.has("Authorization") ? 403 : 401) });
  await assert.rejects(client.request("/api/Usuario/login"), { status: 401 });
  await assert.rejects(client.request("/api/Encuesta/administracion", { auth: true }), { status: 403 });
  assert.equal(clears, 0);
});
test("errores de binding se presentan en español sin posiciones ni detalles del JSON", async () => {
  const client = createApiClient({ baseUrl: origin, fetchImpl: async () => json({ title: "One or more validation errors occurred.",
    errors: { request: ["The request field is required."], "$.fechaNacimiento": ["The JSON value could not be converted. LineNumber: 0 | BytePositionInLine: 144."] } }, 400) });
  await assert.rejects(client.request("/api/Usuario", { method: "POST", body: {} }), error => {
    assert.equal(error.message, "Revisá los datos indicados.");
    assert.deepEqual(Object.values(error.errors).flat(), ["Revisá el formato de fecha de nacimiento."]);
    return true;
  });
});
test("timeout y cancelación no reintentan una escritura", async () => {
  let calls = 0;
  const client = createApiClient({ baseUrl: origin, timeoutMs: 10, fetchImpl: (_url, init) => new Promise((_resolve, reject) => {
    calls++; init.signal.addEventListener("abort", () => reject(init.signal.reason), { once: true });
  }) });
  await assert.rejects(client.request("/api/Usuario", { method: "POST", body: {} }), { code: "timeout" });
  const abort = new AbortController();
  const pending = client.request("/api/Usuario", { signal: abort.signal }); abort.abort();
  await assert.rejects(pending, { name: "AbortError" }); assert.equal(calls, 2);
  await assert.rejects(client.request("/api/Usuario", { signal: abort.signal }), { name: "AbortError" });
  assert.equal(calls, 2);
});
test("perfil compartido: una sola lectura concurrente y reutilización al navegar", async () => {
  const { service, calls } = setup();
  await service.login({ email: "test@example.invalid", password: "synthetic-password" });
  assert.equal(calls.length, 1);
  const results = await Promise.all([service.loadProfile(), service.loadProfile()]);
  assert.deepEqual(results, [profile, profile]);
  await service.loadProfile();
  assert.equal(calls.length, 2);
  assert.equal(service.getSnapshot().profileStatus, "ready");
  assert.equal("token" in service.getSnapshot(), false);
});
test("una escritura con desconexión mantiene resultado incierto y no se reenvía", async () => {
  let calls = 0;
  const client = createApiClient({ baseUrl: origin, fetchImpl: async () => { calls++; throw new TypeError("network"); } });
  await assert.rejects(client.request("/api/Usuario", { method: "POST", body: {} }), error => {
    assert.equal(error.code, "network"); assert.match(error.message, /No pudimos confirmar/); return true;
  });
  assert.equal(calls, 1);
});
test("respuesta 401 atrasada no cierra una sesión nueva", async () => {
  let finish, login = 0;
  const { service } = setup(call => call.path.endsWith("login") ? json(session(`token.${++login}.signature`)) : new Promise(resolve => { finish = resolve; }));
  await service.login({});
  const old = service.api.request("/api/private", { auth: true });
  await service.login({}); finish(json({ title: "Viejo" }, 401));
  await assert.rejects(old, { status: 401 });
  assert.equal(service.getSnapshot().authenticated, true);
  assert.equal(service.getSnapshot().sessionId, 2);
});
test("logout limpia la sesión local aunque falle el servidor y no hace polling", async () => {
  const { service, calls } = setup(call => call.path.endsWith("login") ? json(session("token.one.signature")) : json({ title: "Sin conexión" }, 503));
  await service.login({}); await assert.rejects(service.logout(), { status: 503 });
  assert.equal(service.getSnapshot().authenticated, false); assert.equal(service.getSnapshot().profile, null);
  assert.equal(calls.length, 2);
});
test("expiración limpia el perfil y bloquea la próxima petición sin consultar al servidor", async () => {
  const start = Date.now(); let clock = start, fire;
  const service = createAccountService({ baseUrl: origin, now: () => clock, schedule: callback => { fire = callback; return 1; }, cancel: () => {},
    fetchImpl: async () => json({ ...session("token.one.signature"), expiresAt: new Date(start + 1000).toISOString() }) });
  await service.login({}); clock = start + 1001; fire();
  assert.equal(service.getSnapshot().authenticated, false);
  await assert.rejects(service.api.request("/api/Usuario/me", { auth: true }), { status: 401 });
});
test("cambio de sesión aborta la lectura del perfil anterior y no mezcla sus datos", async () => {
  let pendingSignal, finish;
  const { service } = setup(call => call.path.endsWith("login") ? json(session("token.one.signature")) : new Promise(resolve => { pendingSignal = call.signal; finish = resolve; }));
  await service.login({}); const old = service.loadProfile(); await new Promise(resolve => setImmediate(resolve));
  await service.login({}); assert.equal(pendingSignal.aborted, true); finish(json(profile));
  await assert.rejects(old, { name: "AbortError" }); assert.equal(service.getSnapshot().profile, null);
});
test("PATCH exitoso actualiza una vez el perfil y recuperación elimina la sesión local", async () => {
  let saved = false;
  const { service, calls } = setup(call => {
    if (call.path.endsWith("login")) return json(session("token.one.signature"));
    if (call.method === "PATCH") { saved = true; return new Response(null, { status: 204 }); }
    if (call.path.endsWith("restablecer")) return new Response(null, { status: 204 });
    return json({ ...profile, nombre: saved ? "Actualizada" : "Ana" });
  });
  await service.login({}); await service.loadProfile(); await service.patchProfile({ nombre: "Actualizada" });
  assert.equal(service.getSnapshot().profile.nombre, "Actualizada");
  assert.equal(calls.filter(call => call.method === "PATCH").length, 1);
  assert.equal(calls.filter(call => call.path === "/api/Usuario/me" && call.method === "GET").length, 2);
  await service.resetPassword({ codigo: "synthetic", nuevaPassword: "synthetic-password" });
  assert.equal(service.getSnapshot().authenticated, false);
});
test("baja fallida conserva sesión; baja confirmada la elimina", async () => {
  let fail = true;
  const { service } = setup(call => call.path.endsWith("login") ? json(session("token.one.signature")) : fail ? json({ title: "No disponible" }, 503) : new Response(null, { status: 204 }));
  await service.login({}); await assert.rejects(service.deactivate(), { status: 503 });
  assert.equal(service.getSnapshot().authenticated, true); fail = false; await service.deactivate();
  assert.equal(service.getSnapshot().authenticated, false);
});
test("enlaces de cuenta: quitar el fragmento preserva ruta/query y no consume automáticamente el código", () => {
  const code = "12345678-1234-1234-1234-123456789abc." + "a".repeat(43);
  let replaced;
  const history = { state: { keep: 1 }, replaceState: (...args) => { replaced = args; } };
  captureAccountCode({ pathname: "/verificar-email", search: "?lang=es", hash: `#codigo=${code}` }, history);
  assert.deepEqual(replaced, [{ keep: 1 }, "", "/verificar-email?lang=es"]);
  assert.equal(getAccountCode("/verificar-email"), code);
  assert.equal(getAccountCode("/restablecer-password"), null);
  clearAccountCode(); assert.equal(getAccountCode("/verificar-email"), null);
});
test("contraseña nueva: límite de bytes UTF-8 y confirmación", () => {
  assert.throws(() => validateNewPassword("corta", "corta"));
  assert.throws(() => validateNewPassword("á".repeat(37), "á".repeat(37)));
  assert.throws(() => validateNewPassword("Una-frase-de-prueba", "otra"));
  assert.doesNotThrow(() => validateNewPassword("á".repeat(36), "á".repeat(36)));
});
