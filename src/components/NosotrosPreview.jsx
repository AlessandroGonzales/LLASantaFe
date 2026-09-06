import { m, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import CinematicLink from "./CinematicLink";
import nosotrosimg1 from "../assets/uplunidos-preview.webp";
import nosotrosimg2 from "../assets/nosotros.webp";
import nosotrosimg3 from "../assets/inicios.webp";

const gallery = [
  {
    src: nosotrosimg1,
    alt: "Grupo de Universitarios por la Libertad en Santa Fe",
    width: 960,
    height: 720,
    className: "col-span-1 row-span-1",
  },
  {
    src: nosotrosimg2,
    alt: "Militantes de La Libertad Avanza en Rosario",
    width: 889,
    height: 626,
    className: "col-span-1 row-span-1",
  },
  {
    src: nosotrosimg3,
    alt: "Encuentro de La Libertad Avanza en Rosario",
    width: 1280,
    height: 727,
    className: "col-span-2 row-span-1",
  },
];

function readAnimationFlag() {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem("nosotros_animated") === "true";
  } catch {
    return false;
  }
}

export default function NosotrosPreview() {
  const shouldReduceMotion = useReducedMotion();
  const hasAnimated = useMemo(() => readAnimationFlag(), []);
  const skipAnimation = hasAnimated || shouldReduceMotion;

  const markAsAnimated = () => {
    if (typeof window === "undefined" || hasAnimated) return;

    try {
      window.sessionStorage.setItem("nosotros_animated", "true");
    } catch {
      // El contenido sigue disponible si el navegador bloquea el storage.
    }
  };

  return (
    <section
      id="nosotros"
      aria-labelledby="nosotros-preview-heading"
      className="relative w-full scroll-mt-16 py-24 flex justify-center px-4 md:px-16 xl:px-36"
    >
      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA: TEXTO */}
          <m.div
            onViewportEnter={markAsAnimated}
            initial={skipAnimation ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-8 lg:col-span-7 pr-0 lg:pr-10"
          >
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block ">
                  Nuestra Historia
                </span>
              </div>

              <h2 id="nosotros-preview-heading" className="text-5xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.99] text-center lg:text-left">
                La trayectoria<br />
                hacia la <span className="text-transparent bg-clip-text bg-gradient-to-br text-white">Grandeza</span>
              </h2>
            </div>

            {/* PÁRRAFO — Oculto en mobile (aparece solo en desktop lg en adelante) */}
            <p className="hidden lg:block text-base md:text-lg text-liberty-text-secondary max-w-2xl text-center lg:text-left">
              No somos políticos tradicionales. Somos ciudadanos de a pie, trabajadores y estudiantes
              cansados de que nos roben el futuro. Somos la única opción real para
              cambiar el rumbo.
            </p>

            {/* BOTÓN — solo en desktop, debajo del texto */}
            <div className="hidden lg:block ">
              <CinematicLink
                to="/nosotros"
                className="group relative inline-flex items-center justify-center w-auto px-8 py-4  text-white font-bold uppercase text-xs tracking-[0.2em] bg-liberty-card border border-liberty-border rounded-4xl hover:bg-liberty-border/40 hover:border-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Conocer nuestra historia
              </CinematicLink>
            </div>
          </m.div>

          {/* COLUMNA DERECHA: GALERÍA (Sin animaciones de Blur, puramente transformaciones GPU) */}
          <m.div
            initial={skipAnimation ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 w-full"
          >
            <div className="relative w-full cursor-pointer group">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] transition-colors duration-500 group-hover:border-white/20">
                <div className="grid grid-cols-2 gap-2 auto-rows-[200px] sm:auto-rows-[250px] lg:auto-rows-[360px] md:p-0 ">
                  {gallery.map((item) => (
                    <img
                      key={item.src}
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      className={`w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 ${item.className} relative overflow-hidden rounded-[1rem] `}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* PÁRRAFO Y BOTÓN — Ocultos en desktop, visibles solo en mobile debajo de las imágenes */}
            <div className="pt-10 lg:hidden flex flex-col items-center space-y-8">
              <p className="text-base md:text-lg text-liberty-text-secondary max-w-2xl text-center px-2">
                No somos políticos tradicionales. Somos ciudadanos de a pie, trabajadores y estudiantes
                cansados de que nos roben el futuro. Somos la única opción real para
                cambiar el rumbo.
              </p>
              
              <CinematicLink
                to="/nosotros"
                className="group relative flex items-center justify-center w-full sm:w-auto px-8 py-4  text-white font-bold uppercase text-xs tracking-[0.2em] bg-liberty-card border border-liberty-border rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Conocer nuestra historia
              </CinematicLink>
            </div>
          </m.div>

        </div>
      </div>
    </section>
  );
}
