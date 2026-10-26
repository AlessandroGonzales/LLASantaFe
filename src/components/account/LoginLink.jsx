import { useLogin } from "../../context/loginContext.js";
export default function LoginLink({ state, children, onClick, ...props }) {
  const { openLogin } = useLogin();
  return <button {...props} type="button" onClick={event => { onClick?.(event); if (!event.defaultPrevented) openLogin(state); }}>{children}</button>;
}
