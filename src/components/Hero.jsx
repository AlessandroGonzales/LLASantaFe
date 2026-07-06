import { motion } from "framer-motion";
import logoLibertad from "../assets/logoLibertad.webp";
import backgroundImage from "../assets/mileidiezz.webp";
import backgroundImageDos from "../assets/mileidiez.webp";
import { Link } from "react-router-dom";
import CinematicLink from "./CinematicLink";

// =========================================
// VARIANTS
// =========================================
const eagleVariants = {
  hidden: { opacity: 0, scale: 0.2, y: 120 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 1.6, ease: [0.34, 1.56, 0.64, 1] }
  }
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.6, staggerChildren: 0.25 }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.7, ease: "easeOut" }
  }
};

const buttonsVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Hero() {
  // === Lógica para animar solo una vez ===
  const hasAnimated = sessionStorage.getItem("hero_animated") === "true";

  const markAsAnimated = () => {
    if (!hasAnimated) {
      sessionStorage.setItem("hero_animated", "true");
    }
  };

  return (
    <header className="relative min-h-[100vh] bg-hero-gradient flex flex-col justify-center items-center px-4 border-b border-liberty-border overflow-hidden">
      
      {/* FONDOS */}
      <motion.picture
        initial={hasAnimated ? { opacity: 0.85, scale: 1 } : { opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 2.8, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full z-0"
        onViewportEnter={markAsAnimated}
      >
        <source media="(min-width: 768px)" srcSet={backgroundImageDos} />
        <img
          src={backgroundImage}
          alt="Fondo La Libertad Avanza Santa Fe"
          fetchPriority="high"
          className="w-full h-full object-cover object-top md:object-[center_1%]"
        />
      </motion.picture>

      <div className="absolute inset-0 bg-gradient-to-b from-liberty-bg/10 via-transparent to-liberty-bg z-0 pointer-events-none" />

      {/* CONTENIDO PRINCIPAL - Sin translate negativo grande */}
      <div className="max-w-4xl mx-auto text-center relative z-20 pt-20 md:pt-12 pb-32">
        
        {/* ÁGUILA */}
        <div className="relative flex justify-center items-center mb-6">
          <motion.img
            variants={eagleVariants}
            initial={hasAnimated ? "visible" : "hidden"}
            animate="visible"
            src={logoLibertad}
            alt="Águila La Libertad Avanza"
            fetchPriority="high"
            className="relative z-10 h-36 md:h-48 w-auto object-contain"
          />
        </div>

        {/* TEXTOS */}
        <motion.div
          variants={textContainerVariants}
          initial={hasAnimated ? "visible" : "hidden"}
          animate="visible"
          className="space-y-2 md:space-y-4"
        >
          <motion.h1
            variants={titleVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none uppercase text-white"
          >
            La Libertad Avanza
          </motion.h1>

          <motion.p
            variants={subtitleVariants}
            className="text-lg md:text-2xl font-bold text-liberty-primary uppercase tracking-[0.2em]"
          >
            Santa Fe
          </motion.p>
        </motion.div>
      </div>

      {/* BOTONES - Ahora relativos, no absolutos */}
      <motion.div 
        variants={buttonsVariants}
        initial={hasAnimated ? "visible" : "hidden"}
        animate="visible"
        className="relative z-20 w-full px-4 pb-42 mt-auto"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          <Link
            to="/#preview"
            className="w-full sm:w-auto px-10 py-4 rounded-4xl font-bold bg-liberty-card border border-liberty-border text-liberty-text hover:bg-liberty-border/40 hover:text-liberty-cyan cursor-pointer text-center"
          >
            Conocer Propuestas
          </Link>
          <CinematicLink
            to="/sumate"
            className="w-full sm:w-auto px-10 py-4 rounded-4xl font-bold bg-[#C026D3] border border-[#C026D3] text-white hover:bg-[#A21CAF] cursor-pointer text-center"
          >
            Súmate Al Partido
          </CinematicLink>
        </div>
      </motion.div>
    </header>
  );
}