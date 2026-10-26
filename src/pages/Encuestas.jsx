import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";
import { surveys } from "../lib/backend.js";
import { useAccount } from "../hooks/useAccount.js";
import { useAccountAction } from "../hooks/useAccountAction.js";
import { Feedback } from "../components/account/AccountForm.jsx";
import RetryButton from "../components/account/RetryButton.jsx";
import { SurveyPreview, SurveyQuestion } from "../components/surveys/SurveyQuestions.jsx";
import { surveyAnswerPresent } from "../lib/surveyContract.js";
import "./Encuestas.css";

const dayFormat = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const receiptFormat = new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeStyle: "short", timeZone: "America/Argentina/Buenos_Aires" });
function day(value) { return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? dayFormat.format(new Date(`${value}T00:00:00Z`)) : ""; }
function QuestionsHeading({ count }) { return <div className="sv-section-heading"><h2>Las preguntas</h2><span>{count} {count === 1 ? "pregunta" : "preguntas"}</span></div>; }
function PageList({ cursor, force, onNext, onPrevious, canGoBack, onRefresh }) {
  const [page, setPage] = useState(null), [error, setError] = useState(null);
  useAccount(); // Al cambiar la cuenta se descartan sus indicadores privados.
  useEffect(() => {
    const controller = new AbortController();
    surveys.list({ cursor, force, signal: controller.signal }).then(setPage).catch(problem => { if (!controller.signal.aborted) setError(problem); });
    return () => controller.abort();
  }, [cursor, force]);
  return <>
    {error && <div className="sv-state"><Feedback error={error} /><RetryButton error={error} className="sv-button sv-button-secondary" onClick={onRefresh}>Volver a cargar encuestas</RetryButton></div>}
    {!error && !page && <p className="sv-state" role="status">Cargando encuestas…</p>}
    {page?.items.length === 0 && <div className="sv-state sv-empty"><ClipboardList size={34} strokeWidth={1.2} aria-hidden="true" /><h2>No hay encuestas abiertas.</h2><p>Las próximas consultas estarán disponibles en esta sección.</p></div>}
    {page && <><div className="sv-card-grid">{page.items.map((item, index) => <article key={item.id} className="sv-card">
      <div className="sv-card-top"><span className="sv-card-index">{String(index + 1).padStart(2, "0")}</span><span className="sv-open">Abierta</span></div>
      <h2><Link to={`/encuestas/${item.id}`}>{item.titulo}</Link></h2>
      <p>{item.descripcion || "Consultá las preguntas y los datos que se solicitan antes de responder."}</p>
      <div className="sv-card-bottom"><span>{surveys.knownReceipt(item.id) ? "Respuesta registrada" : item.fechaFin ? `Hasta el ${day(item.fechaFin)}` : "Una respuesta por cuenta"}</span><Link to={`/encuestas/${item.id}`} aria-label={`Ver encuesta: ${item.titulo}`}><ArrowRight size={21} aria-hidden="true" /></Link></div>
    </article>)}</div>
      <div className="sv-pagination"><button type="button" disabled={!canGoBack} onClick={onPrevious}><ArrowLeft size={16} aria-hidden="true" /> Anterior</button><span>12 encuestas por página</span><button type="button" disabled={!page.siguienteCursor} onClick={() => onNext(page.siguienteCursor)}>Siguiente <ArrowRight size={16} aria-hidden="true" /></button></div></>}
  </>;
}
function SurveyList() {
  const [cursors, setCursors] = useState([null]), [revision, setRevision] = useState(0);
  return <section className="sv-page">
    <header className="sv-hero"><p className="sv-eyebrow">Participación ciudadana</p><h1>Encuestas<span>Información para participar.</span></h1><div className="sv-hero-bottom"><p>Conocé el motivo de cada consulta y las preguntas que propone. Podés leerlas libremente; para responder, ingresá con tu cuenta.</p><span><ShieldCheck size={17} aria-hidden="true" /> Una respuesta por cuenta</span></div></header>
    <div className="sv-section-heading"><h2>Consultas abiertas</h2><button type="button" onClick={() => setRevision(value => value + 1)}>Actualizar listado</button></div>
    <PageList key={`${cursors.at(-1)}:${revision}`} cursor={cursors.at(-1)} force={revision > 0} canGoBack={cursors.length > 1} onPrevious={() => setCursors(current => current.slice(0, -1))} onNext={cursor => setCursors(current => [...current, cursor])} onRefresh={() => setRevision(value => value + 1)} />
  </section>;
}
function Receipt({ value }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <div className="sv-receipt" role="status"><CheckCircle2 size={39} strokeWidth={1.3} aria-hidden="true" /><p className="sv-eyebrow">Envío registrado</p><h2 ref={heading} tabIndex={-1}>Tu respuesta ya está registrada.</h2><p>Este comprobante confirma tu participación. Esta cuenta ya respondió y no puede enviar otra respuesta a la misma encuesta.</p><dl><div><dt>Fecha del comprobante</dt><dd>{receiptFormat.format(new Date(value.createdAt))}</dd></div><div><dt>Identificador de respuesta</dt><dd className="sv-reference">{value.id}</dd></div></dl><Link className="sv-text-link" to="/encuestas">Ver otras encuestas <ArrowRight size={16} aria-hidden="true" /></Link></div>;
}
function LoginPrompt({ id }) {
  const returnTo = `/encuestas/${id}`;
  return <aside className="sv-login"><ShieldCheck size={27} strokeWidth={1.4} aria-hidden="true" /><div><h2>Ingresá para responder.</h2><p>Las preguntas son públicas. El envío necesita una cuenta para registrar una única respuesta.</p></div><div className="sv-login-actions"><Link className="sv-button" to="/ingresar" state={{ returnTo }}>Ingresar y responder <ArrowRight size={17} aria-hidden="true" /></Link><Link className="sv-text-link" to="/registro" state={{ returnTo }}>Crear una cuenta</Link></div></aside>;
}
function AnswerForm({ detail, onReceipt }) {
  const [values, setValues] = useState(() => Object.create(null)), [confirmed, setConfirmed] = useState(false), [uncertain, setUncertain] = useState(false), [checkedAgain, setCheckedAgain] = useState(false);
  const [fieldErrors, setFieldErrors] = useState(() => Object.create(null));
  const action = useAccountAction(), check = useAccountAction(), errorRef = useRef(null);
  const questions = detail.configuracion.preguntas;
  const completed = questions.filter(p => surveyAnswerPresent(p, Object.hasOwn(values, p.id) ? values[p.id] : undefined)).length;
  const sendError = action.error?.code === "survey_validation"
    ? Object.keys(fieldErrors).length ? { ...action.error, message: action.error.message, errors: fieldErrors } : null
    : action.error;
  function updateAnswer(id, value) {
    setValues(current => ({ ...current, [id]: value }));
    setFieldErrors(current => {
      if (!Object.hasOwn(current, id)) return current;
      const next = { ...current }; delete next[id]; return next;
    });
  }
  useEffect(() => { if (action.error) errorRef.current?.focus(); }, [action.error]);
  return <form className="sv-answer-form" noValidate aria-busy={action.busy || check.busy} onSubmit={event => {
    event.preventDefault(); if (!confirmed || (uncertain && !checkedAgain)) return;
    action.run(async signal => {
      try { const result = await surveys.submit(detail.id, detail.configuracion, values, signal); if (!signal.aborted) onReceipt(result); }
      catch (error) {
        if (!signal.aborted && error.code === "survey_validation") setFieldErrors(error.errors);
        if (!signal.aborted && error.code === "survey_uncertain") { setUncertain(true); setCheckedAgain(false); }
        throw error;
      }
    });
  }}>
    <div className="sv-answer-meta"><span>{completed} de {questions.length} completadas</span><span>Las preguntas opcionales pueden quedar vacías.</span></div>
    <div ref={errorRef} tabIndex={-1} className="sv-error-focus"><Feedback error={sendError || check.error} /></div>
    {uncertain && <div className="sv-uncertain"><p>Comprobá el envío antes de volver a enviarlo.</p><RetryButton error={check.error || action.error} busy={check.busy || action.busy} className="sv-button sv-button-secondary" onClick={() => check.run(async signal => {
      const result = await surveys.loadReceipt(detail.id, { force: true, signal });
      if (signal.aborted) return;
      if (result) onReceipt(result); else setCheckedAgain(true);
    })}>Comprobar respuesta</RetryButton>{checkedAgain && <p>No hay un comprobante confirmado en este momento. Podés comprobar de nuevo o reenviar manualmente; un envío anterior aún podría estar en curso.</p>}</div>}
    <fieldset className="sv-answer-fields" disabled={action.busy || check.busy}><legend className="sv-sr-only">Respuestas a la encuesta</legend>
      {questions.map((question, index) => <SurveyQuestion key={question.id} question={question} index={index}
        value={Object.hasOwn(values, question.id) ? values[question.id] : undefined}
        error={Object.hasOwn(fieldErrors, question.id) ? fieldErrors[question.id] : null}
        onChange={value => updateAnswer(question.id, value)} />)}
      <div className="sv-send"><div><h2>Revisá antes de enviar.</h2><p>Las respuestas se asocian a tu cuenta para evitar duplicados. No podrán editarse después del envío.</p></div><label className="sv-confirm"><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} /><span>Revisé mis respuestas y quiero enviarlas.</span></label><button type="submit" className="sv-button" disabled={!confirmed || action.busy || check.busy || (uncertain && !checkedAgain)}>{action.pending ? "Enviando…" : uncertain ? "Volver a enviar respuestas" : "Enviar respuestas"}<ArrowRight size={18} aria-hidden="true" /></button></div>
    </fieldset>
  </form>;
}
function SurveyDetail({ id, authenticated }) {
  const [resource, setResource] = useState({ detail: null, error: null, loading: true });
  const [proof, setProof] = useState({ value: null, error: null, loading: authenticated });
  const [revision, setRevision] = useState(0), action = useAccountAction();
  useEffect(() => {
    const controller = new AbortController();
    surveys.detail(id, { signal: controller.signal, force: revision > 0 }).then(detail => { if (!controller.signal.aborted) setResource({ detail, error: null, loading: false }); }).catch(error => { if (!controller.signal.aborted) setResource({ detail: null, error, loading: false }); });
    if (authenticated) surveys.loadReceipt(id, { signal: controller.signal, force: revision > 0 }).then(value => { if (!controller.signal.aborted) setProof({ value, error: null, loading: false }); }).catch(error => { if (!controller.signal.aborted) setProof({ value: null, error, loading: false }); });
    return () => controller.abort();
  }, [id, authenticated, revision]);
  const detail = resource.detail;
  return <article className="sv-page sv-detail-page">
    <Link className="sv-back" to="/encuestas"><ArrowLeft size={16} aria-hidden="true" /> Todas las encuestas</Link>
    <header className="sv-detail-header"><p className="sv-eyebrow">Encuestas · Participación</p><h1>{detail?.titulo || (proof.value ? "Respuesta registrada" : "Encuesta")}</h1>
      {detail && <><div className="sv-detail-tags"><span>{detail.configuracion.preguntas.length} preguntas</span><span>Una respuesta por cuenta</span>{detail.fechaFin && <span>Hasta el {day(detail.fechaFin)}</span>}</div><section className="sv-purpose" aria-label="Motivo de la encuesta"><h2>¿Por qué esta encuesta?</h2><p>{detail.descripcion || "No se publicó una descripción adicional. Podés revisar todas las preguntas antes de decidir si querés responder."}</p></section></>}
    </header>
    {(resource.loading || proof.loading) && <p className="sv-loading" role="status">{resource.loading ? "Cargando encuesta…" : "Comprobando si ya participaste…"}</p>}
    {proof.value && <Receipt value={proof.value} />}
    {resource.error && !proof.value && <div className="sv-state"><h2>{resource.error.status === 404 ? "Esta encuesta no está disponible." : "No pudimos abrir la encuesta."}</h2><Feedback error={resource.error.status === 404 ? null : resource.error} /><p>Puede haber cerrado o no estar disponible para consulta. Podés volver al listado.</p><RetryButton error={resource.error} className="sv-button sv-button-secondary" onClick={() => setRevision(value => value + 1)}>Volver a consultar</RetryButton>{!authenticated && resource.error.status === 404 && <p>¿Ya participaste? <Link className="sv-text-link" to="/ingresar" state={{ returnTo: `/encuestas/${id}` }}>Ingresá para consultar tu comprobante</Link></p>}</div>}
    {detail && <QuestionsHeading count={detail.configuracion.preguntas.length} />}
    {detail && (!authenticated || proof.value || proof.loading || proof.error) && <SurveyPreview questions={detail.configuracion.preguntas} />}
    {detail && !authenticated && <LoginPrompt id={id} />}
    {detail && authenticated && proof.error && <div className="sv-state"><p>Podés leer las preguntas. Para habilitar el envío necesitamos comprobar tu participación.</p><Feedback error={proof.error || action.error} /><RetryButton error={proof.error || action.error} busy={action.busy} className="sv-button sv-button-secondary" onClick={() => action.run(async signal => {
      const value = await surveys.loadReceipt(id, { force: true, signal }); if (!signal.aborted) setProof({ value, error: null, loading: false });
    })}>Comprobar mi participación</RetryButton></div>}
    {detail && authenticated && !proof.value && !proof.loading && !proof.error && <AnswerForm detail={detail} onReceipt={value => setProof({ value, error: null, loading: false })} />}
  </article>;
}
export default function Encuestas() {
  const { id } = useParams(), account = useAccount();
  return id ? <SurveyDetail key={`${id}:${account.sessionId}`} id={id} authenticated={account.authenticated} /> : <SurveyList />;
}
