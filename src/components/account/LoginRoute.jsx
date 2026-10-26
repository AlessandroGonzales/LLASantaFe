import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLogin } from "../../context/loginContext.js";
import { useAccount } from "../../hooks/useAccount.js";
import { accountReturn } from "../../lib/affiliationFormat.js";
export default function LoginRoute({ children }) {
  const state = useAccount(), location = useLocation(), { openLogin } = useLogin();
  useEffect(() => {
    if (!state.authenticated) openLogin({ returnTo: accountReturn(location.state?.returnTo), notice: location.state?.notice });
  }, [state.authenticated, location.state, openLogin]);
  if (state.authenticated) return <Navigate to={accountReturn(location.state?.returnTo)} replace />;
  return children;
}
