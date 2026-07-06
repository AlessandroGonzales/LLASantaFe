import { AnimatePresence, motion } from "framer-motion";
import { useCinematicTransition } from "../context/TransitionContext";
import logoLibertad from "../assets/logoLibertad.webp";
import { memo } from "react";

const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      delay: 0.2,
    },
  },
};

const eagleFlyVariants = {
  hidden: {
    scale: 0.1,
    opacity: 0,
  },
  flying: {
    // 1. Arrays de la misma longitud (4 valores cada uno)
    scale: [0.1, 1.5, 8, 12], 
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 1.3,
      ease: "easeIn",
      times: [0, 0.4, 0.8, 1], 
    },
  },
};

// 2. React.memo para evitar re-renderizados innecesarios
const GlobalTransition = memo(function GlobalTransition() {
  const { transitionData } = useCinematicTransition();

  return (
    <AnimatePresence>
      {transitionData.active && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          
          <motion.div
            className="absolute inset-0 bg-black pointer-events-auto"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // 3. Hint para la GPU
            style={{ willChange: "opacity" }} 
          />

          <motion.img
            src={logoLibertad}
            alt="Transición"
            className="relative z-30 w-48 h-auto object-contain"
            variants={eagleFlyVariants}
            initial="hidden"
            animate="flying"
            // 4. Forzar aceleración por hardware en la imagen
            style={{ 
                willChange: "transform, opacity",
                WebkitUserSelect: "none" 
            }}
          />

        </div>
      )}
    </AnimatePresence>
  );
});

export default GlobalTransition;