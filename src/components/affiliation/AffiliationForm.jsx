import LoginLink from "../account/LoginLink.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from "lucide-react";
import { account, affiliation } from "../../lib/backend.js";
import { useAccount } from "../../hooks/useAccount.js";
import { useAffiliation } from "../../hooks/useAffiliation.js";
import { useAccountAction } from "../../hooks/useAccountAction.js";
import { Feedback } from "../account/AccountForm.jsx";
import LocationFields from "../account/LocationFields.jsx";
import RetryButton from "../account/RetryButton.jsx";
import { affiliationDate, affiliationLabels, affiliationReturn } from "../../lib/affiliationFormat.js";
import styles from "../Sumate.module.css";
import "./Affiliation.css";

function Application({ profile }) {
  const state = useAffiliation(), action = useAccountAction();
  const [dni, setDni] = useState(""), [phone, setPhone] = useState(profile.telefono || "");
  const [city, setCity] = useState(profile.ciudadId || ""), [fiscal, setFiscal] = useState(false), [confirm, setConfirm] = useState(false);
  useEffect(() => { affiliation.loadOwn().catch(() => {}); }, []);
  if (state.request) {
    const item = state.request;
    return <div className={`affiliation-form ${styles.success}`}>
      <CheckCircle2 size={42} strokeWidth={1.3} aria-hidden="true" />

      <h3>{item.estado === "aprobada" ? "Solicitud aprobada." : item.estado === "rechazada" ? "Solicitud resuelta." : "Ya dimos el primer paso."}</h3>
      <span className={`af-badge af-badge-${item.estado}`}>{affiliationLabels[item.estado]}</span>
      <ol className="af-progress" aria-label="Estado del trámite">
        <li><span>01</span><div><strong>Solicitud recibida</strong><p>{affiliationDate(item.fechaSolicitud)}</p></div></li>
        <li><span>02</span><div><strong>Revisión del equipo</strong><p>{item.estado === "pendiente" ? "Tu solicitud está esperando revisión." : item.estado === "en_revision" ? "El equipo está revisando tu solicitud." : "La revisión tiene una resolución registrada."}</p></div></li>
        <li><span>03</span><div><strong>{item.estado === "aprobada" ? "Aprobación registrada" : item.estado === "rechazada" ? "Solicitud rechazada" : "Próximo contacto"}</strong>
          <p>{item.aprobadaAt || item.rechazadaAt ? affiliationDate(item.aprobadaAt || item.rechazadaAt) : "El equipo se pondrá en contacto con vos."}</p></div></li>
      </ol>
      {item.motivoRechazo && <div className="af-public-reason"><strong>Motivo informado</strong><p>{item.motivoRechazo}</p></div>}
      {item.estado === "aprobada" && <p>La aprobación está registrada en la aplicación. El equipo te indicará los pasos formales del trámite.</p>}
      <p className="af-reference">Solicitud <span>{item.id}</span></p>
      <div className="af-feedback"><Feedback error={state.error || action.error} /></div>
      <div className="af-inline-actions"><RetryButton error={state.error || action.error} busy={action.busy || state.status === "loading"} onClick={() => action.run(() => affiliation.loadOwn({ force: true }))}>Actualizar estado</RetryButton><Link to="/mi-cuenta">Ver mi cuenta <ArrowRight size={15} aria-hidden="true" /></Link></div>
    </div>;
  }
  const blocked = action.busy || state.status !== "ready";
  return <form className="affiliation-form" aria-labelledby="sumate-form-title" aria-busy={blocked} onSubmit={event => {
    event.preventDefault(); action.run(signal => affiliation.submit({ dni, telefono: phone, ciudadId: city, quiereFiscalizar: fiscal, confirmacion: confirm }, signal));
  }}>
    <div className={styles.formHeading}><p>Tu cuenta, un paso menos.</p><span className={styles.fieldHelp}>Completamos tus datos disponibles. Solo falta revisar y confirmar.</span></div>
    <div className="af-feedback"><Feedback error={state.error || action.error} /></div>
    {state.status === "loading" && <p role="status" className={styles.fieldHelp}>Consultando tu solicitud…</p>}
    {state.status === "error" && <RetryButton error={state.error || action.error} className="af-retry" busy={action.busy} onClick={() => action.run(() => affiliation.loadOwn({ force: true }))}>Volver a consultar</RetryButton>}
    <fieldset className={styles.fields} disabled={blocked}>
      <legend className={styles.srOnly}>Datos de tu solicitud</legend>
      <div className={styles.field}><label htmlFor="affiliation-name">Nombre y apellido</label><input id="affiliation-name" value={`${profile.nombre} ${profile.apellido}`} readOnly autoComplete="name" /></div>
      <div className={styles.fieldRow}><div className={styles.field}><label htmlFor="affiliation-dni">DNI</label><input id="affiliation-dni" required inputMode="numeric" pattern="[0-9]{7,8}" minLength={7} maxLength={8} value={dni} onChange={event => setDni(event.target.value)} aria-describedby="affiliation-dni-help" placeholder="Sin puntos ni espacios" /><p id="affiliation-dni-help" className={styles.fieldHelp}>Documento declarado para tramitar la solicitud.</p></div>
        <div className={styles.field}><label htmlFor="affiliation-phone">WhatsApp / teléfono</label><input id="affiliation-phone" type="tel" autoComplete="tel" required maxLength={20} value={phone} onChange={event => setPhone(event.target.value)} placeholder="Código de área y número" /></div></div>
      <div className={styles.field}><label htmlFor="affiliation-email">Correo electrónico de tu cuenta</label><input id="affiliation-email" type="email" autoComplete="email" value={profile.email} readOnly /></div>
      {state.checked && <div className="af-location"><LocationFields key={profile.idUsuario} required initialDepartment={profile.departamentoId || ""} initialCity={profile.ciudadId || ""} onChange={value => setCity(value || "")} /></div>}
      <p className={styles.fieldHelp}>El teléfono y la localidad se guardarán también en tu perfil, junto con esta solicitud. <Link to="/mi-cuenta">Editar otros datos de mi cuenta</Link></p>
      <label className="af-check af-fiscal"><input type="checkbox" checked={fiscal} onChange={event => setFiscal(event.target.checked)} /><span><strong>También quiero ser fiscal</strong><small>Opcional. Indicá si te interesa colaborar en la fiscalización.</small></span></label>
      <label className="af-check af-consent"><input type="checkbox" required checked={confirm} onChange={event => setConfirm(event.target.checked)} /><span>Solicito iniciar el trámite de afiliación y autorizo al equipo a contactarme por teléfono y correo sobre esta solicitud.</span></label>
      <button type="submit" className={styles.submit} disabled={blocked || !confirm}>{action.pending ? <>Enviando solicitud <LoaderCircle className={styles.spinner} size={19} aria-hidden="true" /></> : <>Enviar mi solicitud <ArrowRight size={19} aria-hidden="true" /></>}</button>
    </fieldset>
    <p className="af-secure"><ShieldCheck size={16} aria-hidden="true" /> Tus datos se comparten únicamente con el equipo autorizado.</p>
  </form>;
}
export default function AffiliationForm() {
  const state = useAccount(), action = useAccountAction();
  if (!account.api.configured) return <div className={`${styles.success} affiliation-form`}><h3>Próximamente.</h3><p>La solicitud desde tu cuenta todavía no está disponible en este entorno.</p></div>;
  if (!state.authenticated) return <div className={`${styles.success} affiliation-form`}><ShieldCheck size={42} strokeWidth={1.3} aria-hidden="true" /><h3>Empezá desde<span>tu cuenta.</span></h3><p>Ingresá para completar tu solicitud con tus datos y consultar su estado en un solo lugar.</p><LoginLink state={{ returnTo: affiliationReturn }} className={styles.submit}>Ingresar y continuar <ArrowRight size={19} aria-hidden="true" /></LoginLink><p className="af-signup">¿Todavía no tenés cuenta? <Link to="/registro" state={{ returnTo: affiliationReturn }}>Registrarme</Link></p></div>;
  if (!state.profile) return <div className="affiliation-form"><p role="status">Cargando los datos de tu cuenta…</p><div className="af-feedback"><Feedback error={state.profileError || action.error} /></div>{state.profileError && <button type="button" className="af-retry" disabled={action.busy} onClick={() => action.run(() => account.loadProfile({ force: true }))}>Volver a cargar mis datos</button>}</div>;
  return <Application key={`${state.sessionId}:${state.profile.idUsuario}`} profile={state.profile} />;
}
