import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import logoLibertad from "../assets/logoLibertad.webp";
import backgroundImage from "../assets/hero-mobile.webp";
import backgroundImageDos from "../assets/hero-desktop.webp";
import heroVideoMobile from "../assets/hero-intro-mobile-vertical.mp4";
import CinematicLink from "./CinematicLink";
import { startHeroVideoPlayback } from "../utils/heroVideoPlayback";
import { heroIntroSession, selectHeroVideoSource } from "../utils/heroIntroSession";

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
  const [introAlreadyStarted] = useState(() => heroIntroSession.hasStarted());
  // Una única fuente por visita: rotar/redimensionar no descarga el otro video.
  const [videoSource] = useState(() => selectHeroVideoSource(
    typeof window === "undefined" ? 1024 : window.innerWidth,
    { mobile: heroVideoMobile },
  ));
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768,
  );
  const [saveData] = useState(() =>
    typeof navigator !== "undefined" && Boolean(navigator.connection?.saveData),
  );
  const [videoStarted, setVideoStarted] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [videoReleased, setVideoReleased] = useState(false);
  const videoRef = useRef(null);
  const allowVideo = isMobile && Boolean(videoSource) && !introAlreadyStarted && !shouldReduceMotion && !saveData;
  const showContent = !allowVideo || introFinished || contentRevealed;
  const initialAnimation = shouldReduceMotion ? false : (!videoSource || !showContent ? "hidden" : false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => {
      setIsMobile(media.matches);
      if (!media.matches && videoSource) setIntroFinished(true);
    };
    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, [videoSource]);

  useEffect(() => {
    if (!allowVideo || introFinished) return;
    heroIntroSession.markStarted();
    const playback = startHeroVideoPlayback(videoRef.current, {
      onReady: () => setVideoStarted(true),
      onReveal: () => setContentRevealed(true),
      onFinish: () => setIntroFinished(true),
    });
    return () => playback.dispose();
  }, [allowVideo, introFinished]);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex h-dvh flex-col overflow-hidden border-b border-liberty-border bg-liberty-bg md:h-auto md:min-h-dvh"
    >
      <picture
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full opacity-[0.92]"
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
        <m.div
          aria-hidden="true"
          initial={false}
          animate={{ opacity: videoStarted && !introFinished ? 1 : 0 }}
          transition={{ duration: introFinished ? 1.2 : 0.5, ease: "easeInOut" }}
          onAnimationComplete={() => {
            if (introFinished) setVideoReleased(true);
          }}
          className="pointer-events-none absolute inset-0 z-0 md:bg-liberty-bg"
        >
          <video
            id="hero-intro-video"
            ref={videoRef}
            src={videoSource}
            tabIndex={-1}
            muted
            playsInline
            preload="none"
            disablePictureInPicture
            className="h-full w-full object-cover object-center md:absolute md:left-1/2 md:top-1/2 md:aspect-video md:h-auto md:w-[90%] md:max-w-[1280px] md:-translate-x-1/2 md:-translate-y-1/2 md:object-contain"
          />
        </m.div>
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
          initial={initialAnimation}
          animate={showContent ? "visible" : "hidden"}
          src={logoLibertad}
          alt=""
          aria-hidden="true"
          width="940"
          height="418"
          decoding="async"
          className="mb-5 h-40 w-auto object-contain drop-shadow-[0_26px_32px_rgba(2,2,2,0.99)] sm:h-36 md:mb-6 md:h-44"
        />

        <m.div
          variants={contentVariants}
          initial={initialAnimation}
          animate={showContent ? "visible" : "hidden"}
          className="flex w-full flex-1 flex-col items-center"
        >
          <m.h1
            id="hero-title"
            variants={contentItemVariants}
            className="max-w-5xl text-[clamp(2.5rem,3.5vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.045em] text-white [text-wrap:balance]"
          >
            <span className="block">La Libertad Avanza</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-liberty-primary to-liberty-primary-hover" >
              Santa Fe
            </span>
          </m.h1>


          <m.div
            variants={contentItemVariants}
            className="mt-80 flex w-full max-w-xl flex-col items-stretch justify-center gap-3 sm:mt-88 sm:flex-row sm:items-center sm:gap-4"
          >
            <Link
              to="/propuestas"
              className="inline-flex min-h-13 w-full items-center justify-center rounded-full border border-liberty-bg/90 bg-liberty-bg/65 px-7 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-liberty-text transition-colors duration-300 hover:border-white/70 hover:bg-liberty-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-liberty-bg sm:w-auto sm:flex-1"
            >
              Las propuestas
            </Link>
            <CinematicLink
              to="/sumate"
              className="inline-flex min-h-13 w-full items-center justify-center rounded-full border border-white/35 bg-liberty-primary px-7 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-liberty-primary-hover hover:bg-liberty-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-liberty-bg sm:w-auto sm:flex-1"
            >
              Afiliate al partido
            </CinematicLink>
          </m.div>
        </m.div>
      </div>


      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-liberty-primary/80 to-transparent"
      />
    </section>
  );
}
