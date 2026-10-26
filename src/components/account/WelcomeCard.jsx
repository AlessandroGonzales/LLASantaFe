import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Mail, X } from "lucide-react";
import logo from "../../assets/aguila.webp";
import "./WelcomeCard.css";
export default function WelcomeCard({ data, onClose }) {
  const dialog = useRef(null), explore = useRef(null);
  useEffect(() => {
    const element = dialog.current, previous = document.activeElement, overflow = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = "hidden"; explore.current?.focus({ preventScroll: true });
    return () => { element.close(); document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} className="welcome-dialog" aria-labelledby="welcome-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="welcome-card"><button type="button" className="welcome-close" aria-label="Cerrar bienvenida" onClick={onClose}><X size={21} aria-hidden="true" /></button>
      <div className="welcome-top"><span><Check size={13} aria-hidden="true" />06 / 06 · Bienvenida</span><img src={logo} width={76} height={76} alt="La Libertad Avanza Santa Fe" /></div>
      <div className="welcome-person">{data.photo ? <img src={data.photo} alt="Tu foto de perfil" width={86} height={86} /> : <span aria-hidden="true">{data.nombre.charAt(0).toUpperCase()}</span>}</div>
      <h1 id="welcome-title">Bienvenido,<br /><span>{data.nombre}.</span></h1>
      <p className="welcome-statement">Vamos a dar la batalla cultural.<br />Hagamos una Argentina grande nuevamente.</p>
      <p className="welcome-description">Gracias por sumarte a este espacio. Tu participación puede convertirse en ideas, propuestas y nuevas oportunidades para Santa Fe.</p>
      <div className="welcome-verification"><Mail size={21} strokeWidth={1.5} aria-hidden="true" /><p><strong>Tu próximo paso está en tu correo.</strong>Revisá el enlace de verificación para activar el acceso. Si ya tenías una cuenta, podés ingresar con tus credenciales habituales.</p></div>
      <button ref={explore} type="button" className="welcome-primary" onClick={onClose}>Explorar el sitio<ArrowUpRight size={18} aria-hidden="true" /></button><Link className="welcome-help" to="/verificar-email" onClick={onClose}>Necesito ayuda para verificar mi correo</Link>
      <div className="welcome-signature">La Libertad Avanza<span>Santa Fe · Argentina</span></div>
    </div>
  </dialog>;
}
