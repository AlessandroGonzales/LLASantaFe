import { m, useReducedMotion } from "framer-motion";
import CinematicLink from "./CinematicLink";
import { presidentesComunalesData } from "../data/presidentesComunales";
import aguila from "../assets/aguila.webp";

export default function PresidentesComunalesPreview() {
  const reduceMotion = useReducedMotion();
  const profiles = presidentesComunalesData.filter((profile) => profile.foto).slice(0, 2);
  const heading = (
    <>

      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-[0.99] mb-6">
        Presidentes <br />comunales
      </div>
    </>
  );

  return (
    <section id="presidentes-comunales" aria-labelledby="presidentes-preview-heading" className="relative w-full scroll-mt-16 py-24 md:py-32 bg-liberty-bg text-liberty-text overflow-x-clip overflow-y-visible">
      <div aria-hidden="true" className="absolute top-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-liberty-primary/17 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-10">
        <h2 id="presidentes-preview-heading" className="sr-only">Presidentes comunales</h2>
        <m.div initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-24 items-center">
          <div className="lg:hidden text-center" aria-hidden="true">{heading}</div>

          {/* Se agrega lg:order-2 para que las fotos pasen a la derecha en desktop */}
          <div className="lg:col-span-7 min-w-0 lg:order-2">
            {profiles.length ? (
              <ul className="grid grid-cols-2 gap-1">
                {profiles.map((profile) => (
                  <li key={profile.id} className="aspect-[3/4] relative rounded-2xl overflow-hidden border border-liberty-border/50 bg-liberty-card">
                    <img src={profile.foto} alt={`${profile.nombre}, ${profile.cargo || "presidente comunal"} de ${profile.localidad}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </li>
                ))}
              </ul>
            ) : (
              <div aria-hidden="true" className="aspect-square md:aspect-[7/6] rounded-2xl border border-liberty-border/50 bg-liberty-card flex items-center justify-center">
                <img src={aguila} alt="" loading="lazy" decoding="async" className="w-1/2 h-1/2 object-contain" />
              </div>
            )}
          </div>

          {/* Se agrega lg:order-1 para que el texto pase a la izquierda en desktop */}
          <div className="lg:col-span-5 min-w-0 text-center lg:text-left lg:order-1">
            <div className="hidden lg:block" aria-hidden="true">{heading}</div>
            <p className="text-base md:text-lg text-liberty-text-secondary max-w-lg mx-auto lg:mx-0 mb-10">Conocé a nuestros presidentes comunales, sus localidades y su trabajo en la provincia de Santa Fe.</p>
            <CinematicLink to="/presidentes-comunales" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-liberty-text-secondary text-liberty-bg font-bold uppercase text-sm tracking-[0.2em] rounded-3xl border border-liberty-border hover:border-liberty-primary w-full sm:w-max focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Conocer al equipo</CinematicLink>
          </div>

        </m.div>
      </div>
    </section>
  );
}