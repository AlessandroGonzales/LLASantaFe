import SectionTitle from "../components/SectionTitle.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ClipboardCheck } from "lucide-react";
import { surveys } from "../lib/backend.js";
import { affiliationDate } from "../lib/affiliationFormat.js";
import { useAccount } from "../hooks/useAccount.js";
import LoginLink from "../components/account/LoginLink.jsx";
import { Feedback } from "../components/account/AccountForm.jsx";
import "./MisRespuestas.css";

function Answer({ item }) {
  const [open, setOpen] = useState(false), [data, setData] = useState(null), [error, setError] = useState(null), [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!open || data) return;
    const controller = new AbortController();
    surveys.ownResponse(item.id, { signal: controller.signal, force: revision > 0 }).then(value => { if (!controller.signal.aborted) { setError(null); setData(value); } }, problem => { if (!controller.signal.aborted) setError(problem); });
    return () => controller.abort();
  }, [open, item.id, data, revision]);
  return <article className="my-answer"><button type="button" className="my-answer-toggle" aria-expanded={open} aria-controls={`answer-${item.id}`} onClick={() => setOpen(value => !value)}><span><strong>{item.titulo}</strong><small>Respondida el {affiliationDate(item.createdAt)}</small></span><ChevronDown size={19} className={open ? "is-open" : ""} aria-hidden="true" /></button>
    {open && <div id={`answer-${item.id}`} className="my-answer-content"><Feedback error={error} />{!data && !error && <p role="status">Cargando tus respuestas…</p>}{error && <button type="button" className="my-answers-link" onClick={() => { setError(null); setRevision(value => value + 1); }}>Volver a consultar</button>}
      {data && <ol>{data.preguntas.map((question, index) => <li key={index}><h2>{question.pregunta}</h2>{question.respondida ? question.valores.map((value, i) => <p key={i} className="my-answer-value">{value}</p>) : <p className="my-answer-omitted">No respondiste esta pregunta opcional.</p>}</li>)}</ol>}
    </div>}
  </article>;
}
function History() {
  const [cursor, setCursor] = useState(null), [previous, setPrevious] = useState([]), [resource, setResource] = useState({}), [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    surveys.ownResponses({ cursor, signal: controller.signal, force: revision > 0 }).then(data => { if (!controller.signal.aborted) setResource({ data }); }, error => { if (!controller.signal.aborted) setResource({ error }); });
    return () => controller.abort();
  }, [cursor, revision]);
  return <><Feedback error={resource.error} />{!resource.data && !resource.error && <p role="status">Cargando tu participación…</p>}
    {resource.error && <button className="my-answers-link" type="button" onClick={() => { setResource({}); setRevision(value => value + 1); }}>Volver a consultar</button>}
    {resource.data && <>{!resource.data.items.length && <div className="my-answers-empty"><ClipboardCheck size={30} strokeWidth={1.2} aria-hidden="true" /><p>Todavía no registraste respuestas.</p><Link to="/encuestas">Ver encuestas disponibles</Link></div>}
      {resource.data.items.map(item => <Answer key={item.id} item={item} />)}
      <div className="my-answers-pagination">{previous.length > 0 && <button type="button" onClick={() => { setResource({}); setCursor(previous.at(-1)); setPrevious(value => value.slice(0, -1)); }}>Anteriores</button>}{resource.data.siguienteCursor && <button type="button" onClick={() => { setResource({}); setPrevious(value => [...value, cursor]); setCursor(resource.data.siguienteCursor); }}>Siguientes</button>}</div>
    </>}
  </>;
}
export default function MisRespuestas() {
  const { authenticated, sessionId } = useAccount();
  return <section className="my-answers-page"><div className="my-answers-wrap"><Link to="/encuestas" className="my-answers-back"><ArrowLeft size={16} aria-hidden="true" />Encuestas</Link><SectionTitle as="h1" title="Respuestas de encuestas" /><p className="my-answers-intro">Consultá lo que compartiste, incluso cuando la encuesta haya finalizado. Estas respuestas solo están disponibles para vos.</p>
    {authenticated ? <History key={sessionId} /> : <LoginLink className="my-answers-signin" state={{ returnTo: "/mi-cuenta/encuestas" }}>Ingresar para ver mis respuestas</LoginLink>}
  </div></section>;
}
