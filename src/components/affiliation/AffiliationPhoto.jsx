import { useState } from "react";
import { affiliationPhotoSource } from "../../lib/affiliationFormat.js";

export default function AffiliationPhoto({ item, large = false }) {
  const source = affiliationPhotoSource(item.fotoPerfil), [failed, setFailed] = useState(null);
  return <span className={`af-avatar${large ? " af-avatar-large" : ""}`} aria-hidden="true">
    {source && failed !== source ? <img src={source} alt="" width={80} height={80} decoding="async" onError={() => setFailed(source)} /> : `${item.nombre.slice(0, 1)}${item.apellido.slice(0, 1)}`}
  </span>;
}
