import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { RegistrationContext } from "../../context/registrationContext.js";
const WelcomeCard = lazy(() => import("./WelcomeCard.jsx"));
export default function RegistrationProvider({ children }) {
  const location = useLocation(), [welcome, setWelcome] = useState(null), photo = useRef(null);
  const release = useCallback(() => { if (photo.current) URL.revokeObjectURL(photo.current); photo.current = null; }, []);
  const close = useCallback(() => { release(); setWelcome(null); }, [release]);
  const show = useCallback(({ nombre, foto }) => {
    release(); photo.current = foto ? URL.createObjectURL(foto) : null;
    setWelcome({ nombre, photo: photo.current });
  }, [release]);
  useEffect(() => () => release(), [release]);
  useEffect(() => { window.addEventListener("popstate", close); return () => window.removeEventListener("popstate", close); }, [close]);
  const value = useMemo(() => ({ showWelcome: show }), [show]);
  return <RegistrationContext.Provider value={value}>{children}
    {welcome && location.pathname === "/" && <Suspense fallback={null}><WelcomeCard data={welcome} onClose={close} /></Suspense>}
  </RegistrationContext.Provider>;
}
