import { m, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import CinematicLink from "./CinematicLink";

import dip1 from "../assets/rominaDiezDiputada.webp";
import dip2 from "../assets/nicolaRaveraz.webp";
import dip3 from "../assets/agustinPellegrini.webp";

const bentoItem = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

function readAnimationFlag() {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem("diputados_animated") === "true";
  } catch {
    return false;
  }
}

export default function DiputadosPreview() {
  const shouldReduceMotion = useReducedMotion();
  const hasAnimated = useMemo(() => readAnimationFlag(), []);
  const skipAnimation = hasAnimated || shouldReduceMotion;

  const markAsAnimated = () => {
    if (typeof window === "undefined" || hasAnimated) return;

    try {
      window.sessionStorage.setItem("diputados_animated", "true");
    } catch {
      // El contenido sigue disponible si el navegador bloquea el storage.
    }
  };

  return (
    <section 
      id="diputados" 
      aria-labelledby="diputados-preview-heading"
      className="relative w-full scroll-mt-16 py-24 md:py-32 bg-liberty-bg text-liberty-text overflow-hidden"
    >
      {/* Luces GPU Aisladas */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-liberty-primary/17 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-10">
        <h2 id="diputados-preview-heading" className="sr-only">
          Nuestros diputados
        </h2>
        
        {/* =========================================
            TÍTULO SOLO EN MOBILE (arriba de las imágenes)
            Diseño intacto
        ========================================= */}
        <div className="lg:hidden mb-10 text-center">
          <m.div
            initial={skipAnimation ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            aria-hidden="true"
          >
            <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
              La voz en el Congreso
            </span>
            
            <div className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              Nuestros <span className=" text-white">Diputados</span>
            </div>
          </m.div>
        </div>

        {/* =========================================
            GRID PRINCIPAL
        ========================================= */}
        <m.div
          onViewportEnter={markAsAnimated}
          initial={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center"
        >
          
          {/* COLUMNA IZQUIERDA - Textos + Botón */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left z-10 order-2 lg:order-1">
            
            {/* Título oculto en mobile (Diseño intacto) */}
            <m.div 
              className="hidden lg:block"
              initial={skipAnimation ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              aria-hidden="true"
            >
              <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
                La voz en el Congreso
              </span>
              
              <div className="text-5xl md:text-6xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.99] mb-6">
                Nuestros <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r text-white">
                  Diputados
                </span>
              </div>
            </m.div>

            {/* Descripción */}
            <m.div 
              initial={skipAnimation ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-base md:text-lg text-liberty-text-secondary max-w-lg mx-auto lg:mx-0 mb-10">
                Llevamos las ideas de la libertad a la Cámara de Diputados de la Nación. Conocé a los legisladores que trabajan para reducir el Estado y defender los derechos de los santafesinos.
              </p>
            </m.div>

            {/* Botón */}
            <m.div 
              initial={skipAnimation ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CinematicLink
                to="/diputados"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-liberty-card text-white font-bold uppercase text-xs tracking-[0.2em]  rounded-3xl border border-liberty-border hover:border-liberty-primary w-full sm:w-max focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                  Ver legisladores
              </CinematicLink>
            </m.div>
          </div>

          {/* COLUMNA DERECHA - Bento Grid */}
          <div className="lg:col-span-7 relative w-full h-[500px] sm:h-[600px] lg:h-[700px] order-1 lg:order-2">
            <m.div 
              className="grid grid-cols-12 grid-rows-12 gap-1 md:gap-1 w-full h-full"
              initial={skipAnimation ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.2 } }
              }}
            >
              {/* Imagen Principal */}
              <m.div 
                variants={bentoItem}
                className="col-span-7 row-span-12 relative rounded-2xl overflow-hidden group border border-liberty-border/50 bg-liberty-card"
              >
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-liberty-bg via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <img 
                  src={dip1} 
                  alt="Romina Diez, diputada nacional por Santa Fe"
                  width="593"
                  height="619"
                  className="w-full h-full object-cover contrast-100 group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-700"
                  loading="lazy" 
                  decoding="async"
                />
              </m.div>

              {/* Imagen Superior Derecha */}
              <m.div 
                variants={bentoItem}
                className="col-span-5 row-span-7 relative rounded-2xl overflow-hidden group border border-liberty-border/50 bg-liberty-card"
              >
                <div aria-hidden="true" className="absolute inset-0 bg-liberty-primary/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
                <img 
                  src={dip2} 
                  alt="Nicolás Mayoraz, diputado nacional por Santa Fe"
                  width="1254"
                  height="1254"
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-700"
                  loading="lazy" 
                  decoding="async"
                />
              </m.div>

              {/* Imagen Inferior Derecha */}
              <m.div 
                variants={bentoItem}
                className="col-span-5 row-span-5 relative rounded-2xl overflow-hidden group border border-liberty-border/50 bg-liberty-card"
              >
                <img 
                  src={dip3} 
                  alt="Agustín Pellegrini, diputado nacional por Santa Fe"
                  width="440"
                  height="498"
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-700"
                  loading="lazy" 
                  decoding="async"
                />
              </m.div>
            </m.div>
          </div>

        </m.div>
      </div>
    </section>
  );
}
