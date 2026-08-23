import { motion } from "framer-motion";
import CinematicLink from "./CinematicLink";

// Asegurate de cambiar esto por la ruta de tu foto cinematográfica
import proponeBg from "../assets/mileirosario.webp";

export default function ProponePreview() {
  const hasAnimated = sessionStorage.getItem("propone_animated") === "true";

  const markAsAnimated = () => {
    if (!hasAnimated) {
      sessionStorage.setItem("propone_animated", "true");
    }
  };

  return (
    <section
      id="propone"
      // =========================================
      // SECCIÓN MODIFICADA: Quitamos border-t, agregamos la curva con clip-path
      // =========================================
      className="relative w-full min-h-[95vh] md:min-h-[99vh] flex items-center justify-center overflow-hidden transform-gpu translate-z-0 bg-black"
      // APLICAMOS LA CURVA AQUÍ
      style={{
        clipPath: "ellipse( 165% 100% at 50% 0%)",
      }}
    >
      {/* =========================================
          FONDO CINEMATOGRÁFICO
      ========================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden cinematografict ">
        <img
          src={proponeBg}
          alt="Ciudadanos construyendo el futuro"
          className="w-full h-full object-cover "
          loading="lazy"
          decoding="async"
          style={{
            animation: "slowZoom 5s ease-in-out infinite alternate",
            transformOrigin: "center center",
          }}
        />
      </div>
      {/* Overlays / Viñeta (Para legibilidad y dramatismo) */}
      <div className="absolute inset-0 z-0 bg-liberty-bg/20 mix-blend-multiply pointer-events-none" />

      {/* =========================================
          CONTENIDO CENTRAL
      ========================================= */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center text-center max-w-4xl mx-auto mt-16 md:mt-24">
        <motion.div
          onViewportEnter={markAsAnimated}
          initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          whileInView={hasAnimated ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="will-change-transform flex flex-col items-center"
        >
          {/* Subtítulo */}
          <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-liberty-primary uppercase block mb-6 ">
            Tu voz es el motor del cambio
          </span>

          {/* Título Principal */}
          <h2 className="text-5xl md:text-6xl lg:text-6x1 font-black uppercase tracking-tighter leading-[0.85] mb-8 text-white drop-shadow-2xl">
            Sumá tu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-liberty-primary to-liberty-primary-hover">
              Propuesta
            </span>
          </h2>

          {/* Descripción */}
          <p className="text-base md:text-lg text-liberty-text max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md font-medium px-4">
            Tanto si sos comerciante, estudiante, empresario, profesional de la
            salud o trabajador independiente. Queremos escucharte, porque tu
            realidad es la que verdaderamente importa para construir el futuro
            de nuestra provincia.
          </p>

          <CinematicLink
            to="/propone"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-liberty-card text-white font-bold uppercase text-xs tracking-[0.2em] rounded-3xl border border-liberty-border hover:border-liberty-primary  w-full sm:w-max "
          >
            Enviar mi propuesta
          </CinematicLink>
        </motion.div>
      </div>

      {/* =========================================
          ESTILOS DE ANIMACIÓN
      ========================================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
      `,
        }}
      />
    </section>
  );
}
