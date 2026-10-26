import SectionTitle from "./SectionTitle.jsx";
import { useEffect, useRef, useState } from "react";
import { X, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { presidentesComunalesData } from "../data/presidentesComunales";
import aguila from "../assets/aguila.webp";

const linkClass = "inline-flex items-center justify-center gap-2 px-4 py-3 bg-liberty-card border border-liberty-border text-white text-sm font-bold hover:border-liberty-primary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

function Instagram() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" /></svg>;
}

function ProfileDialog({ profile, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return (
    <dialog ref={dialogRef} aria-labelledby="presidente-perfil-nombre" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className="m-auto p-0 w-[calc(100%-2rem)] max-w-[1400px] max-h-[90dvh] overflow-y-auto bg-liberty-bg text-white rounded-2xl border border-liberty-border backdrop:bg-black/80">
      <div className="relative flex flex-col lg:flex-row">
        <button type="button" autoFocus onClick={onClose} aria-label="Cerrar perfil" className="absolute top-4 right-4 z-10 p-3 rounded-full bg-black/70 text-white hover:bg-liberty-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><X aria-hidden="true" /></button>
        <div className="lg:w-1/2 bg-liberty-card">
          <img src={profile.foto || aguila} alt={profile.foto ? profile.nombre : ""} decoding="async" className={`w-full h-[40vh] lg:h-full lg:max-h-[85dvh] ${profile.foto ? "object-cover" : "object-contain p-12"}`} />
        </div>
        <div className="lg:w-1/2 min-w-0 p-6 md:p-12 bg-gradient-to-br from-liberty-bg to-liberty-surface">
          <p className="text-sm uppercase tracking-widest text-liberty-primary font-bold mb-4">{profile.cargo || "Presidente comunal"}</p>
          <h2 id="presidente-perfil-nombre" className="text-3xl md:text-5xl font-black uppercase tracking-tighter break-words mb-6">{profile.nombre}</h2>
          <dl className="grid sm:grid-cols-2 gap-4 py-6 border-y border-white/10 mb-8">
            <div><dt className="text-sm uppercase text-liberty-text-secondary">Localidad</dt><dd className="font-bold break-words">{profile.localidad}</dd></div>
            {profile.profesion && <div><dt className="text-sm uppercase text-liberty-text-secondary">Profesión</dt><dd className="font-bold break-words">{profile.profesion}</dd></div>}
            {profile.edad != null && <div><dt className="text-sm uppercase text-liberty-text-secondary">Edad</dt><dd className="font-bold">{profile.edad} años</dd></div>}
          </dl>
          {profile.descripcion && <div className="mb-8"><h3 className="text-sm font-black uppercase tracking-widest text-liberty-text-secondary mb-4">Visión y objetivos</h3><p className="text-base md:text-lg leading-relaxed whitespace-pre-line break-words">{profile.descripcion}</p></div>}
          <div className="flex flex-wrap gap-3">
            {profile.proyectos && <a href={profile.proyectos} target="_blank" rel="noopener noreferrer" className={linkClass}><ExternalLink size={18} aria-hidden="true" />Ver proyectos</a>}
            {profile.redes?.instagram && <a href={`https://www.instagram.com/${profile.redes.instagram.replace(/^@/, "")}/`} target="_blank" rel="noopener noreferrer" aria-label={`Instagram de ${profile.nombre}`} className={linkClass}><Instagram size={18} aria-hidden="true" /></a>}
            {profile.redes?.twitter && <a href={`https://x.com/${profile.redes.twitter.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" aria-label={`X de ${profile.nombre}`} className={linkClass}><X size={18} aria-hidden="true" /></a>}
            {profile.mail && <a href={`mailto:${profile.mail}`} aria-label={`Enviar email a ${profile.nombre}`} className={linkClass}><Mail size={18} aria-hidden="true" /></a>}
            {profile.telefono && <a href={`https://wa.me/${profile.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp de ${profile.nombre}`} className={linkClass}><Phone size={18} aria-hidden="true" /></a>}
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default function SeccionPresidentesComunales() {
  const [localidad, setLocalidad] = useState("");
  const [selected, setSelected] = useState(null);
  const localidades = [...new Set(presidentesComunalesData.map((profile) => profile.localidad).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  const profiles = presidentesComunalesData.filter((profile) => !localidad || profile.localidad === localidad);

  useEffect(() => {
    const previousTitle = document.title;
    const title = "Presidentes comunales | La Libertad Avanza Santa Fe";
    const description = "Conocé a los presidentes comunales de La Libertad Avanza Santa Fe, sus localidades, perfiles y vías de contacto.";
    const pageUrl = "https://www.lalibertadavanzasantafe.com/presidentes-comunales";
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
    <section aria-labelledby="presidentes-heading" className="relative w-full py-24 md:py-32 bg-liberty-bg text-white overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-20 mb-16 md:mb-24 text-center">

        <SectionTitle as="h1" title="Presidentes comunales" id="presidentes-heading" />
        <p className="text-base md:text-lg text-liberty-text-secondary max-w-2xl mx-auto">Conocé a nuestros presidentes comunales que estan dando la batalla contra la casta y defindiendo las ideas de la libertad.</p>
        {localidades.length > 0 && <div className="max-w-md mx-auto mt-10 text-left"><label htmlFor="presidentes-localidad" className="block text-sm font-bold uppercase tracking-widest mb-3">Filtrar por localidad</label><select id="presidentes-localidad" value={localidad} onChange={(event) => setLocalidad(event.target.value)} className="w-full p-4 rounded-xl bg-liberty-card border border-liberty-border text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><option value="">Todas las localidades</option>{localidades.map((place) => <option key={place} value={place}>{place}</option>)}</select></div>}
      </div>
      <div className="w-full px-4 md:px-12 lg:px-10 max-w-[1700px] mx-auto">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {profiles.map((profile) => <li key={profile.id}>
            <button type="button" onClick={() => setSelected(profile)} aria-haspopup="dialog" aria-label={`Ver perfil de ${profile.nombre}`} className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm group cursor-pointer border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-left bg-liberty-card">
              <img src={profile.foto || aguila} alt="" loading="lazy" decoding="async" className={`w-full h-full ${profile.foto ? "object-cover" : "object-contain p-12"}`} />
              <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" aria-hidden="true" />
              <span className="absolute bottom-6 inset-x-0 flex flex-col items-center text-center px-4">
                <span className="text-white text-sm md:text-base font-black uppercase tracking-widest break-words">{profile.nombre}</span>
                <span className="flex items-center gap-1 text-sm text-white mt-2"><MapPin size={14} aria-hidden="true" />{profile.localidad}</span>
                <span className="mt-6 text-liberty-primary font-bold text-sm uppercase tracking-wider">Ver perfil completo</span>
              </span>
            </button>
          </li>)}
        </ul>
        {!profiles.length && <p className="py-12 text-center text-liberty-text-secondary text-base">{presidentesComunalesData.length ? "No se encontraron representantes en esta localidad." : "Próximamente vas a poder conocer a nuestros presidentes comunales."}</p>}
      </div>
      {selected && <ProfileDialog profile={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
