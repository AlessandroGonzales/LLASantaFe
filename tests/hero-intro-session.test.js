import assert from "node:assert/strict";
import test from "node:test";
import {
  createHeroIntroSession,
  HERO_INTRO_SESSION_KEY,
  selectHeroVideoSource,
} from "../src/utils/heroIntroSession.js";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("la introducción solo se ofrece hasta el primer inicio de la sesión", () => {
  const storage = createStorage();
  const session = createHeroIntroSession(() => storage);
  assert.equal(session.hasStarted(), false);
  session.markStarted();
  assert.equal(session.hasStarted(), true);
  assert.equal(storage.getItem(HERO_INTRO_SESSION_KEY), "true");
  // Regresar desde una noticia consulta la misma sesión, incluso sin ended.
  assert.equal(session.hasStarted(), true);
});

test("recargar en la misma pestaña conserva el registro", () => {
  const storage = createStorage();
  createHeroIntroSession(() => storage).markStarted();
  const reloadedSession = createHeroIntroSession(() => storage);
  assert.equal(reloadedSession.hasStarted(), true);
});

test("una sesión nueva puede reproducir la introducción", () => {
  createHeroIntroSession(() => createStorage()).markStarted();
  const newSession = createHeroIntroSession(() => createStorage());
  assert.equal(newSession.hasStarted(), false);
});

test("con storage bloqueado no se repite al navegar dentro de la aplicación", () => {
  const session = createHeroIntroSession(() => { throw new Error("Blocked"); });
  assert.equal(session.hasStarted(), false);
  assert.doesNotThrow(() => session.markStarted());
  assert.equal(session.hasStarted(), true);
});

test("con lecturas o escrituras bloqueadas mantiene el respaldo en memoria", () => {
  const session = createHeroIntroSession(() => ({
    getItem() { throw new Error("Read blocked"); },
    setItem() { throw new Error("Quota exceeded"); },
  }));
  assert.equal(session.hasStarted(), false);
  session.markStarted();
  assert.equal(session.hasStarted(), true);
});

test("sin almacenamiento disponible tampoco repite la introducción", () => {
  const session = createHeroIntroSession(() => undefined);
  assert.equal(session.hasStarted(), false);
  session.markStarted();
  assert.equal(session.hasStarted(), true);
});

test("selecciona una sola URL móvil por debajo de 768px", () => {
  const sources = { mobile: "/mobile.mp4", desktop: "/desktop.mp4" };
  for (const width of [320, 390, 430, 767]) {
    assert.equal(selectHeroVideoSource(width, sources), sources.mobile);
  }
});

test("selecciona una sola URL de escritorio desde 768px", () => {
  const sources = { mobile: "/mobile.mp4", desktop: "/desktop.mp4" };
  for (const width of [768, 1024, 1440, 1920, 3840]) {
    assert.equal(selectHeroVideoSource(width, sources), sources.desktop);
  }
});
