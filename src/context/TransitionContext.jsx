import {
  createContext,
  useContext,
  useState,
  useRef,
  startTransition as reactStartTransition, // 1. Importamos la API concurrente de React
} from "react";
import { useNavigate } from "react-router-dom";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const navigate = useNavigate();

  const [transitionData, setTransitionData] = useState({
    active: false,
    to: null,
  });

  const transitioning = useRef(false);

  // Le cambiamos el nombre internamente para no chocar con el de React
  const triggerCinematicTransition = (to) => {
    if (transitioning.current) return;
    transitioning.current = true;

    setTransitionData({ active: true, to });

    // 2. Esperamos a que el águila escale y la pantalla esté en negro (800ms)
    setTimeout(() => {
      // 3. reactStartTransition renderiza la nueva página "en segundo plano" sin tirar los FPS
      reactStartTransition(() => {
        navigate(to);
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      });
    }, 800);

    // 4. Finalizamos la transición a los 1500ms (dándole tiempo a los 1300ms del águila a terminar)
    setTimeout(() => {
      setTransitionData({
        active: false,
        to: null,
      });

      transitioning.current = false;
    }, 1500); 
  };

  return (
    <TransitionContext.Provider
      value={{
        transitionData,
        startTransition: triggerCinematicTransition, // Mantenemos el nombre expuesto igual
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCinematicTransition = () => useContext(TransitionContext);