import { AnimatePresence, m } from "framer-motion";
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
      delay: 0.2, // Mantiene el fondo oscuro un momento para que el logo termine
    },
  },
};

const eagleFlyVariants = {
  hidden: {
    scale: 0.1,
    opacity: 0,
  },
  flying: {
    scale: [0.1, 1.5, 8, 12],
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 1.3,
      ease: "easeIn",
      times: [0, 0.4, 0.8, 1],
    },
  },
};

const GlobalTransition = memo(function GlobalTransition() {
  const { transitionData } = useCinematicTransition();

  return (
    <AnimatePresence>
      {transitionData.active && (
        <m.div
          key="global-transition" // Clave única obligatoria para AnimatePresence
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-liberty-bg pointer-events-auto"
          variants={backgroundVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <m.img
            src={logoLibertad}
            alt="Transición"
            // Reemplazamos WebkitUserSelect por las clases de Tailwind y props nativas
            className="relative z-30 w-48 h-auto object-contain select-none"
            variants={eagleFlyVariants}
            initial="hidden"
            animate="flying"
            // Optimizaciones nativas para imágenes críticas de transición
            decoding="sync"
            fetchpriority="high"
            draggable={false}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
});

export default GlobalTransition;