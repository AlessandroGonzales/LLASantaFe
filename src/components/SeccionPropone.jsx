import SectionTitle from "./SectionTitle.jsx";
import CitizenRequests from "./citizen/CitizenRequests.jsx";

export default function Propone() {
  return <section className="cr-shell" aria-labelledby="propone-title"><div className="cr-page">
    <header className="cr-hero">
      <SectionTitle as="h1" id="propone-title" title="Queremos" accent="escucharte." tone="light" breakLine />
      <p>Las ideas empiezan con alguien que se anima a compartirlas. Acercanos tu propuesta, contanos qué necesita tu comunidad o hacenos una consulta.</p>
    </header>
    <CitizenRequests />
  </div></section>;
}
