import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { Buffer } from "node:buffer";
import { validateFields, MAX_FILE_BYTES } from "../shared/forms.js";
import { validateAttachment } from "../server/attachments.js";
import { createFormsHandler, ipBucket } from "../server/forms-handler.js";

const id = "12345678-1234-4123-8123-123456789abc";
const member = { nombre: "Persona de prueba", dni: "12345678", whatsapp: "+54 9 341 1234567", localidad: "Rosario", quiereFiscalizar: false, email: "prueba@example.com" };
const proposal = { nombre: "Persona de prueba", telefono: "341 1234567", email: "prueba@example.com", profesion: "otro", motivo: "proyecto", mensaje: "Propuesta ficticia para pruebas locales." };
const env = {
  VERCEL: "1", FORMS_ALLOWED_ORIGINS: "https://example.com",
  TURNSTILE_SECRET_KEY: "test-secret", GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/macros/s/test/exec",
  GOOGLE_APPS_SCRIPT_SECRET: "a".repeat(64), UPSTASH_REDIS_REST_URL: "https://test.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "test-only-token",
};
const attach = (name, bytes) => ({ fileName: name, fileType: "untrusted/type", fileData: bytes.toString("base64") });

function zip(entries) {
  let offset = 0;
  const locals = [], central = [];
  for (const [name, text] of Object.entries(entries)) {
    const filename = Buffer.from(name);
    const data = Buffer.from(text);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50);
    local.writeUInt32LE(data.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(filename.length, 26);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50);
    directory.writeUInt32LE(data.length, 20); directory.writeUInt32LE(data.length, 24);
    directory.writeUInt16LE(filename.length, 28); directory.writeUInt32LE(offset, 42);
    locals.push(local, filename, data); central.push(directory, filename);
    offset += local.length + filename.length + data.length;
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50);
  end.writeUInt16LE(Object.keys(entries).length, 8); end.writeUInt16LE(Object.keys(entries).length, 10);
  end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, directory, end]);
}

test("campos y tipos se validan y normalizan en servidor", () => {
  assert.equal(validateFields("sumate", { ...member, nombre: " Persona de prueba " }).nombre, member.nombre);
  assert.throws(() => validateFields("sumate", { ...member, dni: "1e7" }));
  assert.throws(() => validateFields("sumate", { ...member, quiereFiscalizar: "false" }));
  assert.throws(() => validateFields("propone", { ...proposal, profesion: "inventado" }));
  assert.throws(() => validateFields("propone", { ...proposal, mensaje: "x".repeat(10001) }));
  assert.throws(() => validateFields("propone", { ...proposal, email: "no-es-email" }));
  assert.throws(() => validateFields("sumate", { ...member, nombre: "  " }));
  assert.throws(() => validateFields("sumate", { ...member, whatsapp: "123" }));
});

test("Afiliate exige y normaliza un solo correo, sin listas ni cabeceras", () => {
  assert.equal(validateFields("sumate", { ...member, email: " PRUEBA@GMAIL.COM " }).email, "prueba@gmail.com");
  for (const email of [undefined, "", "incorrecto", "a@b.com,c@d.com", "a@b.com;c@d.com", "a@b.com\r\nBcc: c@d.com", "x".repeat(255) + "@gmail.com"]) {
    assert.throws(() => validateFields("sumate", { ...member, email }));
  }
});

test("archivos: firmas reales, tamaño, Base64 y MIME derivado del servidor", () => {
  const pdf = validateAttachment(attach("proyecto.pdf", Buffer.from("%PDF-1.7\nDocumento de prueba\n%%EOF")));
  assert.equal(pdf.mimeType, "application/pdf");
  assert.throws(() => validateAttachment(attach("virus.pdf", Buffer.from("MZ executable"))));
  assert.throws(() => validateAttachment(attach("virus.exe", Buffer.from("%PDF-1.7\n%%EOF"))));
  assert.throws(() => validateAttachment({ fileName: "x.pdf", fileData: "!@#$" }));
  assert.throws(() => validateAttachment(attach("x.txt", Buffer.alloc(MAX_FILE_BYTES + 1, 65))));
  assert.equal(validateAttachment(attach("x.txt", Buffer.alloc(MAX_FILE_BYTES, 65))).size, MAX_FILE_BYTES);
  assert.throws(() => validateAttachment(attach("x.txt", Buffer.from([0xff, 0xfe, 0]))));
  assert.equal(validateAttachment({ fileData: "", fileName: "", fileType: "" }), null);
});

test("DOCX exige estructura de Word y rechaza macros, rutas relativas y ZIP bombs", () => {
  const entries = {
    "[Content_Types].xml": '<Types><Override ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
    "word/document.xml": "<document>Prueba</document>",
  };
  assert.equal(validateAttachment(attach("propuesta.docx", zip(entries))).mimeType, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  assert.throws(() => validateAttachment(attach("propuesta.docx", zip({ "arbitrary.txt": "no es Word" }))));
  assert.throws(() => validateAttachment(attach("propuesta.docx", zip({ ...entries, "word/vbaProject.bin": "macro" }))));
  assert.throws(() => validateAttachment(attach("propuesta.docx", zip({ ...entries, "../escape.txt": "x" }))));
  const bomb = zip(entries);
  bomb.writeUInt32LE(100 * 1024 * 1024, bomb.indexOf(Buffer.from("504b0102", "hex")) + 24);
  assert.throws(() => validateAttachment(attach("propuesta.docx", bomb)));
});

test("direcciones IPv6 de una misma /64 comparten el límite", () => {
  assert.equal(ipBucket("2001:db8:1:2::1"), ipBucket("2001:db8:1:2::abcd"));
  assert.notEqual(ipBucket("2001:db8:1:3::1"), ipBucket("2001:db8:1:2::1"));
});

function fixture(overrides = {}) {
  const calls = [];
  const req = {
    method: "POST",
    headers: { origin: "https://example.com", "content-type": "application/json", "x-vercel-forwarded-for": "203.0.113.10" },
    body: { kind: "sumate", requestId: id, token: "valid-test-token", website: "", data: member },
  };
  const res = { headers: {}, setHeader(name, value) { this.headers[name] = value; },
    status(value) { this.statusCode = value; return this; }, json(value) { this.body = value; return this; } };
  let redisCall = 0;
  const fetchImpl = async (url, options) => {
    calls.push({ url, data: JSON.parse(options.body) });
    let data;
    if (url.includes("upstash")) {
      redisCall++;
      if (overrides.redisFailure) throw new Error("Redis unavailable");
      data = { result: overrides.blockRate === redisCall ? [0, 300] : [1, 0] };
    } else if (url.includes("cloudflare")) {
      data = { success: true, hostname: "example.com", action: "sumate", ...overrides.turnstile };
    } else {
      if (overrides.googleFailure) throw new Error("Google timeout");
      data = overrides.google || { ok: true, id };
    }
    return { ok: true, json: async () => data };
  };
  // Contrato histórico de Sheets: solo estas fixtures permiten el Sumate anterior.
  const handler = createFormsHandler({ env: { ...env, ...overrides.env }, fetchImpl,
    retiredKinds: Object.hasOwn(overrides, "retiredKinds") ? overrides.retiredKinds : [] });
  return { req, res, calls, run: () => handler(req, res) };
}

test("escritura confirmada, firma HMAC y ningún dato personal en la respuesta", async () => {
  const f = fixture();
  await f.run();
  assert.equal(f.res.statusCode, 200);
  assert.deepEqual(f.res.body, { ok: true, id });
  const envelope = f.calls.at(-1).data;
  assert.equal(envelope.signature, createHmac("sha256", env.GOOGLE_APPS_SCRIPT_SECRET).update(envelope.timestamp + "." + envelope.payload).digest("hex"));
  assert.deepEqual(JSON.parse(envelope.payload).data, member);
  assert.equal(JSON.parse(envelope.payload).schemaVersion, 2);
  assert.equal(f.calls[0].data.some(part => String(part).includes("203.0.113.10")), false);
  assert.equal(f.res.headers["Cache-Control"], "no-store");
});

test("Sumate retirado no verifica CAPTCHA ni escribe en Google Sheets", async () => {
  const f = fixture({ retiredKinds: undefined }); // Usa el valor por defecto real.
  await f.run();
  assert.equal(f.res.statusCode, 410);
  assert.equal(f.res.body.code, "form_retired");
  assert.equal(f.calls.some(call => call.url.includes("script.google.com") || call.url.includes("challenges.cloudflare.com")), false);
});

test("retirar Sumate conserva la recepción de propuestas", async () => {
  const f = fixture({ retiredKinds: undefined, turnstile: { action: "propone" } });
  f.req.body.kind = "propone"; f.req.body.data = proposal;
  await f.run();
  assert.equal(f.res.statusCode, 200);
  assert.equal(f.calls.some(call => call.url.includes("script.google.com")), true);
});

for (const [name, overrides, status] of [
  ["sin claves", { env: { TURNSTILE_SECRET_KEY: "" } }, 503],
  ["Redis caído: no abrir el acceso", { redisFailure: true }, 503],
  ["límite antes del CAPTCHA", { blockRate: 1 }, 429],
  ["límite de escrituras", { blockRate: 2 }, 429],
  ["token falso o repetido", { turnstile: { success: false } }, 400],
  ["token de otro dominio", { turnstile: { hostname: "attacker.example" } }, 400],
  ["token de otro formulario", { turnstile: { action: "propone" } }, 400],
  ["Google rechaza guardado", { google: { ok: false } }, 503],
  ["Google devuelve respuesta incompleta", { google: { ok: true } }, 503],
  ["Google no responde", { googleFailure: true }, 503],
]) test(name, async () => {
  const f = fixture(overrides);
  await f.run();
  assert.equal(f.res.statusCode, status);
  assert.equal(f.res.body.ok, false);
  if (!name.startsWith("Google")) assert.equal(f.calls.some(call => call.url.includes("script.google.com")), false);
});

test("origen, método, honeypot e IP no confiable se rechazan", async () => {
  for (const mutate of [
    req => { req.headers.origin = "https://attacker.example"; },
    req => { req.method = "GET"; },
    req => { req.body.website = "https://spam.example"; },
    req => { delete req.headers["x-vercel-forwarded-for"]; req.headers["x-forwarded-for"] = "1.1.1.1"; },
    req => { req.headers["content-length"] = "9999999"; },
  ]) {
    const f = fixture(); mutate(f.req); await f.run();
    assert.ok(f.res.statusCode >= 400);
    assert.equal(f.calls.some(call => call.url.includes("script.google.com")), false);
  }
});

test("propuesta adjunta: MIME corregido y todos los datos enviados con firma", async () => {
  const f = fixture({ turnstile: { action: "propone" } });
  f.req.body.kind = "propone";
  f.req.body.data = { ...proposal, ...attach("propuesta.pdf", Buffer.from("%PDF-1.7\n%%EOF")) };
  await f.run();
  assert.equal(f.res.statusCode, 200);
  const payload = JSON.parse(f.calls.at(-1).data.payload);
  assert.equal(payload.attachment.mimeType, "application/pdf");
  assert.deepEqual(payload.data, proposal);
});
