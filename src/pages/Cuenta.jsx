import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { account } from "../lib/backend.js";
import { getAccountCode, clearAccountCode, validateNewPassword } from "../lib/accountLinks.js";
import { accountReturn, affiliationReturn } from "../lib/affiliationFormat.js";
import { isAdministrator } from "../lib/affiliationService.js";
import { useAccount } from "../hooks/useAccount.js";
import { useAccountAction } from "../hooks/useAccountAction.js";
import { AccountShell, Field, Feedback, SubmitButton, BusyForm } from "../components/account/AccountForm.jsx";
import LocationFields from "../components/account/LocationFields.jsx";
import "./Cuenta.css";

function ConfigNotice() {
  return !account.api.configured && <p role="status" className="account-message">El servicio de cuentas todavía no está disponible en este entorno. Podés seguir consultando el sitio.</p>;
}
function Login() {
  const state = useAccount(), action = useAccountAction(), location = useLocation(), navigate = useNavigate();
  const [email, setEmail] = useState(""), [password, setPassword] = useState("");
  const destination = accountReturn(location.state?.returnTo);
  if (state.authenticated) return <Navigate to={destination} replace />;
  return <AccountShell title="Ingresar" description="Accedé con tu email verificado y tu contraseña.">
    <ConfigNotice /><Feedback {...action} success={action.success || location.state?.notice} />
    <BusyForm busy={action.busy} onSubmit={event => { event.preventDefault(); action.run(async signal => {
      await account.login({ email: email.trim(), password }, signal); setPassword(""); navigate(destination, { replace: true });
    }); }}>
      <Field label="Email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required maxLength={254} />
      <Field label="Contraseña" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required maxLength={72} />
      <SubmitButton {...action} busy={action.busy || !account.api.configured}>Ingresar</SubmitButton>
    </BusyForm>
    {action.error?.code === "email_not_verified" && <p><Link to="/verificar-email">Verificar mi email</Link></p>}
    <div className="account-links"><Link to="/recuperar-cuenta">Olvidé mi contraseña</Link><Link to="/registro" state={{ returnTo: destination }}>Crear una cuenta</Link></div>
  </AccountShell>;
}
function Register() {
  const state = useAccount(), action = useAccountAction();
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "", confirmation: "", telefono: "", genero: "", profesion: "", fotoPerfilUrl: "" });
  const [city, setCity] = useState(undefined);
  const update = name => event => setForm(current => ({ ...current, [name]: event.target.value }));
  if (state.authenticated) return <Navigate to="/mi-cuenta" replace />;
  return <AccountShell title="Crear una cuenta" description="Registrate para acceder a las funciones de participación. Crear una cuenta no solicita una afiliación.">
    <ConfigNotice /><Feedback {...action} />
    {action.success ? <div className="account-links"><Link to="/verificar-email">Verificar mi email</Link><Link to="/ingresar">Ir a ingresar</Link></div> : <BusyForm busy={action.busy} onSubmit={event => {
      event.preventDefault(); const birthDate = new FormData(event.currentTarget).get("fechaNacimiento"); action.run(async signal => {
        validateNewPassword(form.password, form.confirmation);
        if (typeof birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) throw new Error("Indicá tu fecha de nacimiento.");
        await account.register({ nombre: form.nombre.trim(), apellido: form.apellido.trim(), email: form.email.trim(),
          password: form.password, fechaNacimiento: birthDate, telefono: form.telefono.trim() || null,
          genero: form.genero || null, profesion: form.profesion.trim() || null, fotoPerfilUrl: form.fotoPerfilUrl.trim() || null, ciudadId: city || null }, signal);
        setForm(current => ({ ...current, password: "", confirmation: "" }));
      }, "Solicitud procesada. Si corresponde, recibirás un correo para verificar tu cuenta. Revisá también Spam.");
    }}>
      <div className="account-grid"><Field label="Nombre" autoComplete="given-name" value={form.nombre} onChange={update("nombre")} required maxLength={100} />
        <Field label="Apellido" autoComplete="family-name" value={form.apellido} onChange={update("apellido")} required maxLength={100} /></div>
      <Field label="Email" type="email" autoComplete="email" value={form.email} onChange={update("email")} required maxLength={254} />
      <p className="account-help">Elegí una contraseña de al menos 15 caracteres. Hasta 72 bytes UTF-8; los símbolos y emojis pueden ocupar varios bytes.</p>
      <div className="account-grid"><Field label="Contraseña" type="password" autoComplete="new-password" value={form.password} onChange={update("password")} required minLength={15} maxLength={72} />
        <Field label="Repetir contraseña" type="password" autoComplete="new-password" value={form.confirmation} onChange={update("confirmation")} required maxLength={72} /></div>
      <div className="account-grid"><Field label="Fecha de nacimiento" name="fechaNacimiento" type="date" autoComplete="bday" max={new Date().toISOString().slice(0, 10)} required />
        <Field label="Teléfono (opcional)" type="tel" autoComplete="tel" value={form.telefono} onChange={update("telefono")} maxLength={20} /></div>
      <div className="account-grid"><Field label="Género (opcional)" value={form.genero} onChange={update("genero")}>
        <option value="">Sin indicar</option><option value="masculino">Masculino</option><option value="femenino">Femenino</option><option value="otro">Otro</option><option value="prefiero_no_decir">Prefiero no decirlo</option>
      </Field><Field label="Profesión (opcional)" value={form.profesion} onChange={update("profesion")} maxLength={150} /></div>
      <Field label="URL HTTPS de foto de perfil (opcional)" type="url" value={form.fotoPerfilUrl} onChange={update("fotoPerfilUrl")} maxLength={2048} />
      {account.api.configured && <LocationFields onChange={setCity} />}
      <SubmitButton {...action} busy={action.busy || !account.api.configured}>Registrarme</SubmitButton>
    </BusyForm>}
    <p className="account-links"><Link to="/ingresar">Ya tengo una cuenta</Link></p>
  </AccountShell>;
}
function VerifyEmail() {
  const action = useAccountAction(), request = useAccountAction();
  const [code] = useState(() => getAccountCode("/verificar-email"));
  const [email, setEmail] = useState(""), [password, setPassword] = useState("");
  useEffect(() => () => clearAccountCode(), []);
  return <AccountShell title="Verificar mi email" description={code ? "Confirmá el registro con el email y la contraseña que elegiste." : "Abrí el enlace del correo de verificación. Si venció, podés solicitar uno nuevo."}>
    <ConfigNotice /><Feedback {...action} /><Feedback {...request} />
    <BusyForm busy={action.busy || request.busy} onSubmit={event => { event.preventDefault(); action.run(async signal => {
      await account.confirmEmail({ email: email.trim(), password, codigo: code }, signal); clearAccountCode(); setPassword("");
    }, "Email verificado. Ya podés ingresar con tu cuenta."); }}>
      <Field label="Email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required maxLength={254} />
      {code && !action.success && <><Field label="Contraseña del registro" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required maxLength={72} />
        <SubmitButton {...action} busy={action.busy || request.busy || !account.api.configured}>Confirmar email</SubmitButton></>}
    </BusyForm>
    {!action.success && <button className="account-secondary" type="button" disabled={action.busy || request.busy || !email.trim() || !account.api.configured} onClick={() => request.run(signal => account.requestVerification(email.trim(), signal), "Si la cuenta admite esta acción, recibirás un correo. Un enlace que sigue vigente se conserva.")}>Solicitar correo de verificación</button>}
    <p className="account-links"><Link to="/ingresar">Ir a ingresar</Link></p>
  </AccountShell>;
}
function Recovery() {
  const action = useAccountAction(), [email, setEmail] = useState("");
  return <AccountShell title="Recuperar mi cuenta" description="Te enviaremos los pasos para elegir una nueva contraseña si la cuenta admite esta acción.">
    <ConfigNotice /><Feedback {...action} />
    <BusyForm busy={action.busy} onSubmit={event => { event.preventDefault(); action.run(signal => account.requestRecovery(email.trim(), signal), "Si la cuenta admite esta acción, recibirás un correo con los próximos pasos. Revisá también Spam."); }}>
      <Field label="Email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required maxLength={254} />
      <SubmitButton {...action} busy={action.busy || !account.api.configured}>Solicitar recuperación</SubmitButton>
    </BusyForm><p className="account-links"><Link to="/ingresar">Volver a ingresar</Link></p>
  </AccountShell>;
}
function ResetPassword() {
  const action = useAccountAction();
  const [code] = useState(() => getAccountCode("/restablecer-password"));
  const [password, setPassword] = useState(""), [confirmation, setConfirmation] = useState("");
  useEffect(() => () => clearAccountCode(), []);
  return <AccountShell title="Elegir nueva contraseña" description="Al cambiarla, se cerrarán las sesiones anteriores de tu cuenta.">
    <ConfigNotice /><Feedback {...action} />
    {!code ? <p className="account-message">Abrí el enlace que recibiste por correo. <Link to="/recuperar-cuenta">Solicitar recuperación</Link></p> : !action.success && <BusyForm busy={action.busy} onSubmit={event => {
      event.preventDefault(); action.run(async signal => { validateNewPassword(password, confirmation);
        await account.resetPassword({ codigo: code, nuevaPassword: password }, signal); clearAccountCode(); setPassword(""); setConfirmation("");
      }, "Contraseña actualizada. Iniciá sesión con tu nueva contraseña.");
    }}>
      <Field label="Nueva contraseña" type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} required minLength={15} maxLength={72} />
      <Field label="Repetir contraseña" type="password" autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} required maxLength={72} />
      <SubmitButton {...action} busy={action.busy || !account.api.configured}>Cambiar contraseña</SubmitButton>
    </BusyForm>}<p className="account-links"><Link to="/ingresar">Ir a ingresar</Link></p>
  </AccountShell>;
}
function ProfileEditor({ profile }) {
  const action = useAccountAction();
  const [form, setForm] = useState({ nombre: profile.nombre, apellido: profile.apellido, telefono: profile.telefono || "", fotoPerfilUrl: profile.fotoPerfilUrl || "" });
  const [city, setCity] = useState(undefined);
  const update = name => event => setForm(current => ({ ...current, [name]: event.target.value }));
  return <BusyForm busy={action.busy} onSubmit={event => { event.preventDefault(); action.run(async signal => {
    const changes = {};
    for (const key of ["nombre", "apellido", "telefono", "fotoPerfilUrl"]) {
      const next = form[key].trim() || null;
      if (next !== (profile[key] ?? null)) changes[key] = next;
    }
    if (city !== undefined && city !== profile.ciudadId) changes.ciudadId = city;
    if (!Object.keys(changes).length) throw new Error("No hay cambios para guardar.");
    await account.patchProfile(changes, signal); setCity(undefined);
  }, "Datos actualizados."); }}>
    <h2>Mis datos</h2><Feedback {...action} />
    <div className="account-grid"><Field label="Nombre" autoComplete="given-name" value={form.nombre} onChange={update("nombre")} required maxLength={100} />
      <Field label="Apellido" autoComplete="family-name" value={form.apellido} onChange={update("apellido")} required maxLength={100} /></div>
    <Field label="Email" type="email" value={profile.email} readOnly />
    {!profile.emailVerificado && <p className="account-help">Tu email todavía no está verificado. <Link to="/verificar-email">Verificar email</Link></p>}
    <div className="account-grid"><Field label="Fecha de nacimiento" value={profile.fechaNacimiento?.split("-").reverse().join("/") || "Sin indicar"} readOnly />
      <Field label="Género" value={({ masculino: "Masculino", femenino: "Femenino", otro: "Otro", prefiero_no_decir: "Prefiero no decirlo" })[profile.genero] || "Sin indicar"} readOnly /></div>
    <Field label="Profesión" value={profile.profesion || "Sin indicar"} readOnly />
    <div className="account-grid"><Field label="Teléfono (opcional)" type="tel" autoComplete="tel" value={form.telefono} onChange={update("telefono")} maxLength={20} />
      <Field label="URL HTTPS de foto (opcional)" type="url" value={form.fotoPerfilUrl} onChange={update("fotoPerfilUrl")} maxLength={2048} /></div>
    <LocationFields onChange={setCity} hasCurrent={Boolean(profile.ciudadId)} />
    <SubmitButton {...action}>Guardar cambios</SubmitButton>
  </BusyForm>;
}
function Profile() {
  const state = useAccount(), action = useAccountAction(), navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [leaving, setLeaving] = useState(false);
  if (!state.authenticated && !leaving) return <Navigate to="/ingresar" replace state={{ notice: "Para acceder a tu cuenta, iniciá sesión." }} />;
  return <AccountShell title="Mi cuenta" description="Consultá tus datos y administrá tu acceso.">
    <Feedback {...action} /><Feedback error={state.profileError} />
    <div className="account-links"><Link to={affiliationReturn}>Mi solicitud de afiliación</Link><Link to="/encuestas">Encuestas</Link><Link to="/propone">Mis solicitudes ciudadanas</Link>
      {isAdministrator(state.profile) && <Link to="/administracion/afiliaciones">Administrar afiliaciones</Link>}</div>
    {state.profileStatus === "loading" && <p role="status">Cargando tu perfil…</p>}
    {state.profileError && <button type="button" className="account-secondary" disabled={action.busy} onClick={() => action.run(() => account.loadProfile({ force: true }))}>Volver a cargar el perfil</button>}
    {state.profile && <ProfileEditor key={state.profile.idUsuario} profile={state.profile} />}
    <div className="account-session"><button type="button" className="account-secondary" disabled={action.busy} onClick={() => { setLeaving(true); action.run(async signal => {
      let notice = "Se cerraron todas las sesiones de tu cuenta.";
      try { await account.logout(signal); } catch { notice = "Cerraste la sesión en este navegador. No pudimos confirmar el cierre en otros dispositivos."; }
      if (!signal.aborted) navigate("/ingresar", { replace: true, state: { notice } });
    }); }}>Cerrar todas mis sesiones</button></div>
    <details className="account-danger"><summary>Dar de baja mi cuenta</summary>
      <p>La baja desactiva tu acceso. Se conservan tus registros de participación y esta acción no cancela una afiliación partidaria.</p>
      <form onSubmit={event => { event.preventDefault(); if (!confirm) return; setLeaving(true); action.run(async signal => {
        try { await account.deactivate(signal); }
        catch (error) { if (!signal.aborted) setLeaving(false); throw error; }
        if (!signal.aborted) navigate("/ingresar", { replace: true, state: { notice: "Tu cuenta fue dada de baja de la aplicación." } });
      }); }}><label className="account-check"><input type="checkbox" checked={confirm} onChange={event => setConfirm(event.target.checked)} required />Entiendo que no podré volver a ingresar ni registrar otra cuenta con este correo.</label>
        <button className="account-delete" type="submit" disabled={!confirm || action.busy}>Confirmar baja de mi cuenta</button>
      </form>
    </details>
  </AccountShell>;
}
export default function Cuenta() {
  const { pathname } = useLocation();
  if (pathname === "/registro") return <Register />;
  if (pathname === "/verificar-email") return <VerifyEmail />;
  if (pathname === "/recuperar-cuenta") return <Recovery />;
  if (pathname === "/restablecer-password") return <ResetPassword />;
  if (pathname === "/mi-cuenta") return <Profile />;
  return <Login />;
}
