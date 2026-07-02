import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCinematicTransition } from "../context/TransitionContext";
import logoLibertad from "../assets/logoLibertad.webp";

// =========================================
// VARIANTS ULTRA-OPTIMIZADOS (Mobile & Desktop)
// =========================================

const backgroundVariants = {
  hidden: { opacity: 0 },
  // Eliminamos el backdrop-blur, usamos un color negro sólido
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.5, delay: 0.2 } },
};

const eagleFlyVariants = {
  hidden: {
    scale: 0.1,
    opacity: 0,
  },
  flying: {
    // Reducimos la escala máxima a 12 (suficiente para cubrir la pantalla sin lag)
    scale: [0.1, 1.5, 12], 
    opacity: [0, 1, 1, 0], 
    transition: {
      duration: 1.1,
      times: [0, 0.5, 1],
      ease: "easeIn",
    },
  },
};

// Separamos el glow (brillo dorado) de la imagen principal.
// Animar un div con box-shadow es un 90% más rápido que un drop-shadow en una imagen PNG.
const cheapGlowVariants = {
  hidden: { opacity: 0, scale: 0.1 },
  flying: {
    opacity: [0, 0.8, 0],
    scale: [0.1, 1.5, 8],
    transition: {
      duration: 1.1,
      times: [0, 0.5, 1],
      ease: "easeIn",
    }
  }
};

const impactFlashVariants = {
  hidden: { opacity: 0 },
  flash: {
    opacity: [0, 1, 0],
    transition: {
      duration: 0.4,
      times: [0, 0.5, 1],
      delay: 0.8, 
      ease: "easeInOut",
    },
  },
};

export default function GlobalTransition() {
  const { transitionData, endTransition } = useCinematicTransition();
  const navigate = useNavigate();

  useEffect(() => {
    if (transitionData.active && transitionData.to) {
      const navTimer = setTimeout(() => {
        navigate(transitionData.to);
        window.scrollTo(0, 0); 
      }, 850);

      const endTimer = setTimeout(() => {
        endTransition();
      }, 1200);

      return () => {
        clearTimeout(navTimer);
        clearTimeout(endTimer);
      };
    }
  }, [transitionData, navigate, endTransition]);

  return (
    <AnimatePresence>
      {transitionData.active && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
          {/* 1. Fondo Oscuro Puro */}
          <motion.div
            className="absolute inset-0 bg-black"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          {/* 2. Flash de Impacto Optimizado (Sin mix-blend) */}
          <motion.div
            className="absolute inset-0 bg-white z-20 pointer-events-none"
            variants={impactFlashVariants}
            initial="hidden"
            animate="flash"
          />

          {/* 3. El Glow Dorado (Truco de Performance) */}
          <motion.div 
            className="absolute z-25 w-32 h-32 rounded-full bg-yellow-500 blur-[40px] will-change-transform"
            variants={cheapGlowVariants}
            initial="hidden"
            animate="flying"
          />

          {/* 4. El Águila sin filtros CSS pesados */}
          <motion.img
            src={logoLibertad}
            alt="Transición"
            // Agregamos translate-z-0 para forzar la aceleración por hardware en iOS
            className="relative z-30 w-48 h-auto object-contain will-change-transform transform-gpu translate-z-0"
            variants={eagleFlyVariants}
            initial="hidden"
            animate="flying"
          />
        </div>
      )}
    </AnimatePresence>
  );
}