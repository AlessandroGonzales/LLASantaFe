import LoginLink from "../account/LoginLink.jsx";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, CircleHelp, HandHeart, Inbox, Lightbulb, MessageSquareText, ShieldAlert, ShieldCheck } from "lucide-react";
import { account, citizenRequests } from "../../lib/backend.js";
import { citizenMotives, citizenStates } from "../../lib/citizenRequestService.js";
import { affiliationDate } from "../../lib/affiliationFormat.js";
import { useAccount } from "../../hooks/useAccount.js";
import { useAccountAction } from "../../hooks/useAccountAction.js";
import { Feedback } from "../account/AccountForm.jsx";
import RetryButton from "../account/RetryButton.jsx";
import "./CitizenRequests.css";

const motivePresentation = {
  proyecto: { title: "Proyecto", description: "Una propuesta formal", Icon: Lightbulb },
  sugerencia: { title: "Sugerencia", description: "Una idea para la provincia", Icon: MessageSquareText },
  duda: { title: "Consulta", description: "Una duda para el equipo", Icon: CircleHelp },
  voluntariado: { title: "Voluntariado", description: "Sumarte como voluntario o fiscal", Icon: HandHeart },
  denuncia: { title: "Denuncia", description: "Informar una irregularidad", Icon: ShieldAlert },
};

function MotiveCards({ selected, onChange }) {
  return <ul className="cr-topics-grid" aria-label="Motivos disponibles">{Object.entries(citizenMotives).map(([value, label]) => {
    const { title, description, Icon } = motivePresentation[value];
    const content = <><Icon size={22} strokeWidth={1.6} aria-hidden="true" /><span><strong>{title}</strong><small>{description}</small></span></>;
    return <li key={value}>{onChange ? <label className={`cr-topic cr-topic-${value}${selected === value ? " is-selected" : ""}`}>
      <input type="radio" name="motivo" value={value} required checked={selected === value} onChange={() => onChange(value)} aria-label={label} />{content}
    </label> : <div className={`cr-topic cr-topic-${value}`}>{content}</div>}</li>;
  })}</ul>;
}

function RequestWorkspace({ children }) {
  return <div className="cr-workspace"><div className="cr-workspace-main">{children}</div>
    <aside className="cr-guide" aria-labelledby="cr-guide-title">
      <h2 id="cr-guide-title">De tu idea al siguiente paso.</h2>
      <ol>{[
        ["Elegís el motivo", "Nos ayuda a entender de qué se trata tu mensaje."],
        ["Compartís los detalles", "Contanos qué pasa, dónde y qué te gustaría proponer."],
        ["Seguís tu solicitud", "Consultá el estado y la respuesta del equipo en «Mis solicitudes»."],
      ].map(([title, text], index) => <li key={title}><span aria-hidden="true">{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
      <div className="cr-guide-note"><ShieldCheck size={23} strokeWidth={1.5} aria-hidden="true" /><h3>Un intercambio cuidado.</h3><p>Compartí solo los datos necesarios para explicar tu situación. Tu mensaje queda vinculado a tu cuenta para que puedas seguirlo.</p></div>
    </aside>
  </div>;
}

function RequestDetail({ id, onUpdated }) {
  const [value, setValue] = useState(null), [error, setError] = useState(null), action = useAccountAction();
  useEffect(() => {
    const controller = new AbortController();
    citizenRequests.detail(id, { signal: controller.signal }).then(item => { if (!controller.signal.aborted) { setValue(item); onUpdated(item); } }).catch(problem => { if (!controller.signal.aborted) setError(problem); });
    return () => controller.abort();
  }, [id, onUpdated]);
  return <div className="cr-detail" aria-label="Detalle de la solicitud">
    {!value && !error && <p role="status">Cargando solicitud…</p>}
    <Feedback error={action.error || error} />
    <RetryButton error={action.error || error} busy={action.busy} className="cr-text-button" onClick={() => action.run(async signal => {
      const item = await citizenRequests.detail(id, { force: true, signal }); if (!signal.aborted) { setValue(item); setError(null); onUpdated(item); }
    })}>Actualizar estado</RetryButton>
    {value && <><p className="cr-label">Tu mensaje</p><p className="cr-message">{value.mensaje}</p><div className="cr-response"><p className="cr-label">Respuesta del equipo</p><p className="cr-message">{value.respuesta || "Todavía no hay una respuesta registrada."}</p></div><p>Estado: <strong>{citizenStates[value.estado]}</strong> · Última actualización: {affiliationDate(value.updatedAt)}</p>{value.tienePdf && <p>Esta solicitud tiene un adjunto registrado. La gestión de documentos estará disponible en una próxima etapa.</p>}<p className="cr-reference">Identificador: {value.id}</p></>}
  </div>;
}
function RequestPage({ cursor, estado, revision, onNext, onPrevious, canGoBack, onRefresh }) {
  const [page, setPage] = useState(null), [error, setError] = useState(null), [selected, setSelected] = useState(null);
  const updateItem = useCallback(value => setPage(current => current ? { ...current, items: current.items.map(item => item.id === value.id ? { ...item, estado: value.estado, revision: value.revision } : item) } : current), []);
  useEffect(() => {
    const controller = new AbortController();
    citizenRequests.list({ estado, cursor, force: revision > 0, signal: controller.signal }).then(value => { if (!controller.signal.aborted) setPage(value); }).catch(problem => { if (!controller.signal.aborted) setError(problem); });
    return () => controller.abort();
  }, [cursor, estado, revision]);
  return <>
    <Feedback error={error} />
    {error && <RetryButton error={error} className="cr-text-button" onClick={onRefresh}>Volver a cargar solicitudes</RetryButton>}
    {!page && !error && <p role="status">Cargando tus solicitudes…</p>}
    {page && <>{page.items.length === 0 ? <div className="cr-empty"><Inbox size={29} strokeWidth={1.4} aria-hidden="true" /><h3>{estado ? "No hay solicitudes con este estado." : "Tus próximas conversaciones, acá."}</h3><p>{estado ? "Podés elegir otro estado para consultar tus envíos." : "Cuando envíes un mensaje, vas a poder consultar su estado y la respuesta del equipo en este espacio."}</p></div> : <ul className="cr-list">{page.items.map(item => <li key={item.id}><button type="button" aria-expanded={selected === item.id} onClick={() => setSelected(current => current === item.id ? null : item.id)}><span><strong>{Object.hasOwn(citizenMotives, item.motivo) ? citizenMotives[item.motivo] : item.motivo}</strong><small>{affiliationDate(item.createdAt)}</small></span><span className={`cr-badge cr-badge-${item.estado}`}>{citizenStates[item.estado]}</span><ArrowRight size={18} aria-hidden="true" /></button>{selected === item.id && <RequestDetail key={item.id} id={item.id} onUpdated={updateItem} />}</li>)}</ul>}
      <div className="cr-pagination"><button type="button" disabled={!canGoBack} onClick={onPrevious}>Anterior</button><span>Hasta 20 solicitudes por página</span><button type="button" disabled={!page.siguienteCursor} onClick={() => onNext(page.siguienteCursor)}>Siguiente</button></div></>}
  </>;
}
function OwnRequests({ receipt }) {
  const { hash, key } = useLocation(), section = useRef(null);
  const [estado, setEstado] = useState(""), [cursors, setCursors] = useState([null]), [revision, setRevision] = useState(0);
  useEffect(() => {
    if (hash !== "#mis-solicitudes") return;
    const frame = requestAnimationFrame(() => section.current?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, [hash, key]);
  return <section ref={section} className="cr-own" id="mis-solicitudes" aria-labelledby="cr-own-title"><div className="cr-section-heading"><div><h2 id="cr-own-title">Mis solicitudes</h2><p>Cada mensaje tiene su lugar. Acá podés seguir su recorrido.</p></div><button type="button" className="cr-text-button" onClick={() => setRevision(value => value + 1)}>Actualizar listado</button></div>
    <div className="cr-filter"><label htmlFor="cr-state">Estado</label><select id="cr-state" value={estado} onChange={event => { setEstado(event.target.value); setCursors([null]); }}><option value="">Todos</option>{Object.entries(citizenStates).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
    <RequestPage key={`${receipt || ""}:${estado}:${cursors.at(-1)}:${revision}`} cursor={cursors.at(-1)} estado={estado} revision={revision} canGoBack={cursors.length > 1} onPrevious={() => setCursors(current => current.slice(0, -1))} onNext={cursor => setCursors(current => [...current, cursor])} onRefresh={() => setRevision(value => value + 1)} />
  </section>;
}
function Receipt({ value, onNew }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: "center", behavior: "instant" }); }, []);
  return <div className="cr-receipt" role="status"><CheckCircle2 size={36} strokeWidth={1.3} aria-hidden="true" /><p className="cr-eyebrow">Envío confirmado</p><h2 ref={heading} tabIndex={-1}>Tu solicitud fue recibida.</h2><p>Podés consultar su estado y la respuesta del equipo en «Mis solicitudes».</p><p className="cr-reference">Identificador: {value.id}</p><button type="button" className="cr-button cr-secondary" onClick={onNew}>Escribir otra solicitud</button></div>;
}
function CitizenForm({ profile }) {
  const state = useSyncExternalStore(citizenRequests.subscribe, citizenRequests.getSnapshot), action = useAccountAction();
  const [form, setForm] = useState(() => state.operation?.body || { motivo: "", mensaje: "" });
  const locked = ["sending", "uncertain"].includes(state.status), errorRef = useRef(null);
  useEffect(() => { if (state.error || action.error) errorRef.current?.focus(); }, [state.error, action.error]);
  return <>
    <RequestWorkspace><div className="cr-compose">
      {state.status === "confirmed" ? <Receipt value={state.receipt} onNew={() => { citizenRequests.startNew(); setForm({ motivo: "", mensaje: "" }); }} /> : <form onSubmit={event => { event.preventDefault(); action.run(signal => citizenRequests.submit(form, signal)); }} aria-busy={action.pending || state.status === "sending"}>
        <div className="cr-form-heading"><h2>¿Qué querés compartir?</h2><p>Te leemos. Elegí el motivo y contanos con tus palabras.</p></div>
        <div className="cr-profile"><ShieldCheck size={21} strokeWidth={1.5} aria-hidden="true" /><div><strong>{profile.nombre} {profile.apellido}</strong><span>{profile.email}</span>{profile.telefono && <span>{profile.telefono}</span>}{profile.ciudadNombre && <span>{profile.ciudadNombre}</span>}<Link to="/mi-cuenta">Revisar datos de mi cuenta</Link></div></div>
        <div ref={errorRef} tabIndex={-1}><Feedback error={state.error || action.error} /></div>
        {state.status === "uncertain" && <div className="cr-uncertain"><p>{state.error?.status === 429 ? "Se alcanzó un límite de envíos. Conservamos tu mensaje; volvé a intentarlo más tarde." : "El envío todavía no está confirmado. Conservamos el mensaje y su identificador de envío. Al comprobarlo se usa la misma operación para evitar duplicados."}</p><RetryButton error={state.error || action.error} busy={action.busy} className="cr-button cr-secondary" onClick={() => action.run(signal => citizenRequests.retry(signal))}>{state.error?.status === 429 ? "Reintentar envío más tarde" : "Comprobar envío"}</RetryButton></div>}
        <fieldset disabled={locked || action.busy} className="cr-fields"><legend className="cr-sr-only">Datos de la solicitud</legend>
          <fieldset className="cr-topic-fieldset"><legend>Motivo de la solicitud</legend><MotiveCards selected={form.motivo} onChange={motivo => setForm(current => ({ ...current, motivo }))} /></fieldset>
          <div className="cr-field"><label htmlFor="cr-mensaje">Tu mensaje</label><textarea id="cr-mensaje" required minLength={10} maxLength={5000} rows={7} value={form.mensaje} onChange={event => setForm(current => ({ ...current, mensaje: event.target.value }))} aria-describedby="cr-message-help" placeholder="Contanos qué pasa, dónde sucede y cómo te gustaría que se aborde. Los detalles nos ayudan a comprenderte mejor." /></div>
          <div className="cr-message-meta"><p id="cr-message-help" className="cr-help">Entre 10 y 5000 caracteres.</p><span>{form.mensaje.length} / 5000</span></div>
          <button type="submit" className="cr-button" disabled={locked || action.busy}>{action.pending ? "Enviando…" : "Enviar solicitud"}<ArrowRight size={18} aria-hidden="true" /></button></fieldset>
        <p className="cr-help cr-limits">Podés enviar hasta 3 solicitudes cada 24 horas. Revisá tus envíos para evitar repetirlos. Este formulario recibe mensajes de texto.</p>
      </form>}
    </div></RequestWorkspace>
    <OwnRequests receipt={state.receipt?.id} />
  </>;
}
export default function CitizenRequests() {
  const state = useAccount(), action = useAccountAction();
  if (!account.api.configured) return <RequestWorkspace><div className="cr-compose cr-prompt"><h2>Próximamente.</h2><p>El envío de solicitudes desde tu cuenta todavía no está disponible en este entorno.</p></div></RequestWorkspace>;
  if (!state.authenticated) return <RequestWorkspace><div className="cr-compose cr-prompt"><div className="cr-invitation-icon"><MessageSquareText size={28} strokeWidth={1.5} aria-hidden="true" /></div><h2>Acercanos tu propuesta o consulta.</h2><p>Hay distintas formas de participar. Ingresá con tu cuenta para enviar un mensaje y consultar su estado en este mismo espacio.</p><MotiveCards /><div className="cr-prompt-actions"><LoginLink className="cr-button" state={{ returnTo: "/propone" }}>Ingresar y escribir<ArrowRight size={18} aria-hidden="true" /></LoginLink><p>¿Todavía no tenés cuenta? <Link to="/registro" state={{ returnTo: "/propone" }}>Registrarme</Link></p></div></div></RequestWorkspace>;
  if (!state.profile) return <RequestWorkspace><div className="cr-compose"><p role="status">Cargando los datos de tu cuenta…</p><Feedback error={state.profileError || action.error} />{state.profileError && <RetryButton error={state.profileError || action.error} busy={action.busy} className="cr-text-button" onClick={() => action.run(() => account.loadProfile({ force: true }))}>Volver a cargar mis datos</RetryButton>}</div></RequestWorkspace>;
  return <CitizenForm key={`${state.sessionId}:${state.profile.idUsuario}`} profile={state.profile} />;
}
