import { AnimatePresence, motion } from "framer-motion";
import { useCinematicTransition } from "../context/TransitionContext";
import logoLibertad from "../assets/logoLibertad.webp";

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
    scale: [0.1, 1.5, 12],
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 1.3,
      ease: "easeIn",
      times: [0, 0.5, 1],
    },
  },
};

export default function GlobalTransition() {
  const { transitionData } = useCinematicTransition();

  return (
    <AnimatePresence>
      {transitionData.active && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          <motion.div
            className="absolute inset-0 bg-black"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          <motion.img
            src={logoLibertad}
            alt="Transición"
            className="relative z-30 w-48 h-auto object-contain"
            variants={eagleFlyVariants}
            initial="hidden"
            animate="flying"
          />

        </div>
      )}
    </AnimatePresence>
  );
}