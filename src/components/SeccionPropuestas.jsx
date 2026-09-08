import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { m, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import fotopropuestas from "../assets/fotopropuestas.webp";
import rominapropuestas from "../assets/rominapropuestas.webp";
import tercerafoto from "../assets/lla.webp";
import { propuestasData } from "../data/propuestasData";

const SITE_URL = "https://www.lalibertadavanzasantafe.com";
const PAGE_URL = `${SITE_URL}/propuestas`;
const PAGE_TITLE = "Propuestas para Santa Fe | La Libertad Avanza Santa Fe";
const PAGE_DESCRIPTION = "Conocé las propuestas de La Libertad Avanza para transformar Santa Fe: seguridad, producción, reducción de impuestos y reforma del Estado.";

const alcances = [
  { id: "todos", label: "Todas" },
  { id: "provincial", label: "Provincia" },
  { id: "rosario", label: "Rosario" },
  { id: "santa-fe", label: "Santa Fe capital" },
];

const categorias = [
  { id: "todas", label: "Todos los ejes" },
  { id: "seguridad", label: "Seguridad y orden" },
  { id: "economia", label: "Economía y producción" },
  { id: "burocracia", label: "Reforma del Estado" },
];

const pilares = [
  { numero: "01", titulo: "Gasto político", texto: "El ahorro fiscal generado por el achicamiento del Estado vuelve al bolsillo de los contribuyentes." },
  { numero: "02", titulo: "Sector privado", texto: "Eliminación de trabas regulatorias, tasas obsoletas e impuestos distorsivos a la producción." },
  { numero: "03", titulo: "Orden institucional", texto: "Respaldo político e institucional para recuperar la seguridad y el control de las calles." },
];

const categoriaLabels = { seguridad: "Seguridad", economia: "Economía", burocracia: "Reforma" };
const alcanceLabels = { provincial: "Provincia", rosario: "Rosario", "santa-fe": "Santa Fe capital" };

function updateMetaTag(attribute, name, content) {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  const wasCreated = !element;
  const previousContent = element?.getAttribute("content");
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
  return () => {
    if (wasCreated) element.remove();
    else if (previousContent === null) element.removeAttribute("content");
    else element.setAttribute("content", previousContent);
  };
}

function updateCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');
  const wasCreated = !element;
  const previousHref = element?.getAttribute("href");
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = url;
  return () => {
    if (wasCreated) element.remove();
    else if (previousHref === null) element.removeAttribute("href");
    else element.setAttribute("href", previousHref);
  };
}

function usePropuestasMetadata() {
  useEffect(() => {
    const previousTitle = document.title;
    const imageUrl = `${SITE_URL}${fotopropuestas}`;
    const cleanups = [
      updateCanonical(PAGE_URL),
      updateMetaTag("name", "description", PAGE_DESCRIPTION),
      updateMetaTag("name", "robots", "index, follow"),
      updateMetaTag("property", "og:type", "website"),
      updateMetaTag("property", "og:title", PAGE_TITLE),
      updateMetaTag("property", "og:description", PAGE_DESCRIPTION),
      updateMetaTag("property", "og:url", PAGE_URL),
      updateMetaTag("property", "og:image", imageUrl),
      updateMetaTag("name", "twitter:title", PAGE_TITLE),
      updateMetaTag("name", "twitter:description", PAGE_DESCRIPTION),
      updateMetaTag("name", "twitter:image", imageUrl),
    ];
    document.title = PAGE_TITLE;
    const structuredData = document.createElement("script");
    structuredData.id = "propuestas-structured-data";
    structuredData.type = "application/ld+json";
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: PAGE_URL,
      inLanguage: "es-AR",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: propuestasData.length,
        itemListElement: propuestasData.map((propuesta, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/propuesta/${propuesta.id}`,
          name: propuesta.titulo,
        })),
      },
    });
    document.head.querySelector("#propuestas-structured-data")?.remove();
    document.head.appendChild(structuredData);
    return () => {
      document.title = previousTitle;
      structuredData.remove();
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, []);
}

function getHasAnimated() {
  try {
    return sessionStorage.getItem("seccionPropuestas_animated") === "true";
  } catch {
    return false;
  }
}

export default function SeccionPropuestas() {
  const [alcanceFiltro, setAlcanceFiltro] = useState("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [hasAnimated] = useState(getHasAnimated);
  const shouldReduceMotion = useReducedMotion();
  usePropuestasMetadata();

  const propuestasFiltradas = useMemo(() => propuestasData.filter((propuesta) => {
    const matchesAlcance = alcanceFiltro === "todos" || propuesta.alcance === alcanceFiltro;
    const matchesCategoria = categoriaFiltro === "todas" || propuesta.categoria === categoriaFiltro;
    return matchesAlcance && matchesCategoria;
  }), [alcanceFiltro, categoriaFiltro]);

  const skipEntranceMotion = hasAnimated || shouldReduceMotion;
  const markAsAnimated = () => {
    try {
      sessionStorage.setItem("seccionPropuestas_animated", "true");
    } catch {
      // La navegación continúa si el almacenamiento está bloqueado.
    }
  };

  return (
    <section className="overflow-hidden bg-liberty-bg text-white">
      <header className="relative isolate flex min-h-[80svh] items-end overflow-hidden  ">
        <img src={fotopropuestas} alt="Militantes de La Libertad Avanza Santa Fe durante un encuentro" width="1280" height="720" loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,3,20,0.24)_0%,rgba(12,3,20,0.48)_43%,#1E082D_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,4,29,0.72)_0%,transparent_70%)]" />
        <m.div
          onViewportEnter={markAsAnimated}
          initial={skipEntranceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: skipEntranceMotion ? 0 : 0.8, ease: "easeOut" }}
          className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-32 sm:px-8 md:pb-20 lg:px-12"
        >
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-liberty-primary sm:text-sm">Propuestas para Santa Fe</p>
          <h1 className="max-w-5xl text-[clamp(2.8rem,4vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.055em] text-white">
            Un plan para<span className="block text-liberty-primary">transformar.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg md:text-xl">Reformas basadas en la libertad económica, el orden institucional y un Estado al servicio de los santafesinos.</p>
          <a href="#propuestas-listado" className="mt-9 inline-flex min-h-12 items-center gap-3 border-b border-white/60 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-liberty-primary hover:text-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Explorar propuestas <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </a>
        </m.div>
      </header>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <section aria-labelledby="principios-title" className="border-b border-white/10 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-liberty-primary">El propósito</p>
              <h2 id="principios-title" className="mt-5 max-w-xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">Menos privilegios. Más libertad.</h2>
            </div>
            <ol className="border-t border-white/15">
              {pilares.map((pilar) => (
                <li key={pilar.numero} className="grid gap-3 border-b border-white/15 py-7 sm:grid-cols-[3rem_0.65fr_1.35fr] sm:gap-6">
                  <span className="text-xs font-bold text-liberty-primary">{pilar.numero}</span>
                  <h3 className="text-lg font-black uppercase tracking-tight">{pilar.titulo}</h3>
                  <p className="max-w-xl text-sm leading-relaxed text-liberty-text-secondary sm:text-base">{pilar.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-label="Convicción y futuro" className="py-20 md:py-28">
          <div className="grid auto-rows-[18rem] gap-3 sm:auto-rows-[24rem] lg:grid-cols-12 lg:grid-rows-[38rem]">
            <figure className="group relative overflow-hidden bg-liberty-card lg:col-span-7">
              <img src={rominapropuestas} alt="Dirigente de La Libertad Avanza durante una actividad pública" width="1200" height="1600" loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition-transform duration-700 motion-safe:group-hover:scale-[1.02]" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <figcaption className="absolute bottom-6 left-6 text-xs font-bold uppercase tracking-[0.28em] text-white md:bottom-8 md:left-8">Convicción</figcaption>
            </figure>
            <figure className="group relative overflow-hidden bg-liberty-card lg:col-span-5">
              <img src={tercerafoto} alt="Encuentro de La Libertad Avanza con militantes y dirigentes" width="870" height="580" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <figcaption className="absolute bottom-6 left-6 text-xs font-bold uppercase tracking-[0.28em] text-white md:bottom-8 md:left-8">Futuro</figcaption>
            </figure>
          </div>
          <blockquote className="ml-auto max-w-3xl py-14 text-right text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl md:py-20 md:text-3xl">
            “No vinimos a guiar corderos, vinimos a despertar leones.”
            <footer className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-liberty-primary">La Libertad Avanza Santa Fe</footer>
          </blockquote>
        </section>
      </div>

      <section id="propuestas-listado" aria-labelledby="propuestas-title" className="scroll-mt-20 border-t border-white/10 bg-black/10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-liberty-primary">El plan</p>
            <h2 id="propuestas-title" className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl">Propuestas</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-liberty-text-secondary md:text-lg">Explorá las iniciativas según el territorio y el eje que más te interese.</p>
          </div>

          <div className="mt-12 grid gap-8 border-y border-white/15 py-8 lg:grid-cols-2 lg:gap-16">
            <fieldset>
              <legend className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/65">Territorio</legend>
              <div className="flex flex-wrap gap-2">
                {alcances.map((alcance) => {
                  const isActive = alcanceFiltro === alcance.id;
                  return <button key={alcance.id} type="button" aria-pressed={isActive} onClick={() => setAlcanceFiltro(alcance.id)} className={`min-h-11 rounded-full border px-5 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${isActive ? "border-liberty-primary bg-liberty-primary text-liberty-bg" : "border-white/20 text-white hover:border-white/60"}`}>{alcance.label}</button>;
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/65">Eje temático</legend>
              <div className="flex flex-wrap gap-2">
                {categorias.map((categoria) => {
                  const isActive = categoriaFiltro === categoria.id;
                  return <button key={categoria.id} type="button" aria-pressed={isActive} onClick={() => setCategoriaFiltro(categoria.id)} className={`min-h-11 rounded-full border px-5 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${isActive ? "border-liberty-primary bg-liberty-primary text-liberty-bg" : "border-white/20 text-white hover:border-white/60"}`}>{categoria.label}</button>;
                })}
              </div>
            </fieldset>
          </div>

          {propuestasFiltradas.length > 0 ? (
            <ul >
              {propuestasFiltradas.map((item, index) => (
                <li key={item.id} className="border-b border-white/15">
                  <Link to={`/propuesta/${item.id}`} aria-label={`Ver propuesta: ${item.titulo}`} className="group grid gap-6 py-9 transition-colors hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white md:grid-cols-[4rem_1fr_auto] md:items-start md:px-4 lg:py-12">
                    <span aria-hidden="true" className="text-sm font-bold text-liberty-primary">{String(index + 1).padStart(2, "0")}</span>
                    <div className="max-w-3xl">
                      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.18em]">
                        <span className="text-liberty-primary">{categoriaLabels[item.categoria]}</span>
                        <span className="text-white/55">{alcanceLabels[item.alcance]}</span>
                      </div>
                      <h3 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">{item.titulo}</h3>
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-liberty-text-secondary sm:text-base">{item.bajada}</p>
                    </div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors group-hover:border-liberty-primary group-hover:bg-liberty-primary group-hover:text-liberty-bg md:mt-6">
                      <ArrowRight aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 border-y border-white/15 py-16 text-center">
              <p className="text-lg text-liberty-text-secondary">No hay propuestas para esta combinación de filtros.</p>
              <button type="button" onClick={() => { setAlcanceFiltro("todos"); setCategoriaFiltro("todas"); }} className="mt-6 min-h-11 border-b border-liberty-primary px-2 py-2 text-sm font-bold uppercase tracking-[0.14em] text-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Limpiar filtros</button>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
