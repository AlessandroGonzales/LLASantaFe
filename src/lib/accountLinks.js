let pending = null;

// Ejecutar antes del router. El código se quita de la URL y nunca se persiste.
export function captureAccountCode(location, history) {
  if (!["/verificar-email", "/restablecer-password"].includes(location.pathname)) return;
  const code = new URLSearchParams(location.hash.slice(1)).get("codigo");
  if (code) {
    pending = { path: location.pathname, code: /^[a-f0-9-]{36}\.[A-Za-z0-9_-]{43}$/i.test(code) ? code : null };
    history.replaceState(history.state, "", `${location.pathname}${location.search}`);
  }
}
export function getAccountCode(path) { return pending?.path === path ? pending.code : null; }
export function clearAccountCode() { pending = null; }
export function validateNewPassword(password, confirmation) {
  if (password.length < 15 || new TextEncoder().encode(password).length > 72)
    throw new Error("La contraseña debe tener al menos 15 caracteres y no superar 72 bytes UTF-8.");
  if (password !== confirmation) throw new Error("Las contraseñas no coinciden.");
}
