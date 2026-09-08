import { m, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import logoLibertad from "../assets/logoLibertad.webp";
import backgroundImage from "../assets/hero-mobile.webp";
import backgroundImageDos from "../assets/hero-desktop.webp";
import CinematicLink from "./CinematicLink";

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

function heroWasAnimated() {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem("hero_animated") === "true";
  } catch {
    return false;
  }
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const hasAnimated = heroWasAnimated();
  const skipIntro = hasAnimated || shouldReduceMotion;

  const markAsAnimated = () => {
    if (typeof window === "undefined" || hasAnimated) return;

    try {
      window.sessionStorage.setItem("hero_animated", "true");
    } catch {
      // La experiencia sigue funcionando aunque el navegador bloquee el storage.
    }
  };

  return (
    <section
      aria-labelledby="hero-title"
      // CAMBIO 1: Quitamos 'items-center' y agregamos 'flex-col' para distribuir verticalmente.
      className="relative isolate flex min-h-screen min-h-[100svh] flex-col overflow-hidden border-b border-liberty-border bg-liberty-bg"
    >
      <m.picture
        aria-hidden="true"
        initial={skipIntro ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 0.82, scale: 1 }}
        transition={{ duration: skipIntro ? 0 : 1.6, ease: "easeOut" }}
        className="absolute inset-0 z-0 h-full w-full"
        onAnimationComplete={markAsAnimated}
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
      </m.picture>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b via-liberty-bg/1 to-liberty-bg"
      />

      {/* CAMBIO 2: Agregamos 'flex-1'. Cambiamos pt-24 a pt-12 (y pt-28 a pt-16) para subir el bloque de logo y título */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-5 pb-14 pt-20 text-center sm:px-8 sm:pb-16 md:pt-16">
        <m.img
          variants={eagleVariants}
          initial={skipIntro ? false : "hidden"}
          animate="visible"
          src={logoLibertad}
          alt=""
          aria-hidden="true"
          width="940"
          height="418"
          decoding="async"
          className="mb-5 h-40 w-auto object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.38)] sm:h-36 md:mb-6 md:h-44"
        />

        {/* CAMBIO 3: Agregamos 'flex-1' a este wrapper para que empuje el contenido hacia abajo. */}
        <m.div
          variants={contentVariants}
          initial={skipIntro ? false : "hidden"}
          animate="visible"
          className="flex w-full flex-1 flex-col items-center"
        >
          <m.h1
            id="hero-title"
            variants={contentItemVariants}
            className="max-w-5x1 text-[clamp(2.5rem,4vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.065em] text-white [text-wrap:balance]"
          >
            <span className="block">La Libertad Avanza</span>
            <span className="mt-2 block text-liberty-primary sm:mt-3">
              Santa Fe
            </span>
          </m.h1>

          {/* CAMBIO 4: Cambiamos 'mt-6' a 'mt-auto md:mt-7'. 
              En celular 'mt-auto' baja esto y los botones al límite inferior. En desktop 'md:mt-7' los vuelve a juntar. */}
          <m.p
            id="hero-purpose"
            variants={contentItemVariants}
            className="mt-72 max-w-2xl text-base font-medium leading-relaxed text-white/85 [text-wrap:balance] sm:text-lg md:mt-49 md:text-xl"
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

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-liberty-primary/80 to-transparent"
      />
    </section>
  );
}