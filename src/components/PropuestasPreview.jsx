import { motion } from "framer-motion";
import mapaSantaFe from "../assets/mapaSantaFe.webp"; 
import CinematicLink from "./CinematicLink";



export default function PropuestasPreview() {
  // 1. Verificamos si las animaciones ya se ejecutaron
  const hasAnimated = sessionStorage.getItem("propuestas_animated") === "true";

  // 2. Función que se dispara cuando el componente entra en pantalla
  const markAsAnimated = () => {
    sessionStorage.setItem("propuestas_animated", "true");
  };

  return (
    <section id="preview" className="relative w-full py-1 lg:py-14 bg-liberty-bg overflow-hidden mb-10 transform-gpu translate-z-0 ">
      
      {/* LUZ DE FONDO (Forzadas a la GPU para evitar recalcular el Blur en el scroll) */}
      <motion.div 
        onViewportEnter={markAsAnimated}
        initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-liberty-primary/10 rounded-full blur-[120px] pointer-events-none z-0 transform-gpu translate-z-0 will-change-opacity" 
      />
      <motion.div 
        initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-liberty-cyan/5 rounded-full blur-[100px] pointer-events-none z-0 transform-gpu translate-z-0 will-change-opacity" 
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* TÍTULO MOBILE */}
          <motion.div 
            initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full text-center lg:hidden will-change-transform"
          >
            <div className="space-y-2">
              <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
                El plan para la provincia
              </span>
              <h2 className="text-5xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.99] text-center lg:text-left">
                Nuestras{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-liberty-primary to-liberty-primary-hover">
                  Propuestas
                </span>
              </h2>
            </div>
          </motion.div>

          {/* COLUMNA IZQUIERDA: Mapa de Santa Fe */}
          <motion.div 
            initial={hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 flex justify-center relative group will-change-transform"
          >
            {/* Círculo de luz dinámico (hace de sombra y resplandor, mucho más óptimo) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-liberty-primary/30 to-transparent rounded-full blur-[60px] lg:blur-[80px] opacity-40 group-hover:opacity-80 transition-opacity duration-700 transform-gpu translate-z-0" />

            <img
              src={mapaSantaFe}
              alt="Mapa de los Departamentos de Santa Fe"
              loading="lazy"
              decoding="async"
              className="w-4/5 sm:w-1/2 lg:w-4/5 h-auto object-contain transition-transform duration-700 group-hover:-translate-y-3 group-hover:scale-105 z-10 relative transform-gpu will-change-transform"
            />
          </motion.div>

          {/* COLUMNA DERECHA: Texto y Botón */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8">

            {/* Títulos Desktop */}
            <motion.div 
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="space-y-2 hidden lg:block will-change-transform"
            >
               <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
                El plan para la provincia
              </span>
              <h2 className="text-5xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.99] text-center lg:text-left">
                Nuestras{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-liberty-primary to-liberty-primary-hover">
                  Propuestas
                </span>
              </h2>
            </motion.div>

            {/* Descripción */}
            <motion.p 
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-base md:text-lg text-liberty-text-secondary max-w-2xl will-change-transform"
            >
              Tenemos un plan integral diseñado para transformar cada rincón de la provincia de Santa Fe. Desde el norte productivo hasta el sur industrial, nuestras ideas nacen de escuchar a los santafesinos y aplicar los valores de la libertad para volver a ser el grande el país nuevamente.
            </motion.p>

            {/* Botón de Acción */}
            <motion.div 
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              className="pt-2 w-full sm:w-auto will-change-transform"
            >
              <CinematicLink
                to="/propuestas"
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 font-bold text-white  bg-liberty-card border border-liberty-border rounded-4xl hover:bg-liberty-border/40 hover:border-liberty-primary"
              >
                  Ver Todas las Propuestas
              </CinematicLink>
            </motion.div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}