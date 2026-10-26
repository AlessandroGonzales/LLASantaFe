import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronRight, RefreshCw, ShieldCheck, X } from "lucide-react";
import { account, affiliation } from "../lib/backend.js";
import { affiliationStates, isAdministrator } from "../lib/affiliationService.js";
import { affiliationDate, affiliationLabels } from "../lib/affiliationFormat.js";
import { useAccount } from "../hooks/useAccount.js";
import { useAccountAction } from "../hooks/useAccountAction.js";
import { Feedback } from "../components/account/AccountForm.jsx";
import RetryButton from "../components/account/RetryButton.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import AffiliationPhoto from "../components/affiliation/AffiliationPhoto.jsx";
import "./AdminAfiliaciones.css";
import "../components/affiliation/Affiliation.css";

function Inbox({ estado, cursor, selected, onSelect, onNext, onPrevious, canGoBack, onRefresh }) {
  const [page, setPage] = useState(null), [error, setError] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    affiliation.list({ estado, cursor }, controller.signal).then(setPage).catch(problem => { if (!controller.signal.aborted) setError(problem); });
    return () => controller.abort();
  }, [estado, cursor]);
  return <section className="af-inbox" aria-label={`Solicitudes ${affiliationStates[estado].toLowerCase()}`}>
    <div className="af-inbox-heading"><h2>{affiliationStates[estado]}</h2><span>20 por página</span></div>
    {error && <div className="af-admin-error"><Feedback error={error} /><RetryButton error={error} onClick={onRefresh} /></div>}
    {!error && !page && <p className="af-empty" role="status">Cargando solicitudes…</p>}
    {page?.items.length === 0 && <div className="af-empty"><Check size={26} strokeWidth={1.2} aria-hidden="true" /><h3>No hay solicitudes aquí.</h3><p>Cuando existan solicitudes en este estado, aparecerán en esta bandeja.</p></div>}
    {page && <ul className="af-rows">{page.items.map(item => <li key={item.id}><button type="button" className={selected === item.id ? "is-selected" : ""} aria-pressed={selected === item.id} onClick={() => onSelect(item.id)}>
      <AffiliationPhoto item={item} />
      <span className="af-row-copy"><strong>{item.nombre} {item.apellido}</strong><span>{affiliationDate(item.fechaSolicitud)}{!item.usuarioActivo && " · Cuenta inactiva"}</span></span>
      <ChevronRight size={17} aria-hidden="true" />
    </button></li>)}</ul>}
    {page && <div className="af-pagination"><button type="button" disabled={!canGoBack} onClick={onPrevious}><ArrowLeft size={15} aria-hidden="true" /> Anterior</button><button type="button" disabled={!page.siguienteCursor} onClick={() => onNext(page.siguienteCursor)}>Siguiente <ArrowRight size={15} aria-hidden="true" /></button></div>}
  </section>;
}
function Detail({ id, onClose, onResolved }) {
  const [item, setItem] = useState(null), [error, setError] = useState(null), [revision, setRevision] = useState(0);
  const [decision, setDecision] = useState(null), [text, setText] = useState(""), [confirmed, setConfirmed] = useState(false), [uncertain, setUncertain] = useState(false);
  const heading = useRef(null), action = useAccountAction();
  useEffect(() => {
    const controller = new AbortController();
    affiliation.detail(id, controller.signal).then(value => { setItem(value); setUncertain(false); setError(null); }).catch(problem => { if (!controller.signal.aborted) setError(problem); });
    return () => controller.abort();
  }, [id, revision]);
  useEffect(() => { if (item) heading.current?.focus({ preventScroll: false }); }, [item]);
  const canApprove = item?.usuarioActivo && (!item.requiereVerificarEmail || item.emailVerificado);
  const unresolved = ["pendiente", "en_revision"].includes(item?.estado);
  return <section className="af-detail" aria-label="Detalle de la solicitud">
    <div className="af-detail-top"><p className="af-admin-eyebrow">Detalle de solicitud</p><button type="button" className="af-close" onClick={onClose} aria-label="Cerrar detalle"><X size={19} /></button></div>
    {!item && !error && <p role="status">Cargando el detalle…</p>}
    <Feedback error={error} />
    {error && <RetryButton error={error} busy={action.busy} onClick={() => setRevision(value => value + 1)}>Volver a cargar el detalle</RetryButton>}
    {item && <>
      <div className="af-detail-identity"><AffiliationPhoto item={item} large /><h2 ref={heading} tabIndex={-1}>{item.nombre}<span>{item.apellido}</span></h2></div>
      <span className={`af-badge af-badge-${item.estado}`}>{affiliationLabels[item.estado]}</span>
      <dl className="af-contact-grid">
        <div><dt>DNI declarado</dt><dd>{item.dni || "Sin registro histórico"}</dd></div><div><dt>Localidad actual</dt><dd>{item.ciudadNombre || "Sin indicar"}</dd></div>
        <div><dt>Correo electrónico</dt><dd><a href={`mailto:${item.email}`}>{item.email}</a><small>{item.emailVerificado ? "Email verificado" : item.requiereVerificarEmail ? "Verificación pendiente" : "Cuenta anterior a la verificación"}</small></dd></div>
        <div><dt>Teléfono actual</dt><dd>{item.telefono ? <a href={`tel:${item.telefono.replace(/[^+0-9]/g, "")}`}>{item.telefono}</a> : "Sin indicar"}</dd></div>
        <div><dt>Interés en fiscalizar</dt><dd>{typeof item.quiereFiscalizar !== "boolean" ? "Sin registro histórico" : item.quiereFiscalizar ? "Sí, lo solicitó" : "No lo solicitó"}</dd></div>
        <div><dt>Fecha de solicitud</dt><dd>{affiliationDate(item.fechaSolicitud)}</dd></div>
      </dl>
      {!item.usuarioActivo && <p className="af-admin-warning">La cuenta está inactiva. Esta solicitud no puede aprobarse.</p>}
      {item.motivoRechazo && <div className="af-resolution-note"><strong>Motivo comunicado al solicitante</strong><p>{item.motivoRechazo}</p></div>}
      {item.observacion && <div className="af-resolution-note"><strong>Nota interna</strong><p>{item.observacion}</p></div>}
      {(item.aprobadaAt || item.rechazadaAt) && <p className="af-admin-muted">Resolución registrada: {affiliationDate(item.aprobadaAt || item.rechazadaAt)}</p>}
      <Feedback {...action} />
      {uncertain && <RetryButton error={action.error} busy={action.busy} onClick={() => setRevision(value => value + 1)}>Comprobar estado antes de continuar</RetryButton>}
      {unresolved && !uncertain && <div className="af-decisions">
        {!decision ? <><p>Revisá los datos y contactá a la persona antes de resolver.</p><div className="af-decision-buttons"><button type="button" className="af-approve" disabled={!canApprove || action.busy} onClick={() => { setDecision("aprobar"); setText(""); setConfirmed(false); }}><Check size={17} aria-hidden="true" /> Aprobar solicitud</button><button type="button" className="af-reject" disabled={action.busy} onClick={() => { setDecision("rechazar"); setText(""); setConfirmed(false); }}>Rechazar</button></div></> :
          <form aria-busy={action.busy} onSubmit={event => { event.preventDefault(); if (!confirmed) return; action.run(async signal => {
            try {
              await affiliation.resolve(id, decision, text, signal);
            } catch (problem) {
              if (signal.aborted) throw problem;
              if (problem.status === 409 || problem.status >= 500 || ["network", "timeout", "invalid_response"].includes(problem.code)) {
                setUncertain(true);
                try {
                  const current = await affiliation.detail(id, signal); setItem(current); setUncertain(false);
                  if (!["pendiente", "en_revision"].includes(current.estado)) { setDecision(null); onResolved(); return; }
                } catch { /* Se mantiene bloqueado hasta confirmar el estado. */ }
              }
              throw problem;
            }
            onResolved(); setUncertain(true);
            try { const current = await affiliation.detail(id, signal); setItem(current); setDecision(null); setUncertain(false); }
            catch { throw new Error("La resolución fue aceptada, pero no pudimos actualizar el detalle. Comprobá el estado antes de continuar."); }
          }, "Estado de la solicitud actualizado."); }}>
            <fieldset disabled={action.busy}>
              <label htmlFor="af-decision-text">{decision === "aprobar" ? "Nota interna (opcional)" : "Motivo que verá el solicitante"}</label>
              <textarea id="af-decision-text" value={text} onChange={event => setText(event.target.value)} required={decision === "rechazar"} minLength={decision === "rechazar" ? 10 : undefined} maxLength={2000} rows={4} />
              <p className="af-admin-muted">{decision === "aprobar" ? "La aprobación encola el aviso por correo. La nota queda solo para administración." : "Escribí un motivo claro de al menos 10 caracteres, sin datos privados de otras personas."}</p>
              <label className="af-admin-check"><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />Confirmo {decision === "aprobar" ? "la aprobación" : "el rechazo"}. Esta decisión es definitiva.</label>
              <div className="af-decision-buttons"><button type="submit" className={decision === "aprobar" ? "af-approve" : "af-reject"} disabled={!confirmed || action.busy}>{action.pending ? "Guardando…" : decision === "aprobar" ? "Confirmar aprobación" : "Confirmar rechazo"}</button><button type="button" disabled={action.busy} onClick={() => setDecision(null)}>Cancelar</button></div>
            </fieldset>
          </form>}
      </div>}
      <p className="af-admin-reference">ID {item.id}</p>
    </>}
  </section>;
}
function Workspace() {
  const [estado, setEstado] = useState("pendiente"), [cursors, setCursors] = useState([null]), [selected, setSelected] = useState(null);
  const [revision, setRevision] = useState(0), [totals, setTotals] = useState(null), [totalError, setTotalError] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    affiliation.totals(controller.signal).then(value => { setTotals(value); setTotalError(null); }).catch(problem => { if (!controller.signal.aborted) setTotalError(problem); });
    return () => controller.abort();
  }, [revision]);
  const refresh = () => setRevision(value => value + 1);
  return <div className="af-admin">
    <header className="af-admin-header"><div><Link to="/mi-cuenta" className="af-back"><ArrowLeft size={15} aria-hidden="true" /> Mi cuenta</Link><SectionTitle title="Afiliaciones" /><p className="af-admin-subtitle">Un lugar para cada solicitud.</p></div><RetryButton error={totalError} className="af-refresh" onClick={refresh}><RefreshCw size={16} aria-hidden="true" /> Actualizar</RetryButton></header>
    {totalError && <Feedback error={totalError} />}
    <dl className="af-stats">{[["Solicitudes", totals?.totalSolicitudes], ["Aprobadas en el sistema", totals?.totalAfiliados], ["Por revisar", totals ? totals.pendientes + totals.enRevision : null], ["Rechazadas", totals?.rechazadas]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value ?? "—"}</dd></div>)}</dl>
    <nav className="af-filter" aria-label="Filtrar afiliaciones por estado">{Object.entries(affiliationStates).map(([key, label]) => <button key={key} type="button" aria-pressed={estado === key} onClick={() => { setEstado(key); setCursors([null]); setSelected(null); }}>{label}</button>)}</nav>
    <div className="af-admin-body"><Inbox key={`${estado}:${cursors.at(-1)}:${revision}`} estado={estado} cursor={cursors.at(-1)} selected={selected} onSelect={setSelected} canGoBack={cursors.length > 1} onPrevious={() => { setCursors(current => current.slice(0, -1)); setSelected(null); }} onNext={cursor => { setCursors(current => [...current, cursor]); setSelected(null); }} onRefresh={refresh} />
      {selected ? <Detail key={selected} id={selected} onClose={() => setSelected(null)} onResolved={refresh} /> : <aside className="af-detail-placeholder"><ShieldCheck size={35} strokeWidth={1} aria-hidden="true" /><h2>Lo necesario,<br />en el momento indicado.</h2><p>Seleccioná una solicitud para revisar sus datos de contacto y su estado.</p><span>Los datos de contacto se cargan al abrir el detalle.</span></aside>}
    </div>
  </div>;
}
export default function AdminAfiliaciones() {
  const state = useAccount(), action = useAccountAction();
  if (!state.authenticated) return <Navigate to="/ingresar" replace state={{ returnTo: "/administracion/afiliaciones", notice: "Iniciá sesión para acceder a administración." }} />;
  if (!state.profile) return <div className="af-admin"><p role="status">Cargando tu cuenta…</p><Feedback error={state.profileError || action.error} />{state.profileError && <RetryButton error={state.profileError} busy={action.busy} onClick={() => action.run(() => account.loadProfile({ force: true }))} />}</div>;
  if (!isAdministrator(state.profile)) return <div className="af-admin"><p className="af-admin-eyebrow">Acceso restringido</p><h1>Esta sección requiere<br />una cuenta administradora.</h1><Link to="/mi-cuenta" className="af-back">Volver a mi cuenta</Link></div>;
  return <Workspace key={state.sessionId} />;
}
