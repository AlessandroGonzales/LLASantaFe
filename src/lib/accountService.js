import { ApiError, createApiClient } from "./apiClient.js";

const anonymous = (sessionId) => Object.freeze({ sessionId, authenticated: false, expiresAt: null,
  profile: null, profileStatus: "idle", profileError: null, avatarUrl: null, avatarStatus: "idle", avatarError: null });

// Una sesión por pestaña, solo en memoria. Ninguna lectura de API al crear el servicio.
export function createAccountService({ now = Date.now, schedule = setTimeout, cancel = clearTimeout,
  createObjectURL = blob => URL.createObjectURL(blob), revokeObjectURL = url => URL.revokeObjectURL(url), ...options } = {}) {
  let snapshot = anonymous(0), token = null, expiryTimer, profileTask, photoTask;
  const listeners = new Set();
  function emit(next) { snapshot = Object.freeze(next); for (const listener of listeners) listener(); }
  function releasePhoto() { photoTask?.controller.abort(); photoTask = null; if (snapshot.avatarUrl) revokeObjectURL(snapshot.avatarUrl); }
  function clear(expectedToken = token) {
    if (token !== expectedToken) return;
    cancel(expiryTimer); profileTask?.controller.abort(); profileTask = null; releasePhoto(); token = null;
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
    cancel(expiryTimer); profileTask?.controller.abort(); profileTask = null; releasePhoto();
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
      if (snapshot.sessionId === sessionId) {
        const changed = profile.fotoPerfilVersion !== snapshot.profile?.fotoPerfilVersion;
        if (changed) releasePhoto();
        emit({ ...snapshot, profile, profileStatus: "ready", profileError: null,
          ...(changed ? { avatarUrl: null, avatarStatus: "idle", avatarError: null } : {}) });
        if (profile.fotoPerfilVersion && snapshot.avatarStatus === "idle") loadPhoto().catch(() => {});
      }
      return profile;
    }).catch(error => {
      if (snapshot.sessionId === sessionId && !controller.signal.aborted)
        emit({ ...snapshot, profileStatus: "error", profileError: error });
      throw error;
    }).finally(() => { if (profileTask === task) profileTask = null; });
    emit({ ...snapshot, profileStatus: "loading", profileError: null });
    return task.promise;
  }
  async function loadPhoto() {
    if (!getToken() || !snapshot.profile?.fotoPerfilVersion) return null;
    if (photoTask) return photoTask.promise;
    if (snapshot.avatarUrl) return snapshot.avatarUrl;
    const sessionId = snapshot.sessionId, version = snapshot.profile.fotoPerfilVersion;
    const task = { controller: new AbortController(), promise: null }; photoTask = task;
    emit({ ...snapshot, avatarStatus: "loading", avatarError: null });
    task.promise = api.request("/api/Usuario/me/foto", { auth: true, responseType: "blob", signal: task.controller.signal })
      .then(blob => {
        task.controller.signal.throwIfAborted();
        if (snapshot.sessionId !== sessionId || snapshot.profile?.fotoPerfilVersion !== version) return null;
        const url = createObjectURL(blob); emit({ ...snapshot, avatarUrl: url, avatarStatus: "ready", avatarError: null }); return url;
      }).catch(error => {
        if (snapshot.sessionId === sessionId && !task.controller.signal.aborted) emit({ ...snapshot, avatarStatus: "error", avatarError: error });
        throw error;
      }).finally(() => { if (photoTask === task) photoTask = null; });
    return task.promise;
  }
  async function changePhoto(method, body, signal) {
    const sessionId = snapshot.sessionId;
    await api.request("/api/Usuario/me/foto", { method, body, auth: true, signal });
    signal?.throwIfAborted();
    if (snapshot.sessionId !== sessionId) return;
    profileTask?.controller.abort(); profileTask = null; releasePhoto();
    emit({ ...snapshot, avatarUrl: null, avatarStatus: "idle", avatarError: null });
    try { await loadProfile({ force: true }); if (snapshot.sessionId === sessionId) await loadPhoto(); }
    catch { throw new ApiError("La foto se guardó, pero no pudimos actualizar la vista. Volvé a cargar tu perfil.", { code: "profile_refresh_failed" }); }
  }
  return {
    api,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getSnapshot: () => snapshot,
    async login(body, signal) { const result = await api.request("/api/Usuario/login", { method: "POST", body, signal }); signal?.throwIfAborted(); start(result); },
    register: (body, signal, challengeToken) => api.request("/api/Usuario", {
      method: "POST", body, signal,
      headers: challengeToken ? { "X-Turnstile-Token": challengeToken } : {},
    }),
    requestVerification: (email, signal) => api.request("/api/Usuario/email/solicitar-verificacion", { method: "POST", body: { email }, signal }),
    confirmEmail: (body, signal) => api.request("/api/Usuario/email/confirmar", { method: "POST", body, signal }),
    requestRecovery: (email, signal) => api.request("/api/Usuario/password/solicitar-recuperacion", { method: "POST", body: { email }, signal }),
    async resetPassword(body, signal) {
      const captured = getToken();
      await api.request("/api/Usuario/password/restablecer", { method: "POST", body, signal });
      clear(captured);
    },
    loadProfile,
    loadPhoto,
    uploadPhoto: (blob, signal) => changePhoto("PUT", blob, signal),
    removePhoto: signal => changePhoto("DELETE", undefined, signal),
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
