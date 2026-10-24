import { useEffect, useState } from "react";
import { account } from "../../lib/backend.js";
import { ApiError } from "../../lib/apiClient.js";
import { Field, Feedback } from "./AccountForm.jsx";

export default function LocationFields({ onChange, hasCurrent = false }) {
  const [departments, setDepartments] = useState([]), [cities, setCities] = useState([]);
  const [department, setDepartment] = useState("");
  const [error, setError] = useState(null), [loading, setLoading] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    account.api.request("/api/Departamento", { signal: controller.signal }).then(items => {
      if (!Array.isArray(items) || items.some(item => !item.idDepartamento || typeof item.nombre !== "string")) throw new ApiError("No se pudo cargar el catálogo de departamentos.");
      setDepartments(items);
    })
      .catch(problem => { if (!controller.signal.aborted) setError(problem); });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!department) return;
    const controller = new AbortController();
    account.api.request(`/api/Ciudad?departamentoId=${encodeURIComponent(department)}`, { signal: controller.signal })
      .then(items => {
        if (!Array.isArray(items) || items.some(item => !item.idCiudad || typeof item.nombre !== "string")) throw new ApiError("No se pudo cargar el catálogo de localidades.");
        setCities(items);
      }).catch(problem => { if (!controller.signal.aborted) setError(problem); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [department]);
  return <fieldset className="account-location"><legend>Localidad (opcional)</legend>
    <p className="account-help">{hasCurrent ? "Podés conservar tu localidad o seleccionar una nueva." : "Elegí un departamento para ver sus localidades."}</p>
    <div className="account-grid">
      <Field label="Departamento" value={department} onChange={event => {
        setDepartment(event.target.value); setCities([]); setError(null); setLoading(Boolean(event.target.value)); onChange(undefined);
      }}>
        <option value="">{hasCurrent ? "Conservar localidad actual" : "Sin seleccionar"}</option>
        {departments.map(item => <option key={item.idDepartamento} value={item.idDepartamento}>{item.nombre}</option>)}
      </Field>
      <Field label="Localidad" defaultValue="" key={department} disabled={!department || loading}
        onChange={event => onChange(event.target.value || undefined)}>
        <option value="">{loading ? "Cargando localidades…" : "Seleccionar localidad"}</option>
        {cities.map(item => <option key={item.idCiudad} value={item.idCiudad}>{item.nombre}</option>)}
      </Field>
    </div>
    {hasCurrent && <button className="account-link-button" type="button" onClick={() => { setDepartment(""); setCities([]); onChange(null); }}>Quitar la localidad de mi perfil</button>}
    <Feedback error={error} />
  </fieldset>;
}
