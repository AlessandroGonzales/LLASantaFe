import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCinematicTransition } from "../context/TransitionContext";
import logoLibertad from "../assets/logoLibertad.png"; // Asegúrate de ajustar la ruta

// =========================================
// VARIANTS DE ANIMACIÓN
// =========================================

// El fondo oscurece ligeramente la pantalla actual
const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.5, delay: 0.2 } },
};

// El Águila: Nace pequeña, se vuelve masiva y vuela hacia la cámara
const eagleFlyVariants = {
  hidden: {
    scale: 0.1,
    opacity: 0,
    filter: "drop-shadow(0px 0px 0px rgba(212,175,55,0))",
  },
  flying: {
    // Escala brutal de 0.1 a 25 para que "traspase" la pantalla
    scale: [0.1, 1.5, 25], 
    opacity: [0, 1, 1, 0], 
    filter: [
      "drop-shadow(0px 0px 0px rgba(212,175,55,0))",
      "drop-shadow(0px 0px 40px rgba(212,175,55,0.8))",
      "drop-shadow(0px 0px 150px rgba(212,175,55,1))",
    ],
    transition: {
      duration: 1.1, // 1100ms
      times: [0, 0.5, 1], // Control exacto de los keyframes
      ease: "easeIn", // Aceleración (empieza lento, termina rapidísimo)
    },
  },
};

// El impacto ("PUM"): Flash blanco/dorado en el clímax
const impactFlashVariants = {
  hidden: { opacity: 0 },
  flash: {
    opacity: [0, 1, 0],
    transition: {
      duration: 0.4,
      times: [0, 0.5, 1],
      delay: 0.8, // Explota justo a los 800ms (cuando el águila está enorme)
      ease: "easeInOut",
    },
  },
};

export default function GlobalTransition() {
  const { transitionData, endTransition } = useCinematicTransition();
  const navigate = useNavigate();

  useEffect(() => {
    if (transitionData.active && transitionData.to) {
      // 1. Sincronizamos la navegación con el "PUM" (Flash) a los 850ms
      const navTimer = setTimeout(() => {
        navigate(transitionData.to);
        // Desplazamos al inicio de la página nueva
        window.scrollTo(0, 0); 
      }, 850);

      // 2. Terminamos toda la secuencia a los 1200ms
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
          {/* Fondo oscuro con Blur */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          {/* Flash Cinematográfico */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-white via-yellow-100 to-white mix-blend-overlay z-20 pointer-events-none"
            variants={impactFlashVariants}
            initial="hidden"
            animate="flash"
          />

          {/* El Águila */}
          <motion.img
            src={logoLibertad}
            alt="Transición"
            className="relative z-30 w-48 h-auto object-contain will-change-transform"
            variants={eagleFlyVariants}
            initial="hidden"
            animate="flying"
          />
        </div>
      )}
    </AnimatePresence>
  );
}