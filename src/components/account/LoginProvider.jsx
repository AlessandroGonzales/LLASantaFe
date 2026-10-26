import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/loginContext.js";
const LoginModal = lazy(() => import("./LoginModal.jsx"));

export default function LoginProvider({ children }) {
  const location = useLocation(), navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const openLogin = useCallback((options = {}) => setRequest({ ...options, key: location.key }), [location.key]);
  const closeLogin = useCallback((restoreRoute = true) => {
    setRequest(null);
    if (restoreRoute && location.pathname === "/ingresar") navigate("/", { replace: true });
  }, [location.pathname, navigate]);
  const value = useMemo(() => ({ openLogin, closeLogin }), [openLogin, closeLogin]);
  const visible = request?.key === location.key;
  return <LoginContext.Provider value={value}>{children}
    {visible && <Suspense fallback={null}><LoginModal options={request} onClose={closeLogin} /></Suspense>}
  </LoginContext.Provider>;
}
