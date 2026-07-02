import { createContext, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const navigate = useNavigate();

  const [transitionData, setTransitionData] = useState({
    active: false,
    to: null,
  });

  // Bloquea dobles clics y dobles ejecuciones
  const transitioning = useRef(false);

  const startTransition = (to) => {
    if (transitioning.current) return;

    transitioning.current = true;

    setTransitionData({
      active: true,
      to,
    });

    // Navegación
    setTimeout(() => {
      navigate(to);
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 450);

    // Finalizar transición
    setTimeout(() => {
      setTransitionData({
        active: false,
        to: null,
      });

      transitioning.current = false;
    }, 600);
  };

  return (
    <TransitionContext.Provider
      value={{
        transitionData,
        startTransition,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCinematicTransition = () => useContext(TransitionContext);