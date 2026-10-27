import SectionTitle from "../components/SectionTitle.jsx";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Camera, Check, Eye, EyeOff, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { account } from "../lib/backend.js";
import { useAccount } from "../hooks/useAccount.js";
import { useAccountAction } from "../hooks/useAccountAction.js";
import { useRegistrationWelcome } from "../context/registrationContext.js";
import { emptyRegistration, registrationBody, registrationSteps, validateRegistrationStep, submitRegistration } from "../lib/registration.js";
import { verifyHuman } from "../lib/turnstile.js";
import { prepareProfilePhoto } from "../lib/profilePhoto.js";
import { privacyNotice } from "../data/privacyNotice.js";
import { Field, Feedback } from "../components/account/AccountForm.jsx";
import LocationFields from "../components/account/LocationFields.jsx";
import LoginLink from "../components/account/LoginLink.jsx";
import logo from "../assets/aguila.webp";
import "./Registro.css";

const copy = [
  ["Empecemos por vos.", "Un nombre, una historia. Creá tu espacio para informarte, compartir ideas y participar en Santa Fe."],
  ["Tu lugar también cuenta.", "Cada localidad tiene su propia realidad. Contanos un poco más para acompañar tu participación."],
  ["Lo que hacés, también suma.", "Contanos de qué trabajás día a día. Tu experiencia forma parte de lo que podés aportar."],
  ["Un espacio propio. Un acceso seguro.", "Elegí una contraseña larga y personal. Una frase que recuerdes puede ser un buen comienzo."],
  ["Tu confianza, primero.", "Antes de crear tu cuenta, conocé para qué necesitamos tus datos, cómo los cuidamos y qué podés decidir sobre ellos."],
];
function Privacy() {
  return <div className="registration-privacy"><div className="registration-responsible"><ShieldCheck size={25} strokeWidth={1.4} aria-hidden="true" /><div><strong>{privacyNotice.responsible}</strong><p>{privacyNotice.address}</p><a href={`mailto:${privacyNotice.email}`}>{privacyNotice.email}</a></div></div>
    {privacyNotice.sections.map((section, index) => <details key={section.title} open={index === 0}><summary>{section.title}</summary><p>{section.text}</p></details>)}
    <p className="registration-legal-links"><a href={privacyNotice.lawUrl} target="_blank" rel="noreferrer">Ley 25.326</a><a href={privacyNotice.rightsUrl} target="_blank" rel="noreferrer">Tus derechos ante la AAIP</a><span>Versión {privacyNotice.version}</span></p>
  </div>;
}
export default function Registro() {
  const state = useAccount(), action = useAccountAction(), navigate = useNavigate(), { showWelcome } = useRegistrationWelcome();
  const [step, setStep] = useState(0), [direction, setDirection] = useState("forward"), [form, setForm] = useState(emptyRegistration);
  const [photo, setPhoto] = useState(null), [preparing, setPreparing] = useState(false), [error, setError] = useState(null), [visible, setVisible] = useState(false);
  const fileInput = useRef(null), photoTask = useRef(null), heading = useRef(null), errorRef = useRef(null), challengeRef = useRef(null);
  useEffect(() => () => photoTask.current?.abort(), []);
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.url); }, [photo]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); if (step > 0) heading.current?.scrollIntoView({ block: "nearest", behavior: "instant" }); });
    return () => cancelAnimationFrame(frame);
  }, [step]);
  const problem = error || action.error, busy = action.busy || preparing;
  useEffect(() => { if (problem) errorRef.current?.focus(); }, [problem]);
  const set = name => event => setForm(value => ({ ...value, [name]: event.target.value }));
  function go(next) { setDirection(next < step ? "back" : "forward"); setError(null); setStep(next); }
  async function selectPhoto(file) {
    photoTask.current?.abort(); const controller = new AbortController(); photoTask.current = controller; setError(null);
    if (!file) return; setPreparing(true);
    try {
      const blob = await prepareProfilePhoto(file, controller.signal, { maxBytes: 32768 });
      if (!controller.signal.aborted) setPhoto({ blob, url: URL.createObjectURL(blob) });
    } catch (problem) { if (!controller.signal.aborted) setError(problem); }
    finally { if (!controller.signal.aborted) setPreparing(false); }
  }
  function submit(event) {
    event.preventDefault(); if (busy) return;
    try { validateRegistrationStep(step, form); } catch (problem) { setError(problem); return; }
    setError(null);
    if (step < 4) { go(step + 1); return; }
    action.run(async signal => {
      const body = await registrationBody(form, photo?.blob, signal);
      await submitRegistration({
        body, signal, register: account.register, verify: verifyHuman, container: challengeRef.current,
        challengeRequired: !import.meta.env.DEV,
      });
      signal.throwIfAborted();
      showWelcome({ nombre: form.nombre.trim(), foto: photo?.blob });
      setForm(emptyRegistration()); navigate("/", { replace: true });
    });
  }
  if (state.authenticated) return <Navigate to="/mi-cuenta" replace />;
  return <section className="registration"><div className="registration-layout"><aside className="registration-story"><Link className="registration-back" to="/"><ArrowLeft size={15} aria-hidden="true" />Volver al sitio</Link><div className="registration-brand"><img src={logo} width={74} height={74} alt="" /><span>La Libertad Avanza<small>Santa Fe</small></span></div><SectionTitle as="h1" title="El próximo paso empieza" accent="con vos." tone="light" breakLine /><p className="registration-story-copy">Ideas que se encuentran.<br />Personas que deciden participar.<br />Una provincia que mira hacia adelante.</p>
      <ol className="registration-steps" aria-label="Pasos del registro">{registrationSteps.map((label, index) => <li key={label} className={index === step ? "is-current" : index < step ? "is-complete" : ""} aria-current={index === step ? "step" : undefined}><span>{index < step ? <Check size={13} aria-hidden="true" /> : String(index + 1).padStart(2, "0")}</span><span>{label}</span></li>)}</ol><p className="registration-signature">Santa Fe · Argentina</p>
    </aside>
    <div className="registration-form-wrap"><div className="registration-progress"><span>Paso {step + 1} de 6</span><span>{registrationSteps[step]}</span><div role="progressbar" aria-label="Progreso del registro" aria-valuemin={1} aria-valuemax={6} aria-valuenow={step + 1}><span style={{ width: `${(step + 1) / 6 * 100}%` }} /></div></div>
      <form className="registration-form" onSubmit={submit} aria-busy={busy}><fieldset disabled={busy} className="registration-fields"><legend className="registration-sr-only">{registrationSteps[step]}</legend><div key={step} className={`registration-stage registration-direction-${direction}`}><p className="registration-kicker">{String(step + 1).padStart(2, "0")} / {registrationSteps[step]}</p><h2 ref={heading} tabIndex={-1}>{copy[step][0]}</h2><p className="registration-stage-description">{copy[step][1]}</p>
        {step === 0 && <><div className="registration-row"><Field label="Nombre" autoComplete="given-name" value={form.nombre} onChange={set("nombre")} maxLength={100} required /><Field label="Apellido" autoComplete="family-name" value={form.apellido} onChange={set("apellido")} maxLength={100} required /></div><Field label="Correo electrónico" type="email" autoComplete="email" value={form.email} onChange={set("email")} maxLength={254} required /><p className="registration-field-help">Te enviaremos un enlace para verificar que este correo es tuyo.</p>
          <div className="registration-photo"><div className="registration-photo-preview">{photo ? <img src={photo.url} alt="Vista previa de tu foto" width={80} height={80} /> : <Camera size={25} strokeWidth={1.4} aria-hidden="true" />}</div><div><label className="registration-photo-title">Tu foto de perfil <span>Opcional</span></label><p>Una imagen para tu espacio personal.</p><button type="button" onClick={() => fileInput.current?.click()}>{preparing ? "Preparando foto…" : photo ? "Elegir otra foto" : "Subir desde mi dispositivo"}</button><small>JPEG, PNG o WebP · Hasta 2 MiB</small></div>{photo && <button type="button" className="registration-photo-remove" aria-label="Quitar foto seleccionada" onClick={() => setPhoto(null)}><X size={16} aria-hidden="true" /></button>}<input ref={fileInput} type="file" aria-label="Seleccionar foto de perfil" accept="image/jpeg,image/png,image/webp" hidden onChange={event => { selectPhoto(event.target.files?.[0]); event.target.value = ""; }} /></div>
        </>}
        {step === 1 && <><LocationFields initialCity={form.city} initialDepartment={form.department} onDepartmentChange={department => setForm(value => ({ ...value, department }))} onChange={city => setForm(value => ({ ...value, city: city || "" }))} /><div className="registration-row"><Field label="Género (opcional)" value={form.genero} onChange={set("genero")}><option value="">Sin indicar</option><option value="masculino">Masculino</option><option value="femenino">Femenino</option><option value="otro">Otro</option><option value="prefiero_no_decir">Prefiero no decirlo</option></Field><Field label="Teléfono (opcional)" type="tel" autoComplete="tel" value={form.telefono} onChange={set("telefono")} maxLength={20} /></div><Field label="Fecha de nacimiento" type="date" autoComplete="bday" max={new Date().toISOString().slice(0, 10)} value={form.fechaNacimiento} onChange={set("fechaNacimiento")} required /></>}
        {step === 2 && <><div className="registration-occupation"><BriefcaseBusiness size={37} strokeWidth={1.1} aria-hidden="true" /><p>Cada experiencia tiene algo para aportar.</p></div><Field label="¿A qué te dedicás? (opcional)" value={form.profesion} onChange={set("profesion")} maxLength={150} autoComplete="organization-title" placeholder="Ej.: docente, comerciante, estudiante…" /><p className="registration-field-help">Podés contar tu profesión, oficio o actividad. Si preferís, continuá sin completar este dato.</p></>}
        {step === 3 && <><div className="registration-password"><Field label="Contraseña" type={visible ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={set("password")} required minLength={15} maxLength={72} /><button type="button" aria-label={visible ? "Ocultar contraseñas" : "Mostrar contraseñas"} aria-pressed={visible} onClick={() => setVisible(value => !value)}>{visible ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button></div><Field label="Repetí tu contraseña" type={visible ? "text" : "password"} autoComplete="new-password" value={form.confirmation} onChange={set("confirmation")} required maxLength={72} /><ul className="registration-password-rules"><li className={form.password.length >= 15 ? "is-met" : ""}><Check size={14} aria-hidden="true" />Al menos 15 caracteres</li><li className={form.password && new TextEncoder().encode(form.password).length <= 72 ? "is-met" : ""}><Check size={14} aria-hidden="true" />Hasta 72 bytes; los emojis pueden ocupar más de uno</li><li className={form.password && form.password === form.confirmation ? "is-met" : ""}><Check size={14} aria-hidden="true" />Ambas contraseñas coinciden</li></ul><p className="registration-security-note"><LockKeyhole size={16} aria-hidden="true" />Elegí una contraseña que uses solo para esta cuenta.</p></>}
        {step === 4 && <><Privacy /><label className="registration-consent"><input type="checkbox" checked={form.aceptaPrivacidad} required onChange={event => setForm(value => ({ ...value, aceptaPrivacidad: event.target.checked }))} /><span>Leí el aviso de privacidad y autorizo el tratamiento de mis datos para las finalidades informadas.</span></label><p className="registration-consent-note">Vos elegís cuándo responder una encuesta, enviar una propuesta o solicitar tu afiliación.</p></>}
      </div></fieldset>
      <div ref={challengeRef} />
      <div ref={errorRef} tabIndex={-1} className="registration-feedback"><Feedback error={problem} />{!account.api.configured && <p role="status">El registro todavía no está disponible en este entorno. Podés seguir recorriendo el sitio.</p>}{action.error && step === 4 && <button type="button" className="registration-review" disabled={busy} onClick={() => go(0)}>Revisar mis datos</button>}</div>
      <div className="registration-actions">{step > 0 ? <button type="button" className="registration-previous" disabled={busy} onClick={() => go(step - 1)}><ArrowLeft size={17} aria-hidden="true" />Anterior</button> : <span className="registration-optional-note">Tu foto es opcional.</span>}<button type="submit" className="registration-next" disabled={busy || (step === 4 && !account.api.configured)}>{action.pending ? "Creando tu cuenta…" : step === 4 ? "Aceptar y crear mi cuenta" : "Continuar"}<ArrowRight size={17} aria-hidden="true" /></button></div>
      <p className="registration-login">¿Ya tenés una cuenta? <LoginLink>Iniciá sesión</LoginLink></p>
      </form>
    </div>
  </div></section>;
}
