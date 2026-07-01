import { createContext, useContext, useState } from "react";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [transitionData, setTransitionData] = useState({
    active: false,
    to: null,
  });

  const startTransition = (to) => {
    // Evita doble click si ya está transicionando
    if (transitionData.active) return;
    setTransitionData({ active: true, to });
  };

  const endTransition = () => {
    setTransitionData({ active: false, to: null });
  };

  return (
    <TransitionContext.Provider
      value={{ transitionData, startTransition, endTransition }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCinematicTransition = () => useContext(TransitionContext);