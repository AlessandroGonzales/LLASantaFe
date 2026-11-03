export function privateRoute(pathname) {
  let path;
  try { path = decodeURIComponent(pathname).toLowerCase(); } catch { return true; }
  return ["/registro", "/ingresar", "/mi-cuenta", "/verificar-email", "/recuperar-cuenta",
    "/restablecer-password", "/administracion", "/api"]
    .some(base => path === base || path.startsWith(base + "/"));
}
