import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { contentSecurityPolicy, applyDeploymentPolicy } from "../scripts/deployment-policy.mjs";
import { privateRoute } from "../src/lib/indexingPolicy.js";

const source = '<!doctype html><html><head><meta charset="UTF-8"><!-- deployment-policy --><script type="application/ld+json">{"@type":"WebSite"}</script></head><body></body></html>';
const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const rules = config.headers.filter(rule => rule.headers.some(header => header.key === "X-Robots-Tag"));
const cspParts = csp => Object.fromEntries(csp.split("; ").map(part => {
  const [directive, ...values] = part.split(" "); return [directive, values];
}));

test("CSP permite únicamente el origen de API configurado para conexiones de aplicación", () => {
  const directives = cspParts(contentSecurityPolicy(source, "https://api.example.invalid/"));
  assert.deepEqual(directives["connect-src"], ["'self'", "https://challenges.cloudflare.com", "https://api.example.invalid"]);
  assert.deepEqual(directives["default-src"], ["'none'"]);
  assert.deepEqual(directives["object-src"], ["'none'"]);
  assert.deepEqual(directives["script-src-attr"], ["'none'"]);
  assert.ok(!directives["script-src"].includes("'unsafe-inline'"));
  assert.ok(!directives["script-src"].includes("'unsafe-eval'"));
});
test("CSP rechaza configuraciones de API ambiguas sin reproducir el valor recibido", () => {
  for (const invalid of ["no-url", "http://api.example.invalid", "https://user:private@example.invalid",
    "https://api.example.invalid/api", "https://api.example.invalid/?key=private", "https://api.example.invalid/#private"]) {
    assert.throws(() => contentSecurityPolicy(source, invalid), error => !error.message.includes(invalid) && error.message.includes("VITE_API_BASE_URL"));
  }
});
test("sin backend configurado se conservan formularios del mismo origen y Turnstile", () => {
  assert.deepEqual(cspParts(contentSecurityPolicy(source))["connect-src"], ["'self'", "https://challenges.cloudflare.com"]);
});
test("la política permite mapas, fuentes y fotos sin habilitar otros scripts", () => {
  const directives = cspParts(contentSecurityPolicy(source));
  assert.ok(directives["frame-src"].includes("https://maps.google.com"));
  assert.ok(directives["frame-src"].includes("https://www.google.com"));
  assert.ok(directives["frame-src"].includes("https://challenges.cloudflare.com"));
  assert.ok(directives["font-src"].includes("https://cdn.fontshare.com"));
  assert.ok(directives["img-src"].includes("blob:") && directives["img-src"].includes("data:"));
  assert.deepEqual(directives["media-src"], ["'self'"]);
});
test("JSON-LD estático usa un hash calculado y la política aparece antes del código", () => {
  const expected = "'sha256-" + createHash("sha256").update('{"@type":"WebSite"}').digest("base64") + "'";
  assert.ok(cspParts(contentSecurityPolicy(source))["script-src"].includes(expected));
  const html = applyDeploymentPolicy(source);
  assert.ok(html.indexOf("charset=") < html.indexOf('http-equiv="Content-Security-Policy"'));
  assert.ok(html.indexOf('http-equiv="Content-Security-Policy"') < html.indexOf("<script"));
  assert.throws(() => applyDeploymentPolicy("<html></html>"), /punto de inserción/);
});
test("Preview recibe noindex en el documento; producción no bloquea todas sus páginas", () => {
  assert.match(applyDeploymentPolicy(source, { preview: true }), /name="robots" content="noindex, nofollow" data-deployment-robots/);
  assert.doesNotMatch(applyDeploymentPolicy(source), /name="robots"/);
});
test("los hashes CSP respetan la normalización de saltos de línea del navegador", () => {
  const lf=source.replace('{"@type":"WebSite"}', '{\n"@type":"WebSite"\n}');
  assert.equal(contentSecurityPolicy(lf), contentSecurityPolicy(lf.replaceAll("\n","\r\n")));
});
test("cabeceras y navegación SPA coinciden en las rutas que no deben indexarse", () => {
  for (const path of ["/registro", "/ingresar", "/mi-cuenta", "/mi-cuenta/encuestas", "/administracion/afiliaciones",
    "/verificar-email", "/recuperar-cuenta", "/restablecer-password", "/api/forms"]) {
    assert.equal(privateRoute(path), true);
    assert.ok(rules.some(rule => new RegExp("^" + rule.source + "$").test(path)), path);
  }
  for (const path of ["/", "/privacidad", "/encuestas", "/propuestas", "/representantes", "/noticia/1", "/mi-cuentax"]) {
    assert.equal(privateRoute(path), false);
    assert.ok(!rules.some(rule => new RegExp("^" + rule.source + "$").test(path)), path);
  }
  assert.equal(privateRoute("/MI-CUENTA"), true);
});
test("protección contra framing se envía por cabecera y robots permite leer noindex", () => {
  const general = config.headers.find(rule => rule.source === "/(.*)");
  assert.ok(general.headers.some(header => header.key === "X-Frame-Options" && header.value === "DENY"));
  assert.ok(general.headers.some(header => header.key === "Content-Security-Policy" && header.value.includes("frame-ancestors 'none'")));
  const robots = readFileSync(new URL("../public/robots.txt", import.meta.url), "utf8");
  assert.doesNotMatch(robots, /Disallow:\s*\/(mi-cuenta|registro|administracion|ingresar)/);
});
