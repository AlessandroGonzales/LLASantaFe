import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import logoLibertad from "../assets/logoLibertad.webp";
import backgroundImage from "../assets/hero-mobile.webp";
import backgroundImageDos from "../assets/hero-desktop.webp";
import heroVideo from "../assets/hero-intro.mp4";
import heroVideoMobile from "../assets/hero-intro-mobile-vertical.mp4";
import CinematicLink from "./CinematicLink";
import { startHeroVideoPlayback } from "../utils/heroVideoPlayback";

const eagleVariants = {
  hidden: { opacity: 0, scale: 0.84, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.25, staggerChildren: 0.14 },
  },
};

const contentItemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [saveData] = useState(() =>
    typeof navigator !== "undefined" && Boolean(navigator.connection?.saveData),
  );
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [videoReleased, setVideoReleased] = useState(false);
  const videoRef = useRef(null);
  const playbackRef = useRef(null);
  const controlsRef = useRef(null);
  const titleRef = useRef(null);
  const restoreFocusRef = useRef(false);
  const allowVideo = !shouldReduceMotion && !saveData;
  const showContent = !allowVideo || introFinished || contentRevealed;
  const showControls = allowVideo && !introFinished;

  useEffect(() => {
    if (!allowVideo || introFinished) return;
    const playback = startHeroVideoPlayback(videoRef.current, {
      onReady: () => setVideoStarted(true),
      onReveal: () => setContentRevealed(true),
      onPauseChange: setVideoPaused,
      onFinish: () => {
        restoreFocusRef.current = controlsRef.current?.contains(document.activeElement);
        setIntroFinished(true);
      },
    });
    playbackRef.current = playback;
    return () => {
      playback.dispose();
      playbackRef.current = null;
    };
  }, [allowVideo, introFinished]);

  useEffect(() => {
    if (showContent && introFinished && restoreFocusRef.current) {
      titleRef.current?.focus({ preventScroll: true });
      restoreFocusRef.current = false;
    }
  }, [showContent, introFinished]);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex h-9/12 flex-col overflow-hidden border-b border-liberty-border bg-liberty-bg"
    >
      <picture
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full opacity-[0.82]"
      >
        <source
          media="(min-width: 768px)"
          srcSet={backgroundImageDos}
          type="image/webp"
        />
        <img
          src={backgroundImage}
          alt=""
          width="900"
          height="838"
          fetchPriority="high"
          decoding="async"
          className="hero-background-motion h-full w-full object-cover object-top md:object-[center_1%]"
        />
      </picture>

      {allowVideo && !videoReleased && (!introFinished || videoStarted) && (
        <m.video
          id="hero-intro-video"
          ref={videoRef}
          aria-hidden="true"
          tabIndex={-1}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          initial={false}
          animate={{ opacity: videoStarted && !introFinished ? 1 : 0 }}
          transition={{ duration: introFinished ? 1.2 : 0.5, ease: "easeInOut" }}
          onAnimationComplete={() => {
            if (introFinished) setVideoReleased(true);
          }}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
        >
          <source src={heroVideoMobile} media="(max-width: 767px)" type="video/mp4" />
          <source src={heroVideo} type="video/mp4" />
        </m.video>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b via-liberty-bg/1 to-liberty-bg"
      />
      <div
        inert={!showContent}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-5 pb-14 pt-20 text-center sm:px-8 sm:pb-16 md:pt-16"
      >
        <m.img
          variants={eagleVariants}
          initial={showContent ? false : "hidden"}
          animate={showContent ? "visible" : "hidden"}
          src={logoLibertad}
          alt=""
          aria-hidden="true"
          width="940"
          height="418"
          decoding="async"
          className="mb-5 h-40 w-auto object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.38)] sm:h-36 md:mb-6 md:h-44"
        />

        <m.div
          variants={contentVariants}
          initial={showContent ? false : "hidden"}
          animate={showContent ? "visible" : "hidden"}
          className="flex w-full flex-1 flex-col items-center"
        >
          <m.h1
            id="hero-title"
            ref={titleRef}
            tabIndex={-1}
            variants={contentItemVariants}
            className="max-w-5x1 text-[clamp(2.5rem,3.5vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.065em] text-white [text-wrap:balance]"
          >
            <span className="block">La Libertad Avanza</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-liberty-primary to-liberty-primary-hover" >
              Santa Fe
            </span>
          </m.h1>

          <m.p
            id="hero-purpose"
            variants={contentItemVariants}
            className="mt-72 max-w-2xl text-base font-medium leading-relaxed text-white/85 [text-wrap:balance] sm:text-lg md:mt-69 md:text-ms"
          >
            Impulsamos ideas, propuestas y participación ciudadana para construir
            una Santa Fe más libre, segura y próspera.
          </m.p>

          <m.div
            variants={contentItemVariants}
            className="mt-8 flex w-full max-w-xl flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
          >
            <Link
              to="/propuestas"
              className="inline-flex min-h-13 w-full items-center justify-center rounded-full border border-liberty-primary bg-liberty-primary px-7 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-liberty-text transition-colors duration-300 hover:border-liberty-primary-hover hover:bg-liberty-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-liberty-bg sm:w-auto sm:flex-1"
            >
              Las propuestas
            </Link>
            <CinematicLink
              to="/sumate"
              className="inline-flex min-h-13 w-full items-center justify-center rounded-full border border-white/35 bg-liberty-bg/55 px-7 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/70 hover:bg-liberty-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-liberty-bg sm:w-auto sm:flex-1"
            >
              Quiero ser parte
            </CinematicLink>
          </m.div>
        </m.div>
      </div>

      {showControls && (
        <div ref={controlsRef} className="absolute bottom-3 right-4 z-20 flex gap-2 sm:right-6">
          {videoStarted && (
            <button
              type="button"
              aria-controls="hero-intro-video"
              onClick={() => playbackRef.current?.togglePause()}
              className="min-h-11 rounded-full border border-white/30 bg-liberty-bg/80 px-4 text-xs font-medium text-white transition-colors hover:bg-liberty-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {videoPaused ? "Reanudar video" : "Pausar video"}
            </button>
          )}
          <button
            type="button"
            onClick={() => playbackRef.current?.finish()}
            className="min-h-11 rounded-full border border-white/30 bg-liberty-bg/80 px-4 text-xs font-medium text-white transition-colors hover:bg-liberty-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Omitir introducción
          </button>
        </div>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-liberty-primary/80 to-transparent"
      />
    </section>
  );
}
