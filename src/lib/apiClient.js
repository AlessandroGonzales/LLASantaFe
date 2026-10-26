export class ApiError extends Error {
  constructor(message, { status = 0, code = "request_failed", errors = {}, traceId, retryAfterSeconds = 0 } = {}) {
    super(message);
    this.name = "ApiError";
    Object.assign(this, { status, code, errors, traceId, retryAfterSeconds });
  }
}

function apiOrigin(value, allowLocalHttp) {
  try {
    const url = new URL(value);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/" ||
        !(url.protocol === "https:" || (allowLocalHttp && local && url.protocol === "http:"))) return null;
    return url.origin;
  } catch { return null; }
}

function retrySeconds(value) {
  if (!value) return 0;
  const seconds = /^\d+$/.test(value) ? Number(value) : (Date.parse(value) - Date.now()) / 1000;
  return Number.isFinite(seconds) ? Math.min(86400, Math.max(0, Math.ceil(seconds))) : 0;
}
function validationErrors(values) {
  if (!values || typeof values !== "object" || Array.isArray(values)) return {};
  const labels = { nombre: "nombre", apellido: "apellido", email: "email", password: "contraseña", nuevapassword: "nueva contraseña",
    codigo: "código del enlace", fechanacimiento: "fecha de nacimiento", telefono: "teléfono", fotoperfilurl: "foto de perfil", ciudadid: "localidad",
    dni: "DNI", confirmacion: "confirmación", quierefiscalizar: "interés en fiscalizar" };
  const result = {};
  for (const [key, items] of Object.entries(values)) {
    if (!Array.isArray(items) || key.toLowerCase() === "request") continue;
    const field = key.replace(/^\$\./, "").toLowerCase();
    result[key] = items.filter(item => typeof item === "string").map(item =>
      /could not be converted|LineNumber|BytePosition|^The .+field|^The field /i.test(item)
        ? `Revisá el formato de ${labels[field] || "los datos enviados"}.` : item);
  }
  return result;
}

export function createApiClient({ baseUrl, allowLocalHttp = false, fetchImpl = globalThis.fetch,
  getToken = () => null, onUnauthorized = () => {}, timeoutMs = 15000 } = {}) {
  const origin = apiOrigin(baseUrl, allowLocalHttp);
  return {
    configured: Boolean(origin),
    async request(path, { method = "GET", body, auth = false, signal, headers = {}, responseType = "json" } = {}) {
      if (!origin) throw new ApiError("El servicio de cuentas no está disponible en este momento.", { code: "configuration" });
      if (!/^\/api\//.test(path) || path.includes("\\") || path.includes("#")) throw new ApiError("La operación no es válida.");
      signal?.throwIfAborted();
      const token = auth ? getToken() : null;
      if (auth && !token) throw new ApiError("Iniciá sesión para continuar.", { status: 401, code: "unauthorized" });
      const controller = new AbortController();
      const abort = () => controller.abort(signal.reason);
      signal?.addEventListener("abort", abort, { once: true });
      let timedOut = false;
      const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
      try {
        const requestHeaders = new Headers(headers);
        const binary = body instanceof Blob;
        requestHeaders.set("Accept", responseType === "blob" ? "image/jpeg" : "application/json");
        requestHeaders.delete("Authorization");
        if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
        if (body !== undefined) requestHeaders.set("Content-Type", binary ? body.type : "application/json");
        const response = await fetchImpl(`${origin}${path}`, {
          method, headers: requestHeaders, body: body === undefined ? undefined : binary ? body : JSON.stringify(body),
          credentials: "omit", redirect: "error", cache: auth ? "no-store" : "default", signal: controller.signal,
        });
        controller.signal.throwIfAborted();
        const isJson = response.headers.get("content-type")?.includes("json");
        let data = null;
        if (response.status !== 204 && isJson) {
          try { data = await response.json(); } catch { /* Se informa un error de contrato sin mostrar HTML/cuerpos. */ }
        }
        controller.signal.throwIfAborted();
        if (!response.ok) {
          if (auth && response.status === 401) onUnauthorized(token);
          const errors = validationErrors(data?.errors);
          const message = data?.errors && typeof data.errors === "object" ? "Revisá los datos indicados." : data?.detail || data?.title || data?.mensaje || "No se pudo completar la operación.";
          throw new ApiError(message, {
            status: response.status, code: data?.code || "request_failed", errors,
            traceId: data?.traceId, retryAfterSeconds: retrySeconds(response.headers.get("Retry-After")),
          });
        }
        if (response.ok && responseType === "blob" && response.status !== 204) {
          if (response.headers.get("content-type")?.split(";")[0] !== "image/jpeg") throw new ApiError("No pudimos leer tu foto.", { code: "invalid_response" });
          const blob = await response.blob();
          controller.signal.throwIfAborted();
          if (blob.size < 20 || blob.size > 65536) throw new ApiError("No pudimos leer tu foto.", { code: "invalid_response" });
          return blob;
        }
        if (response.status !== 204 && data === null) throw new ApiError("No se pudo confirmar el resultado. Comprobalo antes de volver a enviar.", { code: "invalid_response" });
        return data;
      } catch (error) {
        if (signal?.aborted) throw signal.reason ?? new DOMException("Lectura cancelada", "AbortError");
        if (error instanceof ApiError) throw error;
        const writing = !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
        throw new ApiError(timedOut
          ? "La operación tardó demasiado. No pudimos confirmar el resultado; conservamos tus datos."
          : writing ? "No pudimos confirmar la operación. Conservamos tus datos; comprobá el resultado antes de volver a enviarla."
            : "No pudimos conectar con el servicio. Revisá tu conexión y volvé a intentarlo.",
        { code: timedOut ? "timeout" : "network" });
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", abort);
      }
    },
  };
}
