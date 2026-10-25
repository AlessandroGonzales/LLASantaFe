import { ApiError } from "./apiClient.js";
import { buildSurveyAnswers, parseSurveyConfiguration } from "./surveyContract.js";

const uuid = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i;
const invalid = () => new ApiError("No pudimos leer esta encuesta. Volvé a consultar la sección.", { code: "invalid_response" });
function receipt(value) {
  if (!uuid.test(value?.id) || !Number.isFinite(Date.parse(value?.createdAt))) throw invalid();
  return Object.freeze({ id: value.id, createdAt: value.createdAt });
}
function metadata(value) {
  if (!uuid.test(value?.id) || typeof value?.titulo !== "string" || !value.titulo.trim() ||
      (value.descripcion != null && typeof value.descripcion !== "string")) throw invalid();
  return { id: value.id, titulo: value.titulo, descripcion: value.descripcion ?? null,
    tipo: value.tipo, fechaInicio: value.fechaInicio ?? null, fechaFin: value.fechaFin ?? null };
}
export function createSurveyService(account, { now = Date.now } = {}) {
  // Caché acotada de lectura. Las respuestas del formulario permanecen en React.
  const cache = new Map(), pending = new Map(), sending = new Set();
  let sessionId = account.getSnapshot().sessionId, privateController = new AbortController();
  account.subscribe(() => {
    if (sessionId === account.getSnapshot().sessionId) return;
    sessionId = account.getSnapshot().sessionId; privateController.abort(); privateController = new AbortController(); sending.clear();
    for (const key of cache.keys()) if (key.startsWith("r:")) cache.delete(key);
    for (const [key, task] of pending) if (key.startsWith("r:")) { pending.delete(key); task.controller.abort(); }
  });
  function session() {
    if (!account.getSnapshot().authenticated) throw new ApiError("Ingresá con tu cuenta para responder.", { status: 401, code: "unauthorized" });
    return sessionId;
  }
  function save(key, value, ttl) {
    cache.delete(key); cache.set(key, { value, expires: now() + ttl });
    while (cache.size > 32) cache.delete(cache.keys().next().value);
    return value;
  }
  function read(key, loader, { force = false, signal, ttl = 30000 } = {}) {
    signal?.throwIfAborted();
    const cached = cache.get(key);
    if (!force && cached && cached.expires > now()) return Promise.resolve(cached.value);
    let task = pending.get(key);
    if (!task) {
      task = { controller: new AbortController(), users: new Set(), promise: null };
      const current = task;
      task.promise = Promise.resolve().then(() => { current.controller.signal.throwIfAborted(); return loader(current.controller.signal); })
        .then(value => { current.controller.signal.throwIfAborted(); return save(key, value, typeof ttl === "function" ? ttl(value) : ttl); })
        .finally(() => { if (pending.get(key) === current) pending.delete(key); });
      pending.set(key, task);
    }
    const current = task, consumer = {};
    current.users.add(consumer);
    return new Promise((resolve, reject) => {
      function release() { current.users.delete(consumer); signal?.removeEventListener("abort", abort); }
      function abort() {
        release(); reject(signal.reason || new DOMException("Lectura cancelada", "AbortError"));
        if (!current.users.size) { if (pending.get(key) === current) pending.delete(key); current.controller.abort(); }
      }
      signal?.addEventListener("abort", abort, { once: true });
      current.promise.then(value => { release(); if (!signal?.aborted) resolve(value); }, error => { release(); reject(error); });
    });
  }
  async function loadReceipt(id, options = {}) {
    if (!uuid.test(id)) throw invalid();
    const captured = session(), privateSignal = privateController.signal;
    const result = await read(`r:${captured}:${id}`, async signal => {
      if (captured !== sessionId) throw new DOMException("Sesión finalizada", "AbortError");
      let result;
      try { result = await account.api.request(`/api/Usuario/me/encuestas/${id}/respuesta`, { auth: true, signal: AbortSignal.any([signal, privateSignal]) }); }
      catch (error) { if (error.status === 404) return null; throw error; }
      return receipt(result);
    }, { ...options, ttl: value => value ? Infinity : 15000 });
    if (captured !== sessionId) throw new DOMException("Sesión finalizada", "AbortError");
    return result;
  }
  return {
    list({ cursor, limite = 12, ...options } = {}) {
      if (!Number.isInteger(limite) || limite < 1 || limite > 20 || (cursor && !uuid.test(cursor))) return Promise.reject(invalid());
      const query = new URLSearchParams({ limite: String(limite) }); if (cursor) query.set("cursor", cursor);
      return read(`p:list:${query}`, async signal => {
        const data = await account.api.request(`/api/Encuesta/publicas?${query}`, { signal });
        if (!Array.isArray(data?.items) || data.items.length > limite || (data.siguienteCursor !== null && !uuid.test(data.siguienteCursor))) throw invalid();
        const ids = new Set();
        const items = data.items.map(item => { const value = metadata(item); if (ids.has(value.id)) throw invalid(); ids.add(value.id); return Object.freeze(value); });
        return Object.freeze({ items: Object.freeze(items), siguienteCursor: data.siguienteCursor });
      }, options);
    },
    detail(id, options = {}) {
      if (!uuid.test(id)) return Promise.reject(invalid());
      return read(`p:detail:${id}`, async signal => {
        const raw = await account.api.request(`/api/Encuesta/publicas/${id}`, { signal }), data = metadata(raw);
        if (data.id.toLowerCase() !== id.toLowerCase()) throw invalid();
        return Object.freeze({ ...data, configuracion: parseSurveyConfiguration(raw.configuracion) });
      }, options);
    },
    loadReceipt,
    knownReceipt(id) {
      const value = cache.get(`r:${sessionId}:${id}`);
      return account.getSnapshot().authenticated && value?.expires > now() ? value.value : null;
    },
    async submit(id, configuration, values, signal) {
      const captured = session(), key = `${captured}:${id}`, body = buildSurveyAnswers(configuration, values);
      if (sending.has(key)) throw new Error("El envío ya está en curso.");
      const ensureCurrent = () => {
        signal?.throwIfAborted();
        if (captured !== sessionId) throw new DOMException("Sesión finalizada", "AbortError");
      };
      sending.add(key);
      try {
        const existing = await loadReceipt(id, { signal }); ensureCurrent(); if (existing) return existing;
        try {
          const result = await account.api.request(`/api/Usuario/me/encuestas/${id}/respuesta`, { method: "POST", auth: true, body,
            signal: signal ? AbortSignal.any([signal, privateController.signal]) : privateController.signal });
          if (!uuid.test(result?.id) || result.estado !== "registrada") throw invalid();
          ensureCurrent();
        } catch (error) {
          if (signal?.aborted || captured !== sessionId) throw error;
          if (!(error.status === 409 || error.status >= 500 || ["network", "timeout", "invalid_response"].includes(error.code))) throw error;
          let recovered;
          try { recovered = await loadReceipt(id, { force: true, signal }); } catch (problem) { if (signal?.aborted || captured !== sessionId) throw problem; }
          ensureCurrent();
          if (recovered) return recovered;
          throw new ApiError("Todavía no pudimos confirmar el envío. La encuesta puede haber cerrado o el envío seguir en curso. Conservamos tus respuestas; comprobá el estado antes de volver a enviar.", { code: "survey_uncertain", status: error.status, retryAfterSeconds: error.retryAfterSeconds });
        }
        try {
          const confirmed = await loadReceipt(id, { force: true, signal });
          ensureCurrent();
          if (confirmed) return confirmed;
        } catch (error) { if (signal?.aborted || captured !== sessionId) throw error; }
        throw new ApiError("El servidor recibió el envío, pero no pudimos cargar su comprobante. Comprobá el estado antes de continuar.", { code: "survey_uncertain" });
      } finally { sending.delete(key); }
    },
  };
}
