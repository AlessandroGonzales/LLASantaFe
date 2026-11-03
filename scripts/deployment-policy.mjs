import { createHash } from "node:crypto";

function apiOrigin(value) {
  if (!value?.trim()) return "";
  let url;
  try { url = new URL(value); } catch {
    throw new Error("VITE_API_BASE_URL debe ser un origen HTTPS válido.");
  }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.pathname !== "/")
    throw new Error("VITE_API_BASE_URL debe ser un origen HTTPS, sin credenciales, ruta, query o fragmento.");
  return url.origin;
}

export function contentSecurityPolicy(html, apiBaseUrl) {
  const inlineJson = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => "'sha256-" + createHash("sha256").update(match[1].replace(/\r\n?/g, "\n")).digest("base64") + "'");
  return [
    "default-src 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    ["script-src 'self' https://challenges.cloudflare.com", ...inlineJson].join(" "),
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
    "font-src 'self' https://cdn.fontshare.com",
    // URLs HTTPS de perfiles anteriores; las fotos nuevas usan blob/data o el propio origen.
    "img-src 'self' data: blob: https:",
    "media-src 'self'",
    "frame-src https://maps.google.com https://www.google.com https://challenges.cloudflare.com",
    ["connect-src 'self' https://challenges.cloudflare.com", apiOrigin(apiBaseUrl)].filter(Boolean).join(" "),
    "form-action 'self'",
    "manifest-src 'self'",
    "worker-src 'none'",
  ].join("; ");
}

export function applyDeploymentPolicy(html, { apiBaseUrl, preview = false } = {}) {
  const marker = "<!-- deployment-policy -->";
  if (!html.includes(marker)) throw new Error("Falta el punto de inserción de la política de despliegue.");
  const escaped = contentSecurityPolicy(html, apiBaseUrl).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return html.replace(marker, () => '<meta http-equiv="Content-Security-Policy" content="' + escaped + '">' +
    (preview ? '\n    <meta name="robots" content="noindex, nofollow" data-deployment-robots>' : ""));
}

export function deploymentPolicyPlugin(options) {
  return {
    name: "deployment-policy",
    apply: "build",
    transformIndexHtml: { order: "post", handler: html => applyDeploymentPolicy(html, options) },
  };
}
