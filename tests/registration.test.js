import assert from "node:assert/strict";
import test from "node:test";
import { emptyRegistration, registrationBody, registrationSteps, validateRegistrationStep, submitRegistration } from "../src/lib/registration.js";
import { privacyNotice } from "../src/data/privacyNotice.js";
const data = () => ({ ...emptyRegistration(), nombre: " Ana ", apellido: " Prueba ", email: "ana@example.invalid", fechaNacimiento: "1990-01-01", password: "Una-frase-personal-segura!", confirmation: "Una-frase-personal-segura!", aceptaPrivacidad: true });

test("el registro verifica antes de enviar y pasa el token fuera de sus datos", async () => {
  const events = [], body = { nombre: "Ana" }, signal = new AbortController().signal, container = {};
  await submitRegistration({
    body, signal, container,
    verify: async (...args) => { assert.deepEqual(args, [container, "registro", signal]); events.push("verify"); return "token-un-uso"; },
    register: async (...args) => { assert.deepEqual(args, [body, signal, "token-un-uso"]); events.push("register"); },
  });
  assert.deepEqual(events, ["verify", "register"]);
  assert.deepEqual(body, { nombre: "Ana" });
});
test("un desafío fallido no envía el registro ni reintenta", async () => {
  let calls = 0;
  await assert.rejects(submitRegistration({
    verify: async () => { calls++; throw new Error("desafío rechazado"); },
    register: () => assert.fail("No debe enviar"), signal: new AbortController().signal,
  }), /desafío rechazado/);
  assert.equal(calls, 1);
});
test("cancelar durante la verificación impide enviar datos", async () => {
  const controller = new AbortController();
  await assert.rejects(submitRegistration({
    signal: controller.signal, verify: async () => { controller.abort(); return "token"; },
    register: () => assert.fail("No debe enviar"),
  }), { name: "AbortError" });
});
test("Development sin desafío mantiene el contrato local", async () => {
  const body = { nombre: "Ana" }, signal = new AbortController().signal;
  await submitRegistration({
    body, signal, challengeRequired: false, verify: () => assert.fail("No debe verificar"),
    register: async (...args) => assert.deepEqual(args, [body, signal, undefined]),
  });
});
test("el registro empieza sin consentimiento y termina en una bienvenida separada", () => {
  assert.equal(emptyRegistration().aceptaPrivacidad, false); assert.equal(registrationSteps.length, 6); assert.equal(registrationSteps.at(-1), "Bienvenida");
});
test("cada etapa valida los datos necesarios y permite omitir los opcionales", () => {
  for (let step = 0; step < 5; step++) assert.doesNotThrow(() => validateRegistrationStep(step, data()));
  for (const changes of [{ nombre: " " }, { apellido: " " }, { email: "sin-email" }]) assert.throws(() => validateRegistrationStep(0, { ...data(), ...changes }));
  for (const changes of [{ fechaNacimiento: "2999-01-01" }, { fechaNacimiento: "2025-02-30" }, { telefono: "texto-no-telefono" }, { department: "departamento", city: "" }, { genero: "inexistente" }]) assert.throws(() => validateRegistrationStep(1, { ...data(), ...changes }));
  assert.throws(() => validateRegistrationStep(2, { ...data(), profesion: "x".repeat(151) }));
});
test("contraseña: respeta los bytes UTF-8 del backend y la confirmación", () => {
  for (const changes of [{ password: "corta" }, { password: "é".repeat(40) }, { confirmation: "Otra-frase-distinta!" }]) assert.throws(() => validateRegistrationStep(3, { ...data(), ...changes }));
  assert.throws(() => validateRegistrationStep(4, { ...data(), aceptaPrivacidad: false }));
});
test("cuerpo de registro solo contiene el contrato necesario y la versión aceptada", async () => {
  const result = await registrationBody(data());
  assert.equal(result.nombre, "Ana"); assert.equal(result.apellido, "Prueba"); assert.equal(result.fotoPerfilBase64, null);
  assert.equal(result.privacidadVersion, privacyNotice.version); assert.equal(result.aceptaPrivacidad, true);
  for (const field of ["confirmation", "department", "role", "privacidadAceptadaAt", "token"]) assert.equal(field in result, false);
  await assert.rejects(registrationBody({ ...data(), aceptaPrivacidad: false }));
});
test("foto de registro: bytes acotados, dentro del límite HTTP y sin URL pública", async () => {
  const photo = new Blob([new Uint8Array(32768)], { type: "image/jpeg" }); const body = await registrationBody(data(), photo);
  assert.equal(Buffer.from(body.fotoPerfilBase64, "base64").length, 32768); assert.ok(new TextEncoder().encode(JSON.stringify(body)).length < 65536);
  assert.equal("fotoPerfilUrl" in body, false);
  await assert.rejects(registrationBody(data(), new Blob([new Uint8Array(32769)], { type: "image/jpeg" })));
  const controller = new AbortController(); controller.abort(); await assert.rejects(registrationBody(data(), photo, controller.signal), { name: "AbortError" });
});
test("aviso identifica al responsable y ofrece las fuentes oficiales de derechos", () => {
  assert.equal(privacyNotice.email, "oficial@llasantafe.com.ar"); assert.match(privacyNotice.address, /Sarmiento 624/);
  assert.equal(new URL(privacyNotice.lawUrl).hostname, "www.argentina.gob.ar"); assert.match(privacyNotice.sections.map(s => s.text).join(" "), /no te afilia/);
});
