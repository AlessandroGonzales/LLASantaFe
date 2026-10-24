import { Buffer } from "node:buffer";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { FormError, MAX_BODY_BYTES, validateFields } from "../shared/forms.js";
import { validateAttachment } from "./attachments.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RATE_SCRIPT = `
for i,key in ipairs(KEYS) do
  if tonumber(redis.call("GET",key) or "0") >= tonumber(ARGV[i*2-1]) then
    return {0, math.max(1,redis.call("TTL",key))}
  end
end
for i,key in ipairs(KEYS) do
  if redis.call("INCR",key) == 1 then redis.call("EXPIRE",key,ARGV[i*2]) end
end
return {1,0}
`;

const unavailable = () => new FormError("El servicio no está disponible por el momento. Intentá nuevamente más tarde.", 503, "service_unavailable");
const hmac = (secret, value) => createHmac("sha256", secret).update(value).digest("hex");

function config(env) {
  const required = ["FORMS_ALLOWED_ORIGINS", "TURNSTILE_SECRET_KEY", "GOOGLE_APPS_SCRIPT_URL",
    "GOOGLE_APPS_SCRIPT_SECRET", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"];
  if (required.some((name) => !env[name]) || env.GOOGLE_APPS_SCRIPT_SECRET.length < 32) throw unavailable();
  const origins = env.FORMS_ALLOWED_ORIGINS.split(",").map((value) => value.trim());
  if (origins.some((value) => {
    try {
      const url = new URL(value);
      return url.origin !== value || (url.protocol !== "https:" && !(env.VERCEL !== "1" && ["localhost", "127.0.0.1"].includes(url.hostname)));
    } catch { return true; }
  })) throw unavailable();
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(env.GOOGLE_APPS_SCRIPT_URL)) throw unavailable();
  if (!/^https:\/\/[\w.-]+\.upstash\.io\/?$/.test(env.UPSTASH_REDIS_REST_URL)) throw unavailable();
  function limit(name, fallback) {
    const number = Number(env[name] || fallback);
    if (!Number.isInteger(number) || number < 1 || number > 10000) throw unavailable();
    return number;
  }
  return { origins, ipLimit: limit("FORMS_IP_HOURLY_LIMIT", 5), dailyLimit: limit("FORMS_DAILY_LIMIT", 500) };
}

export function clientIp(req, env) {
  const header = req.headers["x-vercel-forwarded-for"];
  const ip = env.VERCEL === "1" ? header : req.socket?.remoteAddress;
  if (typeof ip !== "string" || !isIP(ip)) throw new FormError("No se pudo verificar el origen de la solicitud.", 403);
  return ip.startsWith("::ffff:") && isIP(ip.slice(7)) === 4 ? ip.slice(7) : ip;
}

export function ipBucket(ip) {
  if (isIP(ip) === 4) return ip;
  const [left, right = ""] = ip.split("::");
  const a = left ? left.split(":") : [];
  const b = right ? right.split(":") : [];
  const groups = ip.includes("::") ? [...a, ...Array(8 - a.length - b.length).fill("0"), ...b] : a;
  return groups.slice(0, 4).map((group) => Number.parseInt(group, 16).toString(16)).join(":") + "::/64";
}

async function readBody(req) {
  if (Number(req.headers["content-length"] || 0) > MAX_BODY_BYTES) throw new FormError("El envío es demasiado grande. El máximo por documento es 2 MB.", 413);
  let raw = req.body;
  if (raw === undefined) {
    const chunks = [];
    let length = 0;
    for await (const chunk of req) {
      const bytes = Buffer.from(chunk);
      length += bytes.length;
      if (length > MAX_BODY_BYTES) throw new FormError("El envío es demasiado grande.", 413);
      chunks.push(bytes);
    }
    raw = Buffer.concat(chunks).toString("utf8");
  }
  if (Buffer.isBuffer(raw)) raw = raw.toString("utf8");
  if (Buffer.byteLength(typeof raw === "string" ? raw : JSON.stringify(raw)) > MAX_BODY_BYTES) throw new FormError("El envío es demasiado grande.", 413);
  try {
    const body = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!body || Array.isArray(body) || typeof body !== "object") throw new Error();
    return body;
  } catch { throw new FormError("El formulario no pudo leerse."); }
}

export function createFormsHandler({ env = process.env, fetchImpl = fetch, now = Date.now } = {}) {
  async function jsonFetch(url, options, timeout = 8000) {
    try {
      const response = await fetchImpl(url, { ...options, signal: AbortSignal.timeout(timeout) });
      if (!response.ok) throw unavailable();
      return await response.json();
    } catch { throw unavailable(); }
  }

  async function rateLimit(keys, limits) {
    const result = await jsonFetch(env.UPSTASH_REDIS_REST_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", RATE_SCRIPT, String(keys.length), ...keys, ...limits.flat().map(String)]),
    }, 4000);
    if (!Array.isArray(result.result) || result.result.length !== 2) throw unavailable();
    if (result.result[0] === 0) {
      const error = new FormError("Se alcanzó el límite de envíos. Esperá un momento antes de volver a intentar.", 429, "rate_limited");
      error.retryAfter = Math.max(1, Number(result.result[1]) || 60);
      throw error;
    }
    if (result.result[0] !== 1) throw unavailable();
  }

  return async function formsHandler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ ok: false, message: "Método no permitido." });
    }
    try {
      const settings = config(env);
      const origin = req.headers.origin;
      if (!settings.origins.includes(origin)) throw new FormError("Origen no autorizado.", 403, "invalid_origin");
      if (!/^application\/json(?:;|$)/i.test(req.headers["content-type"] || "")) throw new FormError("Formato no permitido.", 415);
      const ip = clientIp(req, env);
      const namespace = env.FORMS_RATE_NAMESPACE || "lla:forms:v1";
      const ipHash = hmac(env.GOOGLE_APPS_SCRIPT_SECRET, ipBucket(ip));
      await rateLimit([`${namespace}:attempt:${ipHash}`, `${namespace}:attempt:global`], [[20, 600], [3000, 600]]);
      const body = await readBody(req);
      if (body.website !== "") throw new FormError("No se pudo verificar la solicitud.", 400, "verification_failed");
      if (!UUID.test(body.requestId || "")) throw new FormError("Identificador de envío inválido.");
      const data = validateFields(body.kind, body.data);
      if (typeof body.token !== "string" || !body.token || body.token.length > 2048) {
        throw new FormError("Completá la verificación de seguridad e intentá nuevamente.", 400, "verification_failed");
      }
      const verification = await jsonFetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: body.token, remoteip: ip }),
      });
      if (verification.success !== true || verification.hostname !== new URL(origin).hostname || verification.action !== body.kind) {
        throw new FormError("La verificación de seguridad venció o no es válida. Volvé a intentar.", 400, "verification_failed");
      }
      const attachment = body.kind === "propone" ? validateAttachment(body.data) : null;
      await rateLimit([`${namespace}:submit:${ipHash}`, `${namespace}:submit:global`], [[settings.ipLimit, 3600], [settings.dailyLimit, 86400]]);
      const fingerprint = hmac(env.GOOGLE_APPS_SCRIPT_SECRET, JSON.stringify({ kind: body.kind, data, attachment }));
      const timestamp = String(now());
      const payload = JSON.stringify({
        schemaVersion: body.kind === "sumate" ? 2 : 1, requestId: body.requestId, kind: body.kind,
        receivedAt: new Date(Number(timestamp)).toISOString(), fingerprint, data, attachment,
      });
      const signature = hmac(env.GOOGLE_APPS_SCRIPT_SECRET, `${timestamp}.${payload}`);
      const saved = await jsonFetch(env.GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp, payload, signature }),
        redirect: "follow",
      }, 25000);
      if (saved.ok !== true || !UUID.test(saved.id || "")) throw unavailable();
      // La respuesta no expone datos personales ni enlaces a documentos privados.
      return res.status(200).json({ ok: true, id: saved.id });
    } catch (error) {
      if (error.retryAfter) res.setHeader("Retry-After", String(error.retryAfter));
      const known = error instanceof FormError;
      return res.status(known ? error.status : 503).json({
        ok: false, code: known ? error.code : "service_unavailable",
        message: known ? error.message : unavailable().message,
      });
    }
  };
}
