import SectionTitle from "./SectionTitle.jsx";
import CitizenRequests from "./citizen/CitizenRequests.jsx";

export default function Propone() {
  return <section className="cr-page"><header className="cr-hero"><SectionTitle as="h1" title="Un espacio" accent="para tu propuesta." breakLine /><p>Compartí proyectos, sugerencias, consultas o inquietudes. Desde tu cuenta podés enviar una solicitud formal y seguir su respuesta.</p></header><CitizenRequests /></section>;
}
