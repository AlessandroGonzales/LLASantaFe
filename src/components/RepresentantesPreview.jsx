import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import rep1 from "../assets/lautaro.webp";
import rep2 from "../assets/giselle.jpeg";
import rep3 from "../assets/maria.jpeg";
import rep4 from "../assets/david.png";
import rep5 from "../assets/marisel.jpg"

export default function RepresentantesPreview() {
  const hasAnimated =
    sessionStorage.getItem("representantes_animated") === "true";

  const markAsAnimated = () => {
    if (!hasAnimated) {
      sessionStorage.setItem("representantes_animated", "true");
    }
  };

  // Variantes de animación para el Bento Grid
  const bentoItem = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      id="representantes"
      className="relative w-full py-24 md:py-32 bg-liberty-bg text-liberty-text overflow-hidden border-t border-liberty-border font-satoshi"
    >
      {/* Fondo con patrón sutil futurista y luces Cyan */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-liberty-cyan/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-liberty-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-10">
        <motion.div
          onViewportEnter={markAsAnimated}
          initial={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center"
        >
          {/* Título solo visible en Mobile - arriba de las imágenes */}
          <motion.div
            className="lg:hidden text-center"
            initial={
              hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            whileInView={hasAnimated ? false : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-bold tracking-[0.3em] text-liberty-cyan uppercase block mb-4">
              El equipo en el territorio
            </span>

            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Nuestros{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-primary">
                Concejales
              </span>
            </h2>
          </motion.div>

          {/* =========================================
              COLUMNA IZQUIERDA: Bento Grid Collage (4 Imágenes)
          ========================================= */}
          <div className="lg:col-span-7 relative w-full h-[600px] sm:h-[700px] lg:h-[750px] order-1 lg:order-1">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-12 md:grid-rows-12 gap-3 md:gap-4 w-full h-full"
              initial={hasAnimated ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {/* Imagen 1: Cuadrado superior izquierda (Desktop) / Izquierda (Mobile) */}
              <motion.div variants={bentoItem} className="col-span-1 md:col-span-6 md:row-span-6 relative rounded-2xl overflow-hidden border border-liberty-border/50 bg-liberty-card">
                <img src={rep3} alt="Representante 1" className="w-full h-full object-cover" />
              </motion.div>

              {/* Imagen 2: Rectángulo superior derecha (Desktop) / Derecha (Mobile) */}
              <motion.div variants={bentoItem} className="col-span-1 md:col-span-6 md:row-span-6 relative rounded-2xl overflow-hidden border border-liberty-border/50 bg-liberty-card">
                <img src={rep2} alt="Representante 2" className="w-full h-full object-cover" />
              </motion.div>

              {/* Imagen 3: Rectángulo horizontal central (Mobile) / Rectángulo vertical izquierdo inferior (Desktop) */}
              <motion.div variants={bentoItem} className="col-span-2 md:col-span-6 md:row-span-6 relative rounded-2xl overflow-hidden border border-liberty-border/50 bg-liberty-card">
                <img src={rep1} alt="Representante 3" className="w-full h-full object-cover" />
              </motion.div>

              {/* Imagen 4: Inferior izquierda (Mobile) / Inferior derecha 1 (Desktop) */}
              <motion.div variants={bentoItem} className="col-span-1 md:col-span-3 md:row-span-6 relative rounded-2xl overflow-hidden border border-liberty-border/50 bg-liberty-card">
                <img src={rep4} alt="Representante 4" className="w-full h-full object-cover" />
              </motion.div>

              {/* Imagen 5: Inferior derecha (Mobile) / Inferior derecha 2 (Desktop) */}
              <motion.div variants={bentoItem} className="col-span-1 md:col-span-3 md:row-span-6 relative rounded-2xl overflow-hidden border border-liberty-border/50 bg-liberty-card">
                <img src={rep5} alt="Representante 5" className="w-full h-full object-cover" />
              </motion.div>
            </motion.div>
          </div>

          {/* =========================================
              COLUMNA DERECHA: Textos + Botón
          ========================================= */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left z-10 order-2 lg:order-2">
            <motion.div
              initial={
                hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              whileInView={hasAnimated ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <span className="text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-4">
                El equipo en el territorio
              </span>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Nuestros <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-liberty-primary to-liberty-primary-hover">
                  Concejales
                </span>
              </h2>

              <p className="text-base md:text-lg text-liberty-text-secondary max-w-lg mx-auto lg:mx-0 mb-10">
                Ellos son la primera línea de defensa. Conoce a los
                representantes que están dando la batalla cultural y política en
                los concejos deliberantes de toda la provincia.
              </p>
            </motion.div>

            {/* Texto completo visible en mobile (sin título duplicado) */}
            <motion.div
              initial={
                hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              whileInView={hasAnimated ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:hidden"
            >
              <p className="text-base md:text-lg text-liberty-text-secondary max-w-lg mx-auto mb-10">
                Ellos son la primera línea de defensa. Conoce a los
                representantes que están dando la batalla cultural y política en
                los concejos deliberantes de toda la provincia.
              </p>
            </motion.div>

            <motion.div
              initial={
                hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              whileInView={hasAnimated ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 lg:mt-0"
            >
              <Link
                to="/representantes"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-liberty-card text-white font-bold uppercase text-xs tracking-[0.2em] transition-all duration-300 rounded-3xl border border-liberty-border hover:border-liberty-cyan hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] w-full sm:w-max overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative z-10 flex items-center gap-2">
                  Conocer al equipo
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `,
        }}
      />
    </section>
  );
}