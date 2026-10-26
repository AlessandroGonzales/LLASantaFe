import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ClipboardList, Files, LogIn, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useAccount } from "../../hooks/useAccount.js";
import { isAdministrator } from "../../lib/affiliationService.js";
import Avatar from "./Avatar.jsx";
import LoginLink from "./LoginLink.jsx";
import "./AccountMenu.css";
import "./ProfilePhoto.css";

const entries = [
  ["/sumate#sumate-formulario", "Mi afiliación", BadgeCheck],
  ["/propone#mis-solicitudes", "Mis solicitudes", Files],
  ["/mi-cuenta", "Mis datos", UserRound],
  ["/mi-cuenta/encuestas", "Respuestas de encuestas", ClipboardList],
];
export default function AccountMenu({ onOpen, onLogout, logoutBusy = false }) {
  const state = useAccount(), [open, setOpen] = useState(false), root = useRef(null), button = useRef(null), focusFirst = useRef(false);
  useEffect(() => {
    if (!open) return;
    if (focusFirst.current) { root.current?.querySelector("a")?.focus(); focusFirst.current = false; }
    function outside(event) { if (!root.current?.contains(event.target)) setOpen(false); }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  if (!state.authenticated) return <LoginLink className="nav-login" onClick={onOpen} disabled={logoutBusy} aria-label="Iniciar sesión"><LogIn size={18} aria-hidden="true" /><span>Ingresar</span></LoginLink>;
  return <div ref={root} className="nav-account" onPointerEnter={event => { if (event.pointerType === "mouse") { onOpen?.(); setOpen(true); } }} onPointerLeave={event => { if (event.pointerType === "mouse") setOpen(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); setOpen(false); button.current?.focus(); } }}>
    <button ref={button} type="button" className="nav-avatar-button" aria-label="Abrir opciones de mi perfil" aria-expanded={open} aria-controls="account-navigation" disabled={logoutBusy} onClick={event => { onOpen?.(); setOpen(value => event.detail === 0 || event.nativeEvent.pointerType === "touch" ? !value : true); }} onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); focusFirst.current = true; onOpen?.(); if (open) root.current?.querySelector("a")?.focus(); else setOpen(true); } }}><Avatar /></button>
    {open && <div className="nav-account-panel" id="account-navigation"><nav aria-label="Opciones de mi perfil"><div className="nav-account-heading"><span>{state.profile?.nombre || "Tu cuenta"}</span><small>Tu espacio de participación</small></div>
      {entries.map(([to, label, Icon]) => <Link key={to} to={to} onClick={() => setOpen(false)}><Icon size={17} strokeWidth={1.5} aria-hidden="true" />{label}</Link>)}
      {isAdministrator(state.profile) && <Link to="/administracion/afiliaciones" className="nav-account-admin" onClick={() => setOpen(false)}><ShieldCheck size={17} strokeWidth={1.5} aria-hidden="true" />Administrar afiliaciones</Link>}
      <button type="button" className="nav-account-logout" disabled={logoutBusy} onClick={onLogout} title="Cerrar sesión en todos tus dispositivos"><LogOut size={17} strokeWidth={1.5} aria-hidden="true" />{logoutBusy ? "Cerrando sesión…" : "Cerrar sesión"}</button>
    </nav></div>}
  </div>;
}
