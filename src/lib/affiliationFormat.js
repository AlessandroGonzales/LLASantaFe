export const affiliationLabels = { pendiente: "Pendiente", en_revision: "En revisión", aprobada: "Aprobada", rechazada: "Rechazada" };
const dates = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Argentina/Buenos_Aires" });
export function affiliationDate(value) { return value && Number.isFinite(Date.parse(value)) ? dates.format(new Date(value)) : "Sin registro"; }
export const affiliationReturn = "/sumate#sumate-formulario";
export function accountReturn(value) {
  return [affiliationReturn, "/administracion/afiliaciones"].includes(value) || (typeof value === "string" && /^\/encuestas(?:\/[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12})?$/i.test(value)) ? value : "/mi-cuenta";
}
