import { ApiError } from "./apiClient.js";

export const citizenMotives = Object.freeze({ proyecto: "Tengo un Proyecto / Propuesta formal", sugerencia: "Sugerencia para la provincia", duda: "Duda o Consulta general", voluntariado: "Quiero sumarme como voluntario/fiscal", denuncia: "Denuncia / Irregularidad" });
export const citizenStates = Object.freeze({ pendiente: "Pendiente", en_revision: "En revisión", resuelta: "Resuelta", rechazada: "Rechazada" });
const uuid = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i;
const validId = value => typeof value === "string" && uuid.test(value) && value !== "00000000-0000-0000-0000-000000000000";
const invalid = () => new ApiError("No pudimos confirmar los datos de la solicitud. Volvé a consultar.", { code: "invalid_response" });
const ended = () => new DOMException("Sesión finalizada", "AbortError");
export function citizenRequestBody({ motivo, mensaje }) {
  if (typeof motivo !== "string" || !Object.hasOwn(citizenMotives, motivo)) throw new Error("Elegí un motivo para tu solicitud.");
  if (typeof mensaje !== "string" || mensaje.length > 5000 || mensaje.trim().length < 10 || mensaje.includes("\0") || !mensaje.isWellFormed()) throw new Error("El mensaje debe tener entre 10 y 5000 caracteres válidos.");
  return Object.freeze({ motivo, mensaje: mensaje.trim() });
}
function summary(raw) {
  if (!validId(raw?.id) || typeof raw.motivo !== "string" || !raw.motivo.trim() || !Object.hasOwn(citizenStates, raw.estado) ||
      !Number.isSafeInteger(raw.revision) || raw.revision < 1 || !Number.isFinite(Date.parse(raw.createdAt)) || typeof raw.tienePdf !== "boolean") throw invalid();
  return { id: raw.id, motivo: raw.motivo, estado: raw.estado, revision: raw.revision, createdAt: raw.createdAt, tienePdf: raw.tienePdf };
}

// Lecturas privadas acotadas y un único envío pendiente, solo en memoria de sesión.
export function createCitizenRequestService(account, { now = Date.now, newId = () => crypto.randomUUID() } = {}) {
  let sessionId = account.getSnapshot().sessionId, controller = new AbortController(), generation = 0;
  const cache = new Map(), pending = new Map(), listeners = new Set();
  const empty = () => Object.freeze({ sessionId, status: "idle", operation: null, receipt: null, error: null });
  let snapshot = empty();
  function emit(next) { snapshot = Object.freeze(next); for (const listener of listeners) listener(); }
  account.subscribe(() => {
    if (sessionId === account.getSnapshot().sessionId) return;
    controller.abort(); controller = new AbortController(); sessionId = account.getSnapshot().sessionId;
    for (const task of pending.values()) task.controller.abort();
    pending.clear(); cache.clear(); generation++; emit(empty());
  });
  function session() {
    if (!account.getSnapshot().authenticated) throw new ApiError("Ingresá con tu cuenta para continuar.", { status: 401, code: "unauthorized" });
    return sessionId;
  }
  async function request(path, options = {}) {
    const captured = session();
    const value = await account.api.request(`/api/SolicitudCiudadana${path}`, { ...options, auth: true,
      signal: options.signal ? AbortSignal.any([options.signal, controller.signal]) : controller.signal });
    if (captured !== sessionId) throw ended();
    return value;
  }
  function read(key, loader, { force = false, signal } = {}) {
    const captured = session(); signal?.throwIfAborted(); key = `${captured}:${generation}:${key}`;
    const saved = cache.get(key);
    if (!force && saved?.expires > now()) return Promise.resolve(saved.value);
    let task = pending.get(key);
    if (!task) {
      task = { controller: new AbortController(), users: new Set() };
      const current = task;
      task.promise = Promise.resolve().then(() => { current.controller.signal.throwIfAborted(); if (captured !== sessionId) throw ended(); return loader(current.controller.signal); })
        .then(value => {
          current.controller.signal.throwIfAborted(); if (captured !== sessionId) throw ended();
          cache.delete(key); cache.set(key, { value, expires: now() + 30000 });
          while (cache.size > 16) cache.delete(cache.keys().next().value);
          return value;
        }).finally(() => { if (pending.get(key) === current) pending.delete(key); });
      pending.set(key, task);
    }
    const current = task, consumer = {}; current.users.add(consumer);
    return new Promise((resolve, reject) => {
      function release() { current.users.delete(consumer); signal?.removeEventListener("abort", abort); }
      function abort() {
        release(); reject(signal.reason || ended());
        if (!current.users.size) { if (pending.get(key) === current) pending.delete(key); current.controller.abort(); }
      }
      signal?.addEventListener("abort", abort, { once: true });
      current.promise.then(value => { release(); if (!signal?.aborted) resolve(value); }, error => { release(); reject(error); });
    });
  }
  async function send(signal) {
    const captured = session(), operation = snapshot.operation;
    if (!operation || snapshot.status === "sending" || snapshot.status === "confirmed") throw new Error("Revisá el estado del envío antes de continuar.");
    signal?.throwIfAborted();
    emit({ ...snapshot, status: "sending", error: null });
    try {
      const value = await request("", { method: "POST", body: operation.body, headers: { "Idempotency-Key": operation.key }, signal });
      if (!validId(value?.id) || value.estado !== "recibida") throw invalid();
      if (captured !== sessionId) throw ended();
      const receipt = Object.freeze({ id: value.id, estado: value.estado });
      cache.clear(); generation++;
      emit({ ...snapshot, status: "confirmed", receipt, error: null }); return receipt;
    } catch (error) {
      if (captured === sessionId) {
        // Red/timeout/5xx/429 conservan clave y cuerpo; solo se repite a pedido.
        const rejected = [400, 413, 422].includes(error.status);
        emit({ ...snapshot, status: rejected ? "rejected" : "uncertain", error });
      }
      throw error;
    }
  }
  return {
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getSnapshot: () => snapshot,
    async list({ estado = "", cursor, limite = 20, ...options } = {}) {
      if ((estado && !Object.hasOwn(citizenStates, estado)) || !Number.isInteger(limite) || limite < 1 || limite > 50 || (cursor && !validId(cursor))) return Promise.reject(invalid());
      const query = new URLSearchParams({ limite: String(limite) }); if (estado) query.set("estado", estado); if (cursor) query.set("cursor", cursor);
      return read(`list:${query}`, async signal => {
        const data = await request(`?${query}`, { signal });
        if (!Array.isArray(data?.items) || data.items.length > limite || (data.siguienteCursor !== null && !validId(data.siguienteCursor))) throw invalid();
        const ids = new Set();
        const items = data.items.map(raw => { const item = summary(raw); if (ids.has(item.id) || (estado && item.estado !== estado)) throw invalid(); ids.add(item.id); return Object.freeze(item); });
        return Object.freeze({ items: Object.freeze(items), siguienteCursor: data.siguienteCursor });
      }, options);
    },
    async detail(id, options = {}) {
      if (!validId(id)) return Promise.reject(invalid());
      return read(`detail:${id.toLowerCase()}`, async signal => {
        const raw = await request(`/${id}`, { signal }), item = summary(raw);
        if (item.id.toLowerCase() !== id.toLowerCase() || typeof raw.mensaje !== "string" || !Number.isFinite(Date.parse(raw.updatedAt)) || (raw.respuesta != null && typeof raw.respuesta !== "string")) throw invalid();
        return Object.freeze({ ...item, mensaje: raw.mensaje, updatedAt: raw.updatedAt, respuesta: raw.respuesta ?? null });
      }, options);
    },
    async submit(values, signal) {
      session(); signal?.throwIfAborted();
      if (!["idle", "rejected"].includes(snapshot.status)) throw new Error("Ya tenés un envío por confirmar. Comprobá su resultado antes de iniciar otro.");
      const body = citizenRequestBody(values), key = newId(); if (!validId(key)) throw invalid();
      emit({ ...snapshot, operation: Object.freeze({ key, body }), receipt: null, error: null });
      return send(signal);
    },
    retry(signal) { if (snapshot.status !== "uncertain") return Promise.reject(new Error("No hay un envío pendiente de confirmación.")); return send(signal); },
    startNew() { session(); if (snapshot.status !== "confirmed") throw new Error("Primero confirmá el envío anterior."); emit(empty()); },
  };
}
