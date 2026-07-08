import { motion } from "framer-motion";
import { useMemo } from "react";
import CinematicLink from "./CinematicLink";
import nosotrosimg1 from "../assets/uplunidos.webp";
import nosotrosimg2 from "../assets/nosotros.webp";
import nosotrosimg3 from "../assets/inicios.webp";

const gallery = [
  {
    src: nosotrosimg1,
    alt: "Inicio del movimiento en Santa Fe",
    className: "col-span-1 row-span-1",
  },
  {
    src: nosotrosimg2,
    alt: "Militancia y presencia territorial",
    className: "col-span-1 row-span-1",
  },
  {
    src: nosotrosimg3,
    alt: "Futuro de La Libertad Avanza Santa Fe",
    className: "col-span-2 row-span-1",
  },
];

export default function NosotrosPreview() {
  const hasAnimated = useMemo(
    () => sessionStorage.getItem("nosotros_animated") === "true",
    []
);

  const markAsAnimated = () => {
    sessionStorage.setItem("nosotros_animated", "true");
  };

  return (
    <section
      id="nosotros"
      className="relative w-full py-24 flex justify-center px-6 md:px-16 xl:px-36 bg-liberty-bg transform-gpu translate-z-0"
    >

      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 items-center">

          {/* TEXTO */}
          <motion.div
            onViewportEnter={markAsAnimated} // Guardamos en memoria que ya se vio
            initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-12 lg:col-span-7 pr-0 lg:pr-10 will-change-transform"
          >
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-2">
                  Nuestra Historia
                </span>
              </div>

              <h2 className="text-5xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.85] text-center lg:text-left">
                La trayectoria<br/>
                hacia la <span className="text-transparent bg-clip-text bg-gradient-to-br text-white">Grandeza</span>
              </h2>
            </div>

            <div className="flex flex-col space-y-6">
              <p className="text-base md:text-lg text-liberty-text-secondary leading-relaxed max-w-2xl text-center lg:text-left">
                No somos políticos tradicionales. Somos ciudadanos de a pie, trabajadores y estudiantes
                cansados de que nos roben el futuro. Somos la única opción real para
                cambiar el rumbo.
              </p>

              {/* Nueva Frase */}
              <p className="text-sm md:text-base text-liberty-primary font-bold uppercase tracking-wider   text-center lg:text-left max-w-2xl border-l-2 border-liberty-primary/40 pl-0 lg:pl-4 border-none lg:border-solid">
                "Escribiendo la mejor página de la historia de la Argentina y la provincia de Santa Fe"
              </p>
            </div>


            {/* BOTÓN — solo en desktop, debajo del texto */}
            <div className="hidden lg:block pt-4">
              <CinematicLink
                to="/nosotros"
                className="group relative inline-flex items-center justify-center w-auto px-8 py-4 font-bold text-white bg-liberty-card border border-liberty-border rounded-4xl hover:bg-liberty-border/40 hover:border-liberty-primary"
              >
                Conocer nuestra historia
              </CinematicLink>
            </div>
          </motion.div>

          {/* GALERÍA (Sin animaciones de Blur, puramente transformaciones GPU) */}
          <motion.div
            initial={hasAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 w-full will-change-transform "
          >
            <div
              className="relative w-full cursor-pointer group"
            >
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] transition-colors duration-500 group-hover:border-white/20">
                <div className="grid grid-cols-2  auto-rows-[200px] sm:auto-rows-[250px] lg:auto-rows-[360px] md:p-0 ">
                  {gallery.map((item,) => (

                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 ${item.className} relative overflow-hidden rounded-[1rem] `}
                      />
                  ))}
                </div>
              </div>
            </div>

            {/* BOTÓN — solo en mobile, debajo de las imágenes */}
            <div className="pt-12 lg:hidden flex justify-center">
              <CinematicLink
                to="/nosotros"
                className="group relative flex items-center justify-center w-full sm:w-auto px-8 py-4 font-bold text-white bg-liberty-card border border-liberty-border rounded-4xl  "
              >
                Conocer nuestra historia
              </CinematicLink>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}