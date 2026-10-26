import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { account } from "../../lib/backend.js";
import { prepareProfilePhoto } from "../../lib/profilePhoto.js";
import { useAccount } from "../../hooks/useAccount.js";
import { useAccountAction } from "../../hooks/useAccountAction.js";
import { Feedback } from "./AccountForm.jsx";
import Avatar from "./Avatar.jsx";
import "./ProfilePhoto.css";

export default function ProfilePhotoEditor({ disabled = false, onBusyChange }) {
  const state = useAccount(), action = useAccountAction(), input = useRef(null), pending = useRef(null);
  const [photo, setPhoto] = useState(null), [preparing, setPreparing] = useState(false), [error, setError] = useState(null);
  useEffect(() => () => pending.current?.abort(), []);
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.url); }, [photo]);
  async function select(file) {
    pending.current?.abort(); const controller = new AbortController(); pending.current = controller;
    setError(null); setPhoto(null); if (!file) { setPreparing(false); return; } setPreparing(true);
    try {
      const blob = await prepareProfilePhoto(file, controller.signal);
      if (!controller.signal.aborted) setPhoto({ blob, url: URL.createObjectURL(blob) });
    } catch (problem) { if (!controller.signal.aborted) setError(problem); }
    finally { if (!controller.signal.aborted) setPreparing(false); }
  }
  const working = action.busy || preparing;
  useEffect(() => { onBusyChange?.(working); }, [working, onBusyChange]);
  const busy = working || disabled;
  return <section className="profile-photo" aria-label="Foto de perfil">
    <Avatar preview={photo?.url} className="profile-avatar-large" />
    <div className="profile-photo-body">
      <div className="profile-photo-actions"><button type="button" className="account-secondary" disabled={busy} onClick={() => input.current?.click()}><Camera size={16} aria-hidden="true" />{preparing ? "Preparando…" : "Elegir foto"}</button>
        <input ref={input} type="file" className="profile-file" aria-label="Seleccionar foto de perfil" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={event => { select(event.target.files?.[0]); event.target.value = ""; }} />
        {photo && <><button type="button" className="profile-photo-save" disabled={busy} onClick={() => action.run(async signal => { await account.uploadPhoto(photo.blob, signal); setPhoto(null); }, "Foto actualizada.")}>{action.pending ? "Guardando…" : "Guardar foto"}</button><button type="button" className="profile-photo-cancel" aria-label="Descartar foto seleccionada" disabled={busy} onClick={() => setPhoto(null)}><X size={17} aria-hidden="true" /></button></>}
        {!photo && (state.profile?.fotoPerfilVersion || state.profile?.fotoPerfilUrl) && <button type="button" className="profile-photo-remove" disabled={busy} onClick={() => action.run(signal => account.removePhoto(signal), "Foto eliminada.")}>Quitar foto</button>}
      </div>
      <Feedback error={error || action.error || state.avatarError} success={action.success} />
      {state.avatarError && <button type="button" className="profile-photo-remove" disabled={busy} onClick={() => action.run(() => account.loadPhoto())}>Volver a cargar foto</button>}
    </div>
  </section>;
}
