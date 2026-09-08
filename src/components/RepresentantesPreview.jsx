import { m, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import CinematicLink from "./CinematicLink";

import rep1 from "../assets/lautaro-preview.webp";
import rep2 from "../assets/giselle.webp";
import rep3 from "../assets/santiago-preview.webp";
import rep4 from "../assets/david-preview.webp";

const representatives = [
  {
    src: rep1,
    alt: "Lautaro Enriquez, concejal de Rosario",
    width: 1000,
    height: 666,
  },
  {
    src: rep3,
    alt: "Santiago Fontana, concejal de Granadero Baigorria",
    width: 750,
    height: 1000,
  },
  {
    src: rep2,
    alt: "María Giselle Miravete, concejal de Santo Tomé",
    width: 640,
    height: 641,
  },
  {
    src: rep4,
    alt: "David Sanfilippo, concejal de Teodelina",
    width: 702,
    height: 1000,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function readAnimationFlag() {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem("representantes_animated") === "true";
  } catch {
    return false;
  }
}

export default function RepresentantesPreview() {
  const shouldReduceMotion = useReducedMotion();
  const hasAnimated = useMemo(() => readAnimationFlag(), []);
  const skipAnimation = hasAnimated || shouldReduceMotion;

  const markAsAnimated = () => {
    if (typeof window === "undefined" || hasAnimated) return;

    try {
      window.sessionStorage.setItem("representantes_animated", "true");
    } catch {
      // El contenido sigue disponible si el navegador bloquea el storage.
    }
  };

  return (
    <section
      id="representantes"
      aria-labelledby="representantes-preview-heading"
      aria-describedby="representantes-preview-description"
      className="relative w-full scroll-mt-16 py-24 md:py-32 bg-liberty-bg text-liberty-text overflow-hidden "
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-liberty-primary/17 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"
      />

      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-10">
        <h2 id="representantes-preview-heading" className="sr-only">
          Nuestros concejales
        </h2>

        <m.div
          onViewportEnter={markAsAnimated}
          variants={containerVariants}
          initial={skipAnimation ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-24 items-center"
        >
          <m.div
            variants={itemVariants}
            className="lg:hidden text-center"
            aria-hidden="true"
          >
            <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
              El equipo en el territorio
            </span>
            <div className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.99] mb-6">
              Nuestros{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r text-white">
                Concejales
              </span>
            </div>
          </m.div>

          <div className="lg:col-span-7 relative w-full h-[600px] sm:h-[700px] lg:h-[750px] order-1 lg:order-1">
            <div
              role="list"
              aria-label="Concejales de La Libertad Avanza Santa Fe"
              className="grid grid-cols-2 md:grid-cols-12 md:grid-rows-12 gap-1 md:gap-1 w-full h-full"
            >
              {representatives.map((representative) => (
                <m.div
                  key={representative.src}
                  role="listitem"
                  variants={itemVariants}
                  className="col-span-1 md:col-span-6 md:row-span-6 relative rounded-2xl overflow-hidden border border-liberty-border/50 bg-liberty-card"
                >
                  <img
                    src={representative.src}
                    alt={representative.alt}
                    width={representative.width}
                    height={representative.height}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </m.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left z-10 order-2 lg:order-2">
            <m.div
              variants={itemVariants}
              className="hidden lg:block"
              aria-hidden="true"
            >
              <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
                El equipo en el territorio
              </span>
              <div className="text-5xl md:text-6xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Nuestros <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r text-white">
                  Concejales
                </span>
              </div>
            </m.div>

            <m.div variants={itemVariants}>
              <p
                id="representantes-preview-description"
                className="text-base md:text-lg text-liberty-text-secondary max-w-lg mx-auto lg:mx-0 mb-10"
              >
                Son la primera línea de defensa. Conocé a los representantes que
                están dando la batalla cultural y política en los concejos
                deliberantes de toda la provincia.
              </p>
            </m.div>

            <m.div variants={itemVariants} className="mt-4 lg:mt-0">
              <CinematicLink
                to="/representantes"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-liberty-card text-white font-bold uppercase text-xs tracking-[0.2em] rounded-3xl border border-liberty-border hover:border-liberty-primary  w-full sm:w-max focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Conocer al equipo
              </CinematicLink>
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
