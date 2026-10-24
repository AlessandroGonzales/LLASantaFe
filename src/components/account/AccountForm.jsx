import { useId } from "react";
import { Link } from "react-router-dom";

export function AccountShell({ title, description, children }) {
  return <section className="account-page"><div className="account-card">
    <p className="account-eyebrow">Tu cuenta</p><h1>{title}</h1>
    {description && <p className="account-description">{description}</p>}
    {children}<Link className="account-home" to="/">Volver al inicio</Link>
  </div></section>;
}
export function Field({ label, children, ...props }) {
  const id = useId();
  return <div className="account-field"><label htmlFor={id}>{label}</label>
    {children ? <select {...props} id={id}>{children}</select> : <input {...props} id={id} />}
  </div>;
}
export function Feedback({ error, success }) {
  const details = [...new Set(Object.values(error?.errors || {}).flat().filter(item => typeof item === "string"))];
  return <>
    {error && <div role="alert" className="account-message account-error"><p>{error.message}</p>
      {details.length > 0 && <ul>{details.map(detail => <li key={detail}>{detail}</li>)}</ul>}
      {error.retryAfterSeconds > 0 && <p>Esperá {error.retryAfterSeconds} segundos antes de volver a intentar.</p>}
    </div>}
    {success && <p role="status" className="account-message account-success">{success}</p>}
  </>;
}
export function SubmitButton({ busy, pending, children }) {
  return <button type="submit" className="account-primary" disabled={busy}>{pending ? "Procesando…" : children}</button>;
}
export function BusyForm({ busy, children, onSubmit }) {
  return <form onSubmit={onSubmit} aria-busy={busy}><fieldset className="account-fields" disabled={busy}>{children}</fieldset></form>;
}
