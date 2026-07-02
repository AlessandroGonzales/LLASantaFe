import { motion } from "framer-motion";
// 🚨 URGENTE: Asegúrate de tener el logo en formato SVG en tu carpeta assets
import logoLibertad from "../assets/logoLibertad.webp"; 
import backgroundImage from "../assets/mileidiezz.webp"; // Para mobile
import backgroundImageDos from "../assets/mileidiez.webp"; // Para Desktop
import { Link } from "react-router-dom";
import CinematicLink from "./CinematicLink";

// =========================================
// VARIANTS ULTRA-OPTIMIZADOS (Mobile & Desktop)
// =========================================

// Solo animamos transform (scale, y) y opacity. Cero filtros CSS en movimiento.
const eagleVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.2, 
    y: 120 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 1.4,
      ease: [0.34, 1.56, 0.64, 1] 
    }
  }
};

// Truco de rendimiento: El brillo es un div separado, mucho más fácil de procesar
const eagleGlowVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 0.5, 
    scale: 1,
    transition: { duration: 1.4, delay: 0.2, ease: "easeOut" }
  }
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.6, 
      staggerChildren: 0.25 
    }
  }
};

// Eliminamos el blur(). Usamos scale y translateY para un efecto de entrada potente.
const titleVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 1.2, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

// Eliminamos el letterSpacing dinámico. Mantenemos el espaciado fijo en CSS y animamos su entrada.
const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.5, 
      ease: "easeOut" 
    }
  }
};

const buttonsVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1, 
      delay: 1.4, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

export default function Hero() {
  return (
    <header className="relative min-h-[100vh] bg-hero-gradient flex flex-col justify-center items-center px-4 overflow-hidden border-b border-liberty-border">
      
      {/* =========================================
          FONDOS (Parallax y Fade In)
          ========================================= */}
      <motion.picture
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full z-0 will-change-transform transform-gpu translate-z-0"
      >
        <source media="(min-width: 768px)" srcSet={backgroundImageDos} />
        <img
          src={backgroundImage}
          alt="Fondo La Libertad Avanza Santa Fe"
          fetchPriority="high"
          className="w-full h-full object-cover object-top md:object-[center_1%]"
        />
      </motion.picture>

      {/* Efectos de iluminación sutiles en el fondo (Estáticos, sin animar) */}
      <div className="absolute inset-0 bg-gradient-to-b from-liberty-bg/10 via-transparent to-liberty-bg z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, delay: 0.2, ease: "easeOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-liberty-primary/10 rounded-full blur-[140px] pointer-events-none z-10 transform-gpu translate-z-0"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute bottom-10 left-1/4 w-80 h-80 bg-liberty-cyan/10 rounded-full blur-[120px] pointer-events-none z-10 transform-gpu translate-z-0"
      />

      {/* =========================================
          BLOQUE SUPERIOR: Logo y Textos
          ========================================= */}
      <div className="max-w-4xl mx-auto text-center relative z-20 space-y-4 md:space-y-8 -translate-y-48 md:-translate-y-48">
        
        {/* ÁGUILA + GLOW SEPARADO */}
        <div className="relative flex justify-center items-center">
          {/* Este div actúa como el brillo del águila. Es "gratis" para la GPU. */}
          <motion.div
            variants={eagleGlowVariants}
            initial="hidden"
            animate="visible"
            className="absolute w-40 h-40 bg-[rgba(212,175,55,0.8)] rounded-full blur-[40px] z-0 will-change-transform transform-gpu translate-z-0"
          />
          
          <motion.img
            variants={eagleVariants}
            initial="hidden"
            animate="visible"
            src={logoLibertad}
            alt="Águila La Libertad Avanza"
            fetchPriority="high"
            // Forzamos hardware acceleration en la imagen
            className="relative z-10 h-36 md:h-48 w-auto object-contain will-change-transform transform-gpu translate-z-0"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* TEXTOS */}
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2 md:space-y-4 relative z-20"
        >
          <motion.h1
            variants={titleVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-200 drop-shadow-2xl will-change-transform transform-gpu translate-z-0"
          >
            La Libertad Avanza
          </motion.h1>

          <motion.p
            variants={subtitleVariants}
            className="text-lg md:text-2xl font-bold text-liberty-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] uppercase tracking-[0.2em] will-change-transform transform-gpu translate-z-0"
          >
            Santa Fe
          </motion.p>
        </motion.div>
      </div>

      {/* =========================================
          BLOQUE INFERIOR: Botones
          ========================================= */}
      <motion.div 
        variants={buttonsVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-40 md:bottom-42 z-20 w-full px-4 transform-gpu translate-z-0"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
         <Link
            to="/#preview"
            className="w-full sm:w-auto px-10 py-4 rounded-4xl font-bold bg-liberty-card border border-liberty-border text-liberty-text transition-all duration-300 hover:bg-liberty-border/40 hover:text-liberty-cyan cursor-pointer text-center"
          >
            Conocer Propuestas
          </Link>
          <CinematicLink
            to="/sumate"
            className="w-full sm:w-auto px-10 py-4 rounded-4xl font-bold bg-[#C026D3] border border-[#C026D3] text-white hover:bg-[#A21CAF] transition-all duration-300 cursor-pointer text-center"
          >
            Súmate al partido
          </CinematicLink>
        </div>
      </motion.div>
    </header>
  );
}