import { m } from "framer-motion";
import CinematicLink from "./CinematicLink";

import rep1 from "../assets/lautaro.webp";
import rep2 from "../assets/giselle.webp";
import rep3 from "../assets/santiago.webp";
import rep4 from "../assets/david.webp";

export default function RepresentantesPreview() {
  const hasAnimated = sessionStorage.getItem("representantes_animated") === "true";

  const markAsAnimated = () => {
    if (!hasAnimated) {
      sessionStorage.setItem("representantes_animated", "true");
    }
  };

  // 1. Un solo set de variantes para controlar TODO desde el padre
  const containerVariants = {
    hidden: { opacity: hasAnimated ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Anima los hijos uno tras otro
        delayChildren: 0.1,
      },
    },
  };

  // 2. Variantes simplificadas para los hijos (textos e imágenes)
  const itemVariants = {
    hidden: { opacity: hasAnimated ? 1 : 0, y: hasAnimated ? 0 : 20, scale: hasAnimated ? 1 : 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="representantes"
      className="relative w-full py-24 md:py-32 bg-liberty-bg text-liberty-text overflow-hidden border-t border-liberty-border"
    >
      {/* Fondo desenfocado - Sin transform-gpu manual */}
      <div className="absolute top-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-liberty-primary/17 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-10">
        {/* EL PADRE CONTROLA TODO: Un solo whileInView */}
        <m.div
          onViewportEnter={markAsAnimated}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-24 items-center"
        >
          {/* Título Mobile */}
          <m.div variants={itemVariants} className="lg:hidden text-center">
            <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
              El equipo en el territorio
            </span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Nuestros{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r text-white">
                Concejales
              </span>
            </h2>
          </m.div>

          {/* Columna Izquierda: Grilla de Imágenes */}
          <div className="lg:col-span-7 relative w-full h-[600px] sm:h-[700px] lg:h-[750px] order-1 lg:order-1">
            <div className="grid grid-cols-2 md:grid-cols-12 md:grid-rows-12 gap-1 md:gap-1 w-full h-full">
              {[rep1, rep3, rep2, rep4].map((rep, index) => (
                <m.div 
                  key={index}
                  variants={itemVariants} 
                  className="col-span-1 md:col-span-6 md:row-span-6 relative rounded-2xl overflow-hidden border border-liberty-border/50 bg-liberty-card"
                >
                  <img src={rep} alt={`Representante ${index + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </m.div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Textos + Botón */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left z-10 order-2 lg:order-2">
            <m.div variants={itemVariants} className="hidden lg:block">
              <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
                El equipo en el territorio
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Nuestros <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r text-white">
                  Concejales
                </span>
              </h2>
            </m.div>

            <m.div variants={itemVariants}>
              <p className="text-base md:text-lg text-liberty-text-secondary max-w-lg mx-auto lg:mx-0 mb-10">
                Ellos son la primera línea de defensa. Conoce a los
                representantes que están dando la batalla cultural y política en
                los concejos deliberantes de toda la provincia.
              </p>
            </m.div>

            <m.div variants={itemVariants} className="mt-4 lg:mt-0">
              <CinematicLink
                to="/representantes"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-liberty-card text-white font-bold uppercase text-xs tracking-[0.2em] rounded-3xl border border-liberty-border hover:border-liberty-primary  w-full sm:w-max"
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