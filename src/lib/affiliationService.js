import { ApiError } from "./apiClient.js";

export const affiliationStates = Object.freeze({ pendiente: "Pendientes", en_revision: "En revisión", aprobada: "Aprobadas", rechazada: "Rechazadas" });
export const isAdministrator = profile => ["Admin", "SuperAdmin"].includes(profile?.roleNombre);
const uuid = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i;
const invalid = () => new ApiError("No pudimos leer la solicitud. Volvé a consultar su estado.", { code: "invalid_response" });
function ownRequest(value) {
  if (!uuid.test(value?.id) || !Object.hasOwn(affiliationStates, value?.estado) || !Number.isFinite(Date.parse(value?.fechaSolicitud))) throw invalid();
  return value;
}
export function affiliationBody({ dni, telefono, ciudadId, quiereFiscalizar, confirmacion }) {
  if (confirmacion !== true) throw new Error("Confirmá que querés enviar esta solicitud de afiliación.");
  if (!/^[0-9]{7,8}$/.test(dni)) throw new Error("Ingresá un DNI de 7 u 8 números, sin puntos.");
  const phone = telefono?.trim() || "", digits = phone.replace(/\D/g, "").length;
  if (!/^\+?[0-9\s\-()]{8,20}$/.test(phone) || digits < 8 || digits > 15) throw new Error("Ingresá un teléfono de contacto válido, con código de área.");
  if (!uuid.test(ciudadId)) throw new Error("Seleccioná tu localidad.");
  if (typeof quiereFiscalizar !== "boolean") throw new Error("Revisá la opción de fiscalización.");
  return { confirmacion: true, dni, telefono: phone, ciudadId, quiereFiscalizar };
}

// Solo se consulta al entrar en afiliación. Datos privados en memoria, por sesión.
export function createAffiliationService(account) {
  const empty = () => Object.freeze({ sessionId: account.getSnapshot().sessionId, status: "idle", checked: false, request: null, error: null });
  let snapshot = empty(), task, sending = false, sessionController = new AbortController();
  const listeners = new Set();
  function emit(next) { snapshot = Object.freeze(next); for (const listener of listeners) listener(); }
  account.subscribe(() => {
    if (snapshot.sessionId === account.getSnapshot().sessionId) return;
    sessionController.abort(); sessionController = new AbortController(); task = null; sending = false; emit(empty());
  });
  function session() {
    if (!account.getSnapshot().authenticated) throw new ApiError("Iniciá sesión para continuar.", { status: 401 });
    return snapshot.sessionId;
  }
  async function request(path, { signal, ...options } = {}) {
    session();
    return account.api.request(`/api/SolicitudAfiliacion${path}`, { ...options, auth: true,
      signal: signal ? AbortSignal.any([signal, sessionController.signal]) : sessionController.signal });
  }
  async function loadOwn({ force = false } = {}) {
    const captured = session();
    if (task) return task;
    if (!force && snapshot.status === "ready") return snapshot.request;
    const operation = Promise.resolve().then(() => {
      if (snapshot.sessionId !== captured) throw new DOMException("Sesión finalizada", "AbortError");
      return request("/me");
    }).catch(error => {
      if (error.status === 404) return null;
      throw error;
    }).then(value => {
      if (snapshot.sessionId !== captured) throw new DOMException("Sesión finalizada", "AbortError");
      const result = value === null ? null : ownRequest(value);
      emit({ ...snapshot, status: "ready", checked: true, request: result, error: null });
      return result;
    }).catch(error => {
      if (snapshot.sessionId === captured) emit({ ...snapshot, status: "error", error });
      throw error;
    }).finally(() => { if (task === operation) task = null; });
    task = operation; emit({ ...snapshot, status: "loading", error: null });
    return operation;
  }
  return {
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getSnapshot: () => snapshot,
    loadOwn,
    async submit(values, signal) {
      const captured = session(), body = affiliationBody(values);
      if (sending) throw new Error("La solicitud ya se está enviando.");
      sending = true;
      try {
        const existing = await loadOwn();
        signal?.throwIfAborted();
        if (snapshot.sessionId !== captured) throw new DOMException("Sesión finalizada", "AbortError");
        if (existing) return existing;
        let saved = false;
        try { await request("", { method: "POST", body, signal }); saved = true; }
        catch (error) {
          if (signal?.aborted || snapshot.sessionId !== captured) throw error;
          if (!(error.status === 409 || error.status >= 500 || ["network", "timeout", "invalid_response"].includes(error.code))) throw error;
          const recovered = await loadOwn({ force: true });
          if (!recovered) throw error;
          account.loadProfile({ force: true }).catch(() => {});
          return recovered;
        }
        if (saved && snapshot.sessionId === captured) {
          // El contacto se guarda en el perfil en la misma transacción de creación.
          account.loadProfile({ force: true }).catch(() => {});
          const confirmed = await loadOwn({ force: true });
          if (!confirmed) throw invalid();
          return confirmed;
        }
      } finally { if (snapshot.sessionId === captured) sending = false; }
    },
    async list({ estado = "pendiente", cursor, limite = 20 } = {}, signal) {
      if (!Object.hasOwn(affiliationStates, estado) || !Number.isInteger(limite) || limite < 1 || limite > 50 || (cursor && !uuid.test(cursor))) throw new Error("Filtro de afiliaciones inválido.");
      const query = new URLSearchParams({ estado, limite: String(limite) }); if (cursor) query.set("cursor", cursor);
      const result = await request(`?${query}`, { signal });
      if (!Array.isArray(result?.items) || result.items.some(item => !uuid.test(item.id) || item.estado !== estado) || (result.siguienteCursor !== null && !uuid.test(result.siguienteCursor))) throw invalid();
      return result;
    },
    async detail(id, signal) { if (!uuid.test(id)) throw invalid(); return ownRequest(await request(`/${id}`, { signal })); },
    async totals(signal) {
      const result = await request("/totales", { signal });
      if (["totalAfiliados", "totalSolicitudes", "pendientes", "enRevision", "rechazadas"].some(key => !Number.isSafeInteger(result?.[key]) || result[key] < 0)) throw invalid();
      return result;
    },
    async resolve(id, decision, text, signal) {
      if (!uuid.test(id) || !["aprobar", "rechazar"].includes(decision)) throw invalid();
      const value = text.trim();
      if (value.length > 2000 || value.includes("\0") || (decision === "rechazar" && value.length < 10)) throw new Error("El motivo debe tener entre 10 y 2000 caracteres; la nota interna es opcional y admite hasta 2000.");
      return request(`/${id}/${decision}`, { method: "POST", body: decision === "aprobar" ? { observacion: value || null } : { motivo: value }, signal });
    },
  };
}
