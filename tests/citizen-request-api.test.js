import assert from "node:assert/strict";
import test from "node:test";
import { createAccountService } from "../src/lib/accountService.js";
import { citizenRequestBody, citizenMotives, createCitizenRequestService } from "../src/lib/citizenRequestService.js";
import { accountReturn } from "../src/lib/affiliationFormat.js";

const id = "11111111-1111-4111-8111-111111111111", key = "22222222-2222-4222-8222-222222222222";
const body = { motivo: "proyecto", mensaje: "Propongo mejorar la accesibilidad de los edificios públicos. Áreas de atención. 🏛️" };
const item = { id, motivo: "proyecto", estado: "pendiente", revision: 1, createdAt: "2026-10-24T10:00:00Z", tienePdf: false };
const detail = { ...item, mensaje: body.mensaje, respuesta: null, updatedAt: item.createdAt };
const page = { items: [item], siguienteCursor: null };
const receipt = { id, estado: "recibida" };
const json = (value, status = 200, headers = {}) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json", ...headers } });
function setup(handler = () => json(page), options = {}) {
  const calls = []; let ids = 0;
  const account = createAccountService({ baseUrl: "https://api.example.invalid", fetchImpl: async (url, init) => {
    const call = { path: new URL(url).pathname, query: new URL(url).searchParams, ...init }; calls.push(call);
    if (call.path.endsWith("/login")) return json({ tokenType: "Bearer", token: `token.${calls.length}.signature`, expiresAt: new Date(Date.now() + 900000).toISOString() });
    if (call.path.endsWith("/cerrar-sesion")) return new Response(null, { status: 204 });
    return handler(call, calls);
  } });
  return { account, calls, service: createCitizenRequestService(account, { newId: () => { ids++; return ids === 1 ? key : id; }, ...options }) };
}
const turn = () => new Promise(resolve => setImmediate(resolve));
test("la creación del servicio no consulta; los anónimos no leen ni envían", async () => {
  const { service, calls } = setup(() => assert.fail());
  assert.equal(calls.length, 0); await assert.rejects(service.list(), { status: 401 });
  await assert.rejects(service.submit(body), { status: 401 }); assert.equal(calls.length, 0);
});
test("contrato con cinco motivos, sin reenviar identidad/contacto/estado/archivo", () => {
  assert.equal(Object.keys(citizenMotives).length, 5);
  for (const motivo of Object.keys(citizenMotives)) assert.deepEqual(citizenRequestBody({ ...body, motivo, mensaje: `  ${body.mensaje}\n`, usuarioId: id, email: "forged", telefono: "forged", pdfUrl: "forged", estado: "resuelta" }), { ...body, motivo });
  for (const extra of [{ motivo: "consulta" }, { motivo: ["duda"] }, { motivo: "__proto__" }, { mensaje: " " .repeat(20) }, { mensaje: "corto" }, { mensaje: "a".repeat(5001) }, { mensaje: "válido pero\0nulo" }, { mensaje: "mensaje inválido \ud800" }]) assert.throws(() => citizenRequestBody({ ...body, ...extra }));
  assert.equal(citizenRequestBody({ ...body, mensaje: "a".repeat(5000) }).mensaje.length, 5000);
});
test("listado privado compartido, TTL 30 s y actualización manual; sin detalle por fila", async () => {
  let clock = 1000;
  const { account, service, calls } = setup(() => json(page), { now: () => clock }); await account.login({});
  const [a, b] = await Promise.all([service.list(), service.list()]); assert.equal(a, b);
  await service.list(); assert.equal(calls.length, 2);
  assert.equal(calls[1].query.get("limite"), "20"); assert.equal(calls[1].headers.has("Authorization"), true); assert.equal(calls[1].cache, "no-store");
  clock += 30001; await service.list(); await service.list({ force: true }); assert.equal(calls.length, 4);
});
test("listado valida filtros, cursor, duplicados y no conserva datos extra", async () => {
  const { account, service, calls } = setup(() => json({ items: [{ ...item, mensaje: "no conservar", email: "privado" }], siguienteCursor: key })); await account.login({});
  const result = await service.list({ estado: "pendiente", cursor: key }); assert.deepEqual(result.items[0], item);
  assert.equal(calls[1].query.get("cursor"), key); assert.equal(calls[1].query.get("estado"), "pendiente");
  for (const options of [{ estado: "aprobada" }, { cursor: "../administracion" }, { limite: 51 }, { limite: 0 }]) await assert.rejects(service.list(options));
  const bad = setup(() => json({ items: [item, item], siguienteCursor: null })); await bad.account.login({}); await assert.rejects(bad.service.list(), { code: "invalid_response" });
});
test("detalle solo bajo demanda, texto sin interpretar y sin datos administrativos", async () => {
  const { account, service, calls } = setup(() => json({ ...detail, mensaje: "<script>alert('x')</script>", gestionadoPor: id, email: "privado" })); await account.login({});
  const value = await service.detail(id); assert.equal(value.mensaje, "<script>alert('x')</script>"); assert.equal(Object.hasOwn(value, "gestionadoPor"), false);
  await service.detail(id); assert.equal(calls.length, 2);
});
test("crear confirma con un POST y clave UUID; no relee perfil ni bytes PDF", async () => {
  const { account, service, calls } = setup(() => json(receipt, 201)); await account.login({});
  assert.deepEqual(await service.submit({ ...body, email: "forged" }), receipt);
  assert.equal(calls.length, 2); assert.deepEqual(JSON.parse(calls[1].body), body); assert.equal(calls[1].headers.get("Idempotency-Key"), key);
  assert.equal(service.getSnapshot().status, "confirmed"); await assert.rejects(service.submit(body)); assert.equal(calls.length, 2);
});
test("doble clic no genera dos escrituras", async () => {
  let finish; const { account, service, calls } = setup(() => new Promise(resolve => { finish = resolve; })); await account.login({});
  const first = service.submit(body); await assert.rejects(service.submit(body)); finish(json(receipt, 201)); await first;
  assert.equal(calls.length, 2);
});
test("pérdida de respuesta conserva clave/cuerpo: solo reintento manual recupera 200", async () => {
  let attempt = 0; const { account, service, calls } = setup(() => { if (!attempt++) throw new TypeError("corte de red"); return json(receipt); }); await account.login({});
  await assert.rejects(service.submit(body), { code: "network" }); assert.equal(service.getSnapshot().status, "uncertain"); await turn(); assert.equal(calls.length, 2);
  await assert.rejects(service.submit({ ...body, mensaje: "Un mensaje diferente y nuevo." })); assert.throws(() => service.startNew());
  assert.deepEqual(await service.retry(), receipt); assert.equal(calls[1].body, calls[2].body); assert.equal(calls[1].headers.get("Idempotency-Key"), calls[2].headers.get("Idempotency-Key"));
});
test("429 conserva Retry-After y reintentar respeta la misma operación, sin bucles", async () => {
  const { account, service, calls } = setup(() => json({ title: "Cupo alcanzado", code: "rate_limited" }, 429, { "Retry-After": "30" })); await account.login({});
  await assert.rejects(service.submit(body), error => error.retryAfterSeconds === 30); assert.equal(service.getSnapshot().status, "uncertain"); await turn(); assert.equal(calls.length, 2);
});
test("400 explícito permite corregir mensaje y genera nueva operación", async () => {
  let attempt = 0; const { account, service, calls } = setup(() => attempt++ ? json(receipt, 201) : json({ title: "Revisá el mensaje" }, 400)); await account.login({});
  await assert.rejects(service.submit(body), { status: 400 }); assert.equal(service.getSnapshot().status, "rejected");
  await service.submit({ ...body, mensaje: "Mensaje corregido con todos los detalles necesarios." }); assert.notEqual(calls[1].headers.get("Idempotency-Key"), calls[2].headers.get("Idempotency-Key"));
});
test("respuesta inválida o 5xx no simula éxito ni permite una creación diferente", async () => {
  for (const response of [() => json({ id, estado: "pendiente" }, 201), () => json({ title: "No disponible" }, 503), () => json({ code: "idempotency_conflict" }, 409)]) {
    const { account, service } = setup(response); await account.login({}); await assert.rejects(service.submit(body)); assert.equal(service.getSnapshot().status, "uncertain"); assert.equal(service.getSnapshot().receipt, null);
  }
});
test("cancelar navegación mantiene un envío incierto para recuperar con la misma clave", async () => {
  let finish; const { account, service, calls } = setup(() => new Promise(resolve => { finish = resolve; })); await account.login({});
  const controller = new AbortController(), promise = service.submit(body, controller.signal); controller.abort(); finish(json(receipt, 201)); await assert.rejects(promise, { name: "AbortError" });
  assert.equal(service.getSnapshot().status, "uncertain"); assert.equal(service.getSnapshot().operation.key, key); assert.equal(calls.length, 2);
});
test("nuevo envío solo tras confirmar; invalida listado anterior", async () => {
  let saved = false;
  const { account, service, calls } = setup(call => { if (call.method === "POST") { saved = true; return json(receipt, 201); } return json(saved ? page : { items: [], siguienteCursor: null }); }); await account.login({});
  await service.list(); await service.submit(body); assert.equal((await service.list()).items.length, 1); service.startNew(); assert.equal(service.getSnapshot().operation, null); await service.submit(body);
  assert.notEqual(calls[2].headers.get("Idempotency-Key"), calls[4].headers.get("Idempotency-Key"));
});
test("cierre de sesión borra mensaje, comprobante y caché privada", async () => {
  const { account, service, calls } = setup(call => call.method === "POST" ? json(receipt, 201) : json(page)); await account.login({}); await service.list(); await service.submit(body); await account.logout();
  assert.equal(service.getSnapshot().status, "idle"); assert.equal(service.getSnapshot().receipt, null); assert.equal(service.getSnapshot().operation, null); await account.login({}); await service.list(); assert.equal(calls.length, 6);
});
test("lectura atrasada no mezcla cuentas aunque el transporte ignore cancelación", async () => {
  let finish; const { account, service } = setup(() => new Promise(resolve => { finish = resolve; })); await account.login({}); const waiting = service.list(); await turn();
  await account.login({}); finish(json(page)); await assert.rejects(waiting, { name: "AbortError" }); assert.equal(service.getSnapshot().operation, null);
});
test("escritura atrasada de otra cuenta no confirma una solicitud en la sesión nueva", async () => {
  let finish; const { account, service } = setup(() => new Promise(resolve => { finish = resolve; })); await account.login({}); const waiting = service.submit(body); await account.login({}); finish(json(receipt, 201));
  await assert.rejects(waiting, { name: "AbortError" }); assert.equal(service.getSnapshot().status, "idle"); assert.equal(service.getSnapshot().receipt, null);
});
test("cancelar una lectura compartida conserva el otro consumidor", async () => {
  let finish; const { account, service, calls } = setup(() => new Promise(resolve => { finish = resolve; })); await account.login({}); const controller = new AbortController();
  const first = service.list({ signal: controller.signal }), second = service.list(); await turn(); controller.abort(); await assert.rejects(first, { name: "AbortError" }); finish(json(page)); assert.deepEqual(await second, page); assert.equal(calls.length, 2);
});
test("retorno de login admite Propone sin redirecciones externas", () => {
  assert.equal(accountReturn("/propone"), "/propone");
  for (const value of ["//evil.invalid/propone", "/propone?return=https://evil.invalid", "/propone/../mi-cuenta"]) assert.equal(accountReturn(value), "/mi-cuenta");
});

test("motivos históricos se leen como texto sin ampliar los valores de nuevas altas", async () => {
  const { account, service } = setup(() => json({ items: [{ ...item, motivo: "__proto__" }], siguienteCursor: null })); await account.login({});
  assert.equal((await service.list()).items[0].motivo, "__proto__");
  assert.throws(() => citizenRequestBody({ ...body, motivo: "__proto__" }));
});
test("la caché privada no supera 16 lecturas y vuelve a consultar las desalojadas", async () => {
  const { account, service, calls } = setup(call => json({ ...detail, id: call.path.split("/").at(-1) })); await account.login({}); await service.detail(id);
  for (let i = 1; i <= 16; i++) await service.detail(`00000000-0000-4000-8000-${String(i).padStart(12, "0")}`);
  await service.detail(id); assert.equal(calls.length, 19);
});
test("abortar el último consumidor impide guardar una lectura tardía", async () => {
  let finish, networkSignal;
  const { account, service, calls } = setup(call => { networkSignal = call.signal; return new Promise(resolve => { finish = resolve; }); }); await account.login({});
  const controller = new AbortController(), reading = service.list({ signal: controller.signal }); await turn(); controller.abort(); await assert.rejects(reading, { name: "AbortError" }); assert.equal(networkSignal.aborted, true);
  finish(json(page)); await turn(); const again = service.list(); await turn(); assert.equal(calls.length, 3); finish(json(page)); await again;
});
test("una lectura encolada no usa la sesión nueva", async () => {
  const { account, service, calls } = setup(() => json(page)); await account.login({}); const reading = service.list(); await account.login({}); await assert.rejects(reading, { name: "AbortError" });
  for (const call of calls.filter(call => call.path.startsWith("/api/SolicitudCiudadana"))) assert.equal(call.headers.get("Authorization"), "Bearer token.1.signature");
  await service.list(); assert.equal(calls.at(-1).headers.get("Authorization"), "Bearer token.2.signature");
  assert.equal(service.getSnapshot().receipt, null);
});
