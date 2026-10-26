import { useState } from "react";
import { useAccount } from "../../hooks/useAccount.js";

export default function Avatar({ preview, className = "" }) {
  const { profile, avatarUrl } = useAccount(), [failed, setFailed] = useState(null);
  const legacy = /^https:\/\//i.test(profile?.fotoPerfilUrl || "") ? profile.fotoPerfilUrl : null;
  const src = preview || avatarUrl || (!profile?.fotoPerfilVersion && legacy);
  const initials = `${profile?.nombre?.trim().charAt(0) || ""}${profile?.apellido?.trim().charAt(0) || ""}` || "U";
  return <span className={`profile-avatar ${className}`} aria-hidden="true">
    {src && failed !== src ? <img src={src} alt="" referrerPolicy="no-referrer" onError={() => setFailed(src)} /> : <span>{initials.toUpperCase()}</span>}
  </span>;
}
