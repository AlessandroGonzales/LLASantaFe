import LoginLink from "../components/account/LoginLink.jsx";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { account } from "../lib/backend.js";
import { getAccountCode, clearAccountCode, validateNewPassword } from "../lib/accountLinks.js";
import { useAccountAction } from "../hooks/useAccountAction.js";
import { AccountShell, Field, Feedback, SubmitButton, BusyForm } from "../components/account/AccountForm.jsx";
import "./Cuenta.css";

function ConfigNotice() {
  return !account.api.configured && <p role="status" className="account-message">El servicio de cuentas todavía no está disponible en este entorno. Podés seguir consultando el sitio.</p>;
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
    <p className="account-links"><LoginLink>Ir a ingresar</LoginLink></p>
  </AccountShell>;
}
function Recovery() {
  const action = useAccountAction(), [email, setEmail] = useState("");
  return <AccountShell title="Recuperar mi cuenta" description="Te enviaremos los pasos para elegir una nueva contraseña si la cuenta admite esta acción.">
    <ConfigNotice /><Feedback {...action} />
    <BusyForm busy={action.busy} onSubmit={event => { event.preventDefault(); action.run(signal => account.requestRecovery(email.trim(), signal), "Si la cuenta admite esta acción, recibirás un correo con los próximos pasos. Revisá también Spam."); }}>
      <Field label="Email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required maxLength={254} />
      <SubmitButton {...action} busy={action.busy || !account.api.configured}>Solicitar recuperación</SubmitButton>
    </BusyForm><p className="account-links"><LoginLink>Volver a ingresar</LoginLink></p>
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
    </BusyForm>}<p className="account-links"><LoginLink>Ir a ingresar</LoginLink></p>
  </AccountShell>;
}
export default function Cuenta() {
  const { pathname } = useLocation();
  if (pathname === "/verificar-email") return <VerifyEmail />;
  if (pathname === "/recuperar-cuenta") return <Recovery />;
  if (pathname === "/restablecer-password") return <ResetPassword />;
  return null;
}
