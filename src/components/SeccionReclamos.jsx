import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import rosarioPreview from "../assets/reclamos-rosario-preview.jpg";

// Agregar nuevas ciudades cuando sus plataformas estén disponibles.
const ciudades = [
  {
    id: "rosario",
    nombre: "Rosario",
    url: "https://llareclamosrosario.com/",
    dominio: "llareclamosrosario.com",
    imagen: rosarioPreview,
    descripcion: "Reportá problemas de tu barrio y consultá el seguimiento de los reclamos en el mapa de la ciudad.",
  },
];

export default function SeccionReclamos() {
  useEffect(() => {
    const previousTitle = document.title;
    const title = "Reclamos por ciudad | La Libertad Avanza Santa Fe";
    const description = "Encontrá la plataforma de reclamos de tu ciudad en Santa Fe. Accedé al sitio de Rosario para reportar problemas y consultar su seguimiento.";
    const pageUrl = "https://www.lalibertadavanzasantafe.com/reclamos";
    const cleanups = [];
    function update(selector, tag, attributes) {
      let element = document.head.querySelector(selector);
      const created = !element;
      if (created) {
        element = document.createElement(tag);
        document.head.appendChild(element);
      }
      const previous = Object.keys(attributes).map((key) => [key, element.getAttribute(key)]);
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
      cleanups.push(() => {
        if (created) element.remove();
        else previous.forEach(([key, value]) => value === null ? element.removeAttribute(key) : element.setAttribute(key, value));
      });
    }
    document.title = title;
    update('link[rel="canonical"]', "link", { rel: "canonical", href: pageUrl });
    Object.entries({ description, "og:title": title, "og:description": description, "og:url": pageUrl, "twitter:title": title, "twitter:description": description }).forEach(([name, content]) => {
      const attribute = name.startsWith("og:") ? "property" : "name";
      update(`meta[${attribute}="${name}"]`, "meta", { [attribute]: name, content });
    });
    return () => {
      document.title = previousTitle;
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <section aria-labelledby="reclamos-heading" className="bg-liberty-bg text-liberty-text px-6 pt-28 pb-20 md:px-12 md:pt-36 md:pb-28">
      <div className="max-w-6xl mx-auto">
        <header className="max-w-2xl mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-liberty-primary ">Cerca de tu ciudad</p>
          <h1 id="reclamos-heading" className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">Reclamos</h1>
          <p className="text-base md:text-lg leading-relaxed text-liberty-text-secondary">
            Encontrá el espacio para hacer reclamos sobre tu ciudad y seguir su recorrido.
            Acá reunimos las plataformas disponibles en la provincia de Santa Fe.
          </p>
        </header>

        <div className="space-y-6">
          {ciudades.map((ciudad) => (
            <article key={ciudad.id} aria-labelledby={`reclamos-${ciudad.id}`} className="grid lg:grid-cols-[1.4fr_1fr] overflow-hidden rounded-2xl border border-liberty-border bg-liberty-card">
              <a href={ciudad.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir la página de reclamos de ${ciudad.nombre} (nueva pestaña)`} className="block bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white">
                <img src={ciudad.imagen} alt={`Vista previa del sitio de reclamos de ${ciudad.nombre}`} width="1200" height="750" decoding="async" className="block w-full h-auto" />
              </a>
              <div className="flex flex-col justify-center items-start p-6 md:p-10 min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-liberty-primary mb-3">Plataforma disponible</p>
                <h2 id={`reclamos-${ciudad.id}`} className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">{ciudad.nombre}</h2>
                <p className="text-base leading-relaxed text-liberty-text-secondary mb-6">{ciudad.descripcion}</p>
                <a href={ciudad.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-liberty-border px-5 py-3 text-xs font-bold uppercase tracking-widest hover:border-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  Ir a reclamos <ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> de {ciudad.nombre} (nueva pestaña)</span>
                </a>
                <p className="mt-4 text-xs text-liberty-text-secondary break-all">{ciudad.dominio}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm leading-relaxed text-liberty-text-secondary">Por el momento, la plataforma está disponible en Rosario. Las demás ciudades se incorporarán a medida que cuenten con su propio sitio de reclamos.</p>
      </div>
    </section>
  );
}
