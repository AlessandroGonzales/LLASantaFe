import SectionTitle from "../components/SectionTitle.jsx";
import { useCallback, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowUpRight, Check, ChevronDown, Pencil, ShieldCheck } from "lucide-react";
import { account } from "../lib/backend.js";
import { useAccount } from "../hooks/useAccount.js";
import { useAccountAction } from "../hooks/useAccountAction.js";
import { Field, Feedback } from "../components/account/AccountForm.jsx";
import ProfilePhotoEditor from "../components/account/ProfilePhotoEditor.jsx";
import LocationFields from "../components/account/LocationFields.jsx";
import "./MisDatos.css";

const genders = { masculino: "Masculino", femenino: "Femenino", otro: "Otro", prefiero_no_decir: "Prefiero no decirlo" };
function ProfileFields({ profile, blocked, onWorking }) {
  const action = useAccountAction(), [photoBusy, setPhotoBusy] = useState(false);
  const [form, setForm] = useState({ nombre: profile.nombre, apellido: profile.apellido, telefono: profile.telefono || "" });
  const [location, setLocation] = useState(null);
  const update = name => event => setForm(current => ({ ...current, [name]: event.target.value }));
  const busy = action.busy || blocked;
  const reportPhotoBusy = useCallback(value => { setPhotoBusy(value); onWorking(value); }, [onWorking]);
  function submit(event) {
    event.preventDefault(); if (photoBusy || busy) return;
    action.run(async signal => {
      onWorking(true);
      try {
        const changes = {};
        for (const key of ["nombre", "apellido", "telefono"]) {
          const value = form[key].trim() || null;
          if (value !== (profile[key] ?? null)) changes[key] = value;
        }
        if (location) {
          if (location.department && !location.city) throw new Error("Elegí una localidad para guardar el cambio.");
          if (location.city !== undefined && location.city !== (profile.ciudadId || null)) changes.ciudadId = location.city;
        }
        if (!Object.keys(changes).length) throw new Error("No hay cambios para guardar.");
        await account.patchProfile(changes, signal);
        const fresh = account.getSnapshot().profile;
        if (!signal.aborted && fresh) { setForm({ nombre: fresh.nombre, apellido: fresh.apellido, telefono: fresh.telefono || "" }); setLocation(null); }
      } finally { if (!signal.aborted) onWorking(false); }
    }, "Tus datos se guardaron.");
  }
  return <form className="personal-form" onSubmit={submit} aria-busy={busy || photoBusy}>
    <fieldset className="personal-columns" disabled={busy}><legend className="personal-sr-only">Datos del perfil</legend>
      <section className="personal-column" aria-labelledby="personal-contact-title"><h2 id="personal-contact-title">Identidad y contacto</h2>
        <ProfilePhotoEditor disabled={busy} onBusyChange={reportPhotoBusy} />
        <div className="personal-row"><Field label="Nombre" autoComplete="given-name" required maxLength={100} value={form.nombre} onChange={update("nombre")} /><Field label="Apellido" autoComplete="family-name" required maxLength={100} value={form.apellido} onChange={update("apellido")} /></div>
        <Field label="Correo electrónico" type="email" value={profile.email} readOnly />
        {profile.emailVerificado ? <p className="personal-email-status"><ShieldCheck size={13} aria-hidden="true" />Correo verificado</p> : <p className="personal-email-status"><Link to="/verificar-email">Verificar mi correo</Link></p>}
        <Field label="Teléfono (opcional)" type="tel" autoComplete="tel" maxLength={20} value={form.telefono} onChange={update("telefono")} />
      </section>
      <section className="personal-column personal-information" aria-labelledby="personal-info-title"><h2 id="personal-info-title">Información personal</h2>
        <dl className="personal-facts"><div><dt>Género</dt><dd>{genders[profile.genero] || "Sin indicar"}</dd></div><div><dt>Fecha de nacimiento</dt><dd>{profile.fechaNacimiento?.split("-").reverse().join("/") || "Sin indicar"}</dd></div><div className="personal-profession"><dt>Profesión</dt><dd>{profile.profesion || "Sin indicar"}</dd></div></dl>
        <div className="personal-location"><div className="personal-location-heading"><div><p>Localidad</p><strong>{profile.ciudadNombre || "Sin indicar"}</strong></div>{!location && <button type="button" className="personal-text-button" onClick={() => setLocation({ department: profile.departamentoId || "", city: profile.ciudadId || null })}><Pencil size={13} aria-hidden="true" />{profile.ciudadId ? "Cambiar" : "Agregar"}</button>}</div>
          {location && <div className="personal-location-edit"><LocationFields initialDepartment={location.department} initialCity={location.city || ""} hasCurrent={Boolean(profile.ciudadId)} onDepartmentChange={department => setLocation(value => ({ ...value, department }))} onChange={city => setLocation(value => ({ ...value, city }))} /><button type="button" className="personal-text-button" onClick={() => setLocation(null)}>Cancelar cambio de localidad</button></div>}
        </div>
      </section>
    </fieldset>
    <div className="personal-save"><div aria-live="polite"><Feedback {...action} /></div><button type="submit" className="personal-primary" disabled={busy || photoBusy}>{action.pending ? "Guardando…" : "Guardar cambios"}<Check size={16} aria-hidden="true" /></button></div>
  </form>;
}
export default function MisDatos() {
  const state = useAccount(), action = useAccountAction(), navigate = useNavigate();
  const [confirm, setConfirm] = useState(false), [expanded, setExpanded] = useState(false), [leaving, setLeaving] = useState(false), [working, setWorking] = useState(false);
  if (!state.authenticated && !leaving) return <Navigate to="/ingresar" replace state={{ notice: "Para acceder a tus datos, iniciá sesión." }} />;
  return <section className="personal-page"><div className="personal-wrap"><header className="personal-header"><SectionTitle as="h1" title="Mis datos" tone="light" /><p>Tu información, en un solo lugar.</p></header>
    <Feedback error={state.profileError} />
    {!state.profile && !state.profileError && <p className="personal-loading" role="status">Cargando tus datos…</p>}
    {state.profileError && <button type="button" className="personal-text-button" disabled={action.busy} onClick={() => action.run(() => account.loadProfile({ force: true }))}>Volver a cargar mis datos</button>}
    {state.profile && <ProfileFields key={`${state.sessionId}:${state.profile.idUsuario}`} profile={state.profile} blocked={action.busy} onWorking={setWorking} />}
    <section className="personal-deactivation" aria-labelledby="personal-deactivation-title"><div className="personal-deactivation-heading"><div><h2 id="personal-deactivation-title">Tu cuenta, tus decisiones.</h2><p>Podés desactivar tu acceso cuando lo decidas.</p></div><button type="button" className="personal-deactivation-toggle" aria-expanded={expanded} aria-controls="personal-deactivation-form" disabled={working || action.busy} onClick={() => { setExpanded(value => !value); setConfirm(false); }}>Dar de baja mi cuenta{expanded ? <ChevronDown size={16} aria-hidden="true" /> : <ArrowUpRight size={16} aria-hidden="true" />}</button></div>
      <Feedback {...action} />
      {expanded && <form id="personal-deactivation-form" className="personal-deactivation-form" onSubmit={event => {
        event.preventDefault(); if (!confirm || working || action.busy) return; setLeaving(true);
        action.run(async signal => {
          try { await account.deactivate(signal); }
          catch (error) { if (!signal.aborted) setLeaving(false); throw error; }
          if (!signal.aborted) navigate("/ingresar", { replace: true, state: { notice: "Tu cuenta fue dada de baja de la aplicación." } });
        });
      }}><p>La baja desactiva tu acceso. Se conservan tus registros de participación y esta acción no cancela una afiliación partidaria.</p><label><input type="checkbox" required checked={confirm} disabled={working || action.busy} onChange={event => setConfirm(event.target.checked)} /><span>Entiendo que no podré volver a ingresar ni registrar otra cuenta con este correo.</span></label><div><button type="button" className="personal-text-button" disabled={action.busy} onClick={() => { setExpanded(false); setConfirm(false); }}>Cancelar</button><button type="submit" className="personal-delete" disabled={!confirm || working || action.busy}>{action.pending ? "Procesando…" : "Confirmar baja de mi cuenta"}</button></div></form>}
    </section>
  </div></section>;
}
