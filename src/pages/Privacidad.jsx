import { useEffect } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle.jsx";
import { privacyNotice } from "../data/privacyNotice.js";

export default function Privacidad() {
  useEffect(() => {
    const previousTitle = document.title;
    const canonical = document.head.querySelector('link[rel="canonical"]');
    const previousCanonical = canonical?.href;
    document.title = "Privacidad y protección de datos | La Libertad Avanza Santa Fe";
    if (canonical) canonical.href = "https://www.lalibertadavanzasantafe.com/privacidad";
    return () => {
      document.title = previousTitle;
      if (canonical && previousCanonical) canonical.href = previousCanonical;
    };
  }, []);
  return <section className="bg-[#f5f0f7] text-[#281334] px-5 pt-32 pb-20">
    <article className="mx-auto max-w-4xl">
      <SectionTitle title="Privacidad y protección de datos" tone="light" />
      <p className="text-base leading-7 mb-8">Aviso vigente · Versión {privacyNotice.version}</p>
      <div className="rounded-2xl border border-[#dfd1e5] bg-white p-6 sm:p-8 mb-10 text-base leading-7">
        <p className="font-bold">{privacyNotice.responsible}</p>
        <p>{privacyNotice.address}</p>
        <a className="underline underline-offset-4" href={"mailto:" + privacyNotice.email}>{privacyNotice.email}</a>
      </div>
      <div className="space-y-8">
        {privacyNotice.sections.map(section => <section key={section.title}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">{section.title}</h2>
          <p className="text-base sm:text-lg leading-8">{section.text}</p>
        </section>)}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-10 text-base underline underline-offset-4">
        <a href={privacyNotice.lawUrl} target="_blank" rel="noreferrer">Ley 25.326</a>
        <a href={privacyNotice.rightsUrl} target="_blank" rel="noreferrer">Derechos ante la AAIP</a>
        <Link to="/">Volver al inicio</Link>
      </div>
    </article>
  </section>;
}
