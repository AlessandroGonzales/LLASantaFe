export const HERO_CONTENT_REVEAL_SECONDS = 2;
export const HERO_VIDEO_WAIT_TIMEOUT_MS = 2000;

// El reloj del video, no un temporizador de la página, dirige la introducción.
export function startHeroVideoPlayback(video, callbacks, timers = globalThis) {
  let finished = false;
  let disposed = false;
  let revealed = false;
  let waitTimeout;

  const clearWait = () => {
    timers.clearTimeout(waitTimeout);
    waitTimeout = undefined;
  };

  const reveal = () => {
    if (revealed || disposed) return;
    revealed = true;
    callbacks.onReveal();
  };

  const finish = () => {
    if (finished || disposed) return;
    finished = true;
    clearWait();
    video.pause();
    reveal();
    callbacks.onFinish();
  };

  const waitForPlayback = () => {
    clearWait();
    waitTimeout = timers.setTimeout(finish, HERO_VIDEO_WAIT_TIMEOUT_MS);
  };

  const play = () => {
    if (finished || disposed) return;
    waitForPlayback();
    try {
      video.play()?.catch(finish);
    } catch {
      finish();
    }
  };

  const events = {
    playing: () => {
      if (finished || disposed) return;
      clearWait();
      callbacks.onReady();
      callbacks.onPauseChange?.(false);
    },
    timeupdate: () => {
      if (finished || disposed) return;
      if (!video.paused && !video.seeking && video.readyState >= 3) clearWait();
      if (video.currentTime >= HERO_CONTENT_REVEAL_SECONDS) reveal();
    },
    pause: () => {
      clearWait();
      if (!finished && !disposed) callbacks.onPauseChange?.(true);
    },
    waiting: () => {
      if (!finished && !disposed && !video.paused) waitForPlayback();
    },
    ended: finish,
    error: finish,
  };

  for (const [event, handler] of Object.entries(events)) {
    video.addEventListener(event, handler);
  }
  play();

  return {
    finish,
    togglePause() {
      if (finished || disposed) return;
      if (video.paused) play();
      else video.pause();
    },
    dispose() {
      disposed = true;
      clearWait();
      for (const [event, handler] of Object.entries(events)) {
        video.removeEventListener(event, handler);
      }
      video.pause();
    },
  };
}
