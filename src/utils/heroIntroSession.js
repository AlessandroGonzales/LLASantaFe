export const HERO_INTRO_SESSION_KEY = "lla:hero-intro-started:v1";

// El respaldo en memoria evita repeticiones al navegar si el navegador bloquea
// sessionStorage. Con storage disponible también se conserva al recargar.
export function createHeroIntroSession(getStorage) {
  let startedInMemory = false;

  return {
    hasStarted() {
      if (startedInMemory) return true;
      try {
        return getStorage()?.getItem(HERO_INTRO_SESSION_KEY) === "true";
      } catch {
        return false;
      }
    },
    markStarted() {
      startedInMemory = true;
      try {
        getStorage()?.setItem(HERO_INTRO_SESSION_KEY, "true");
      } catch {
        // No es imprescindible habilitar almacenamiento para navegar el sitio.
      }
    },
  };
}

export const heroIntroSession = createHeroIntroSession(() =>
  typeof window === "undefined" ? undefined : window.sessionStorage,
);

export function selectHeroVideoSource(viewportWidth, { mobile, desktop }) {
  return viewportWidth < 768 ? mobile : desktop;
}
