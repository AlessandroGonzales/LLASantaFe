import { ApiError, createApiClient } from "./apiClient.js";

const anonymous = (sessionId) => Object.freeze({ sessionId, authenticated: false, expiresAt: null,
  profile: null, profileStatus: "idle", profileError: null });

// Una sesión por pestaña, solo en memoria. Ninguna lectura de API al crear el servicio.
export function createAccountService({ now = Date.now, schedule = setTimeout, cancel = clearTimeout, ...options } = {}) {
  let snapshot = anonymous(0), token = null, expiryTimer, profileTask;
  const listeners = new Set();
  function emit(next) { snapshot = Object.freeze(next); for (const listener of listeners) listener(); }
  function clear(expectedToken = token) {
    if (token !== expectedToken) return;
    cancel(expiryTimer); profileTask?.controller.abort(); profileTask = null; token = null;
    emit(anonymous(snapshot.sessionId + 1));
  }
  function getToken() {
    if (token && Date.parse(snapshot.expiresAt) <= now()) clear();
    return token;
  }
  const api = createApiClient({ ...options, getToken, onUnauthorized: clear });
  function start(session) {
    const remaining = Date.parse(session?.expiresAt) - now();
    if (session?.tokenType !== "Bearer" || typeof session?.token !== "string" || !session.token || /\s/.test(session.token) ||
        !Number.isFinite(remaining) || remaining <= 0 || remaining > 30 * 60000)
      throw new ApiError("El servicio no devolvió una sesión válida.", { code: "invalid_response" });
    cancel(expiryTimer); profileTask?.controller.abort(); profileTask = null;
    token = session.token;
    const captured = token;
    emit({ ...anonymous(snapshot.sessionId + 1), authenticated: true, expiresAt: session.expiresAt });
    expiryTimer = schedule(() => clear(captured), remaining);
    expiryTimer?.unref?.();
  }
  async function loadProfile({ force = false } = {}) {
    const captured = getToken();
    if (!captured) throw new ApiError("Iniciá sesión para continuar.", { status: 401 });
    if (!force && snapshot.profile) return snapshot.profile;
    if (profileTask) return profileTask.promise;
    const sessionId = snapshot.sessionId;
    const controller = new AbortController();
    const task = { controller, promise: null };
    profileTask = task;
    task.promise = Promise.resolve().then(() => api.request("/api/Usuario/me", { auth: true, signal: controller.signal })).then(profile => {
      if (!profile?.idUsuario || !profile.email) throw new ApiError("No se pudo leer el perfil.", { code: "invalid_response" });
      if (snapshot.sessionId === sessionId) emit({ ...snapshot, profile, profileStatus: "ready", profileError: null });
      return profile;
    }).catch(error => {
      if (snapshot.sessionId === sessionId && !controller.signal.aborted)
        emit({ ...snapshot, profileStatus: "error", profileError: error });
      throw error;
    }).finally(() => { if (profileTask === task) profileTask = null; });
    emit({ ...snapshot, profileStatus: "loading", profileError: null });
    return task.promise;
  }
  return {
    api,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getSnapshot: () => snapshot,
    async login(body, signal) { const result = await api.request("/api/Usuario/login", { method: "POST", body, signal }); signal?.throwIfAborted(); start(result); },
    register: (body, signal) => api.request("/api/Usuario", { method: "POST", body, signal }),
    requestVerification: (email, signal) => api.request("/api/Usuario/email/solicitar-verificacion", { method: "POST", body: { email }, signal }),
    confirmEmail: (body, signal) => api.request("/api/Usuario/email/confirmar", { method: "POST", body, signal }),
    requestRecovery: (email, signal) => api.request("/api/Usuario/password/solicitar-recuperacion", { method: "POST", body: { email }, signal }),
    async resetPassword(body, signal) {
      const captured = getToken();
      await api.request("/api/Usuario/password/restablecer", { method: "POST", body, signal });
      clear(captured);
    },
    loadProfile,
    async patchProfile(body, signal) {
      const sessionId = snapshot.sessionId;
      await api.request("/api/Usuario/me", { method: "PATCH", body, auth: true, signal });
      if (snapshot.sessionId === sessionId) {
        profileTask?.controller.abort(); profileTask = null;
        try { await loadProfile({ force: true }); }
        catch (error) {
          if (snapshot.sessionId !== sessionId) throw error;
          throw new ApiError("Los cambios se guardaron, pero no pudimos actualizar la vista. Volvé a cargar tu perfil.", { code: "profile_refresh_failed" });
        }
      }
    },
    async logout(signal) {
      const captured = getToken();
      try { await api.request("/api/Usuario/me/cerrar-sesion", { method: "POST", auth: true, signal }); }
      finally { clear(captured); }
    },
    async deactivate(signal) {
      const captured = getToken();
      await api.request("/api/Usuario/me", { method: "DELETE", auth: true, signal });
      clear(captured);
    },
  };
}
