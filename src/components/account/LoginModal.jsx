import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import { account } from "../../lib/backend.js";
import { accountReturn } from "../../lib/affiliationFormat.js";
import { useAccountAction } from "../../hooks/useAccountAction.js";
import { Feedback } from "./AccountForm.jsx";
import logo from "../../assets/aguila.webp";
import "./LoginModal.css";

export default function LoginModal({ options, onClose }) {
  const dialog = useRef(null), emailInput = useRef(null), action = useAccountAction();
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [visible, setVisible] = useState(false);
  const navigate = useNavigate(), location = useLocation();
  useEffect(() => {
    const element = dialog.current, previous = document.activeElement, overflow = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = "hidden"; emailInput.current?.focus();
    return () => { element.close(); document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); };
  }, []);
  const destination = options.returnTo ? accountReturn(options.returnTo) : null;
  return <dialog ref={dialog} className="login-dialog" aria-labelledby="login-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="login-card">
      <button type="button" className="login-close" aria-label="Cerrar inicio de sesión" onClick={() => onClose()}><X size={21} aria-hidden="true" /></button>
      <div className="login-brand"><img src={logo} alt="La Libertad Avanza Santa Fe" width={86} height={86} /></div>
      <div className="login-content"><h1 id="login-title">Iniciá sesión</h1><p className="login-intro">Tu cuenta. Tu espacio para participar.</p>
        {options.notice && <p className="login-notice" role="status">{options.notice}</p>}
        {!account.api.configured && <p role="status" className="login-notice">El servicio de cuentas todavía no está disponible en este entorno.</p>}
        <Feedback error={action.error} />
        <form aria-busy={action.pending} onSubmit={event => {
          event.preventDefault(); action.run(async signal => {
            await account.login({ email: email.trim(), password }, signal); setPassword(""); onClose(false);
            if (destination && destination !== `${location.pathname}${location.hash}`) navigate(destination, { replace: location.pathname === "/ingresar" });
          });
        }}>
          <fieldset disabled={action.busy} className="login-fields"><legend className="login-sr-only">Credenciales de acceso</legend>
            <label className="login-field" htmlFor="login-email"><span>Correo electrónico</span><input ref={emailInput} id="login-email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} /></label>
            <div className="login-field login-password"><label htmlFor="login-password">Contraseña</label><input id="login-password" type={visible ? "text" : "password"} autoComplete="current-password" required maxLength={72} value={password} onChange={event => setPassword(event.target.value)} /><button type="button" className="login-reveal" aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={visible} onClick={() => setVisible(value => !value)}>{visible ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button></div>
            <button className="login-submit" type="submit" disabled={action.busy || !account.api.configured}>{action.pending ? "Ingresando…" : "Iniciar sesión"}</button>
          </fieldset>
        </form>
        {action.error?.code === "email_not_verified" && <Link className="login-verify" to="/verificar-email" onClick={() => onClose(false)}>Verificar mi correo</Link>}
        <Link className="login-recovery" to="/recuperar-cuenta" onClick={() => onClose(false)}>¿Olvidaste tu contraseña?</Link>
        <p className="login-register">¿Todavía no tenés cuenta? <Link to="/registro" state={destination ? { returnTo: destination } : undefined} onClick={() => onClose(false)}>Registrate</Link></p>
      </div>
    </div>
  </dialog>;
}
