import { motion } from "framer-motion";
import CinematicLink from "./CinematicLink";

import dip1 from "../assets/rominaDiezDiputada.png";
import dip2 from "../assets/nicolaRaveraz.png";
import dip3 from "../assets/agustinPellegrini.png";

export default function DiputadosPreview() {
  const hasAnimated = sessionStorage.getItem("diputados_animated") === "true";

  const markAsAnimated = () => {
    if (!hasAnimated) {
      sessionStorage.setItem("diputados_animated", "true");
    }
  };

  const bentoItem = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section 
      id="diputados" 
      className="relative w-full py-24 md:py-32 bg-liberty-bg text-liberty-text overflow-hidden border-t border-liberty-border font-satoshi transform-gpu translate-z-0"
    >
      {/* Luces GPU Aisladas */}
      <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-liberty-primary/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3 transform-gpu translate-z-0" />

      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-10">
        
        {/* =========================================
            TÍTULO SOLO EN MOBILE (arriba de las imágenes)
            Diseño intacto
        ========================================= */}
        <div className="lg:hidden mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="will-change-transform"
          >
            <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
              La voz en la legislatura
            </span>
            
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-liberty-primary to-liberty-primary-hover">Diputados</span>
            </h2>
          </motion.div>
        </div>

        {/* =========================================
            GRID PRINCIPAL
        ========================================= */}
        <motion.div
          onViewportEnter={markAsAnimated}
          initial={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center"
        >
          
          {/* COLUMNA IZQUIERDA - Textos + Botón */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left z-10 order-2 lg:order-1">
            
            {/* Título oculto en mobile (Diseño intacto) */}
            <motion.div 
              className="hidden lg:block will-change-transform"
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={hasAnimated ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
                La voz en la legislatura
              </span>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Nuestros <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-liberty-primary to-liberty-primary-hover">
                  Diputados
                </span>
              </h2>
            </motion.div>

            {/* Descripción */}
            <motion.div 
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={hasAnimated ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="will-change-transform"
            >
              <p className="text-base md:text-lg text-liberty-text-secondary max-w-lg mx-auto lg:mx-0 mb-10">
                Llevamos la batalla por las ideas de la libertad a la cámara de diputados. Conoce a los legisladores que trabajan incansablemente para reducir el estado y defender tus derechos en Santa Fe.
              </p>
            </motion.div>

            {/* Botón */}
            <motion.div 
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={hasAnimated ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="will-change-transform"
            >
              <CinematicLink
                to="/diputados"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-liberty-card text-white font-bold uppercase text-xs tracking-[0.2em]  rounded-3xl border border-liberty-border hover:border-liberty-primary w-full sm:w-max"
              >
                  Ver legisladores
              </CinematicLink>
            </motion.div>
          </div>

          {/* COLUMNA DERECHA - Bento Grid */}
          <div className="lg:col-span-7 relative w-full h-[500px] sm:h-[600px] lg:h-[700px] order-1 lg:order-2">
            <motion.div 
              className="grid grid-cols-12 grid-rows-12 gap-3 md:gap-5 w-full h-full"
              initial={hasAnimated ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.2 } }
              }}
            >
              {/* Imagen Principal */}
              <motion.div 
                variants={bentoItem}
                className="col-span-7 row-span-12 relative rounded-2xl overflow-hidden group border border-liberty-border/50 bg-liberty-card transform-gpu will-change-transform"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-liberty-bg via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <img 
                  src={dip1} 
                  alt="Diputado Principal" 
                  className="w-full h-full object-cover contrast-100 group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-700 transform-gpu" 
                  loading="lazy" 
                  decoding="async"
                />
              </motion.div>

              {/* Imagen Superior Derecha */}
              <motion.div 
                variants={bentoItem}
                className="col-span-5 row-span-7 relative rounded-2xl overflow-hidden group border border-liberty-border/50 bg-liberty-card transform-gpu will-change-transform"
              >
                <div className="absolute inset-0 bg-liberty-primary/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
                <img 
                  src={dip2} 
                  alt="Diputada 2" 
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-700 transform-gpu" 
                  loading="lazy" 
                  decoding="async"
                />
              </motion.div>

              {/* Imagen Inferior Derecha */}
              <motion.div 
                variants={bentoItem}
                className="col-span-5 row-span-5 relative rounded-2xl overflow-hidden group border border-liberty-border/50 bg-liberty-card transform-gpu will-change-transform"
              >
                <img 
                  src={dip3} 
                  alt="Diputado 3" 
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-700 transform-gpu" 
                  loading="lazy" 
                  decoding="async"
                />
              </motion.div>
            </motion.div>
          </div>

        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}