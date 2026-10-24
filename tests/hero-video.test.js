import assert from "node:assert/strict";
import test from "node:test";
import {
  HERO_VIDEO_WAIT_TIMEOUT_MS,
  startHeroVideoPlayback,
} from "../src/utils/heroVideoPlayback.js";

class FakeVideo extends EventTarget {
  currentTime = 0;
  paused = true;
  seeking = false;
  readyState = 4;
  playCalls = 0;
  playError;

  emit(name) {
    this.dispatchEvent(new Event(name));
  }

  play() {
    this.playCalls += 1;
    if (this.playError) return Promise.reject(this.playError);
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    if (this.paused) return;
    this.paused = true;
    this.emit("pause");
  }
}

function setup(video = new FakeVideo()) {
  const calls = { ready: 0, reveal: 0, finish: 0, paused: [] };
  const pending = new Map();
  let nextId = 0;
  const timers = {
    setTimeout(callback, delay) {
      pending.set(++nextId, { callback, delay });
      return nextId;
    },
    clearTimeout(id) {
      pending.delete(id);
    },
  };
  const playback = startHeroVideoPlayback(video, {
    onReady: () => calls.ready++,
    onReveal: () => calls.reveal++,
    onFinish: () => calls.finish++,
    onPauseChange: (paused) => calls.paused.push(paused),
  }, timers);
  const expireWait = () => {
    const tasks = [...pending.values()];
    pending.clear();
    for (const task of tasks) task.callback();
  };
  return { video, playback, calls, pending, expireWait };
}

test("revela el contenido al llegar a 2 segundos reales, una sola vez", () => {
  const { video, playback, calls, pending } = setup();
  assert.equal(video.playCalls, 1);
  video.emit("playing");
  assert.equal(pending.size, 0);
  for (const time of [0, 1, 1.99]) {
    video.currentTime = time;
    video.emit("timeupdate");
  }
  assert.equal(calls.reveal, 0);
  for (const time of [2, 2.25, 10]) {
    video.currentTime = time;
    video.emit("timeupdate");
  }
  assert.equal(calls.reveal, 1);
  assert.equal(calls.finish, 0);
  playback.dispose();
});

test("terminar el video revela el contenido, incluso en un clip menor a 2 segundos", () => {
  const { video, calls, playback } = setup();
  video.currentTime = 1;
  video.emit("ended");
  video.emit("error");
  assert.equal(calls.reveal, 1);
  assert.equal(calls.finish, 1);
  assert.equal(video.paused, true);
  playback.dispose();
});

test("reproducir y pausar funciona sin callback opcional de pausa", () => {
  const video = new FakeVideo();
  const calls = { ready: 0, finish: 0 };
  const playback = startHeroVideoPlayback(video, {
    onReady: () => calls.ready++,
    onReveal: () => {},
    onFinish: () => calls.finish++,
  });
  video.emit("playing");
  playback.togglePause();
  assert.equal(calls.ready, 1);
  assert.equal(video.paused, true);
  playback.finish();
  assert.equal(calls.finish, 1);
  playback.dispose();
});

test("si se bloquea autoplay, muestra la imagen y el contenido", async () => {
  const video = new FakeVideo();
  video.playError = new Error("Autoplay blocked");
  const { calls, pending, playback } = setup(video);
  await Promise.resolve();
  assert.equal(calls.finish, 1);
  assert.equal(calls.reveal, 1);
  assert.equal(pending.size, 0);
  playback.dispose();
});

test("si play lanza un error síncrono, también termina la introducción", () => {
  const video = new FakeVideo();
  video.play = () => { throw new Error("Unsupported video"); };
  const { calls, playback } = setup(video);
  assert.equal(calls.finish, 1);
  playback.dispose();
});

test("una carga que no arranca no puede ocultar el contenido indefinidamente", () => {
  const { calls, pending, expireWait, playback } = setup();
  assert.equal([...pending.values()][0].delay, HERO_VIDEO_WAIT_TIMEOUT_MS);
  expireWait();
  assert.equal(calls.finish, 1);
  assert.equal(calls.reveal, 1);
  playback.dispose();
});

test("buffering prolongado termina la introducción", () => {
  const { video, calls, expireWait, playback } = setup();
  video.emit("playing");
  video.emit("waiting");
  expireWait();
  assert.equal(calls.finish, 1);
  playback.dispose();
});

test("reanudar luego de buffering cancela la salida de emergencia", () => {
  const { video, calls, pending, expireWait, playback } = setup();
  video.emit("waiting");
  video.emit("playing");
  assert.equal(pending.size, 0);
  expireWait();
  assert.equal(calls.finish, 0);
  playback.dispose();
});

test("pausar no adelanta el reloj ni activa la salida por carga lenta", () => {
  const { video, calls, pending, expireWait, playback } = setup();
  video.currentTime = 3;
  video.emit("playing");
  playback.togglePause();
  video.emit("waiting");
  expireWait();
  assert.equal(pending.size, 0);
  assert.equal(calls.reveal, 0);
  assert.equal(calls.finish, 0);
  assert.equal(calls.paused.at(-1), true);
  playback.togglePause();
  video.emit("playing");
  assert.equal(video.playCalls, 2);
  assert.equal(video.currentTime, 3);
  assert.equal(calls.paused.at(-1), false);
  playback.dispose();
});

test("omitir termina una sola vez y no permite reiniciar el video", () => {
  const { playback, video, calls } = setup();
  playback.finish();
  playback.finish();
  playback.togglePause();
  video.emit("playing");
  assert.equal(calls.finish, 1);
  assert.equal(calls.reveal, 1);
  assert.equal(calls.ready, 0);
  assert.equal(video.playCalls, 1);
  playback.dispose();
});

test("desmontar limpia eventos, temporizadores y rechazos pendientes", async () => {
  const video = new FakeVideo();
  video.playError = new Error("Late rejection");
  const { playback, calls, pending, expireWait } = setup(video);
  playback.dispose();
  await Promise.resolve();
  video.emit("ended");
  video.emit("playing");
  video.currentTime = 9;
  video.emit("timeupdate");
  expireWait();
  assert.equal(pending.size, 0);
  assert.equal(calls.reveal, 0);
  assert.equal(calls.finish, 0);
  assert.equal(calls.ready, 0);
});
