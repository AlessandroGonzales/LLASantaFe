import SectionTitle from "./SectionTitle.jsx";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import afiliacion from "../assets/militantes.webp";
import afiliacionMobile from "../assets/sumate-mobile.webp";
import useSumateMetadata from "../hooks/useSumateMetadata";
import AffiliationForm from "./affiliation/AffiliationForm";
import styles from "./Sumate.module.css";

const steps = [
  { title: "Enviá tu solicitud", description: "Revisá tus datos y confirmá el inicio del trámite desde tu cuenta." },
  { title: "Revisión del equipo", description: "El equipo autorizado revisa tu solicitud y tus datos de contacto." },
  { title: "Seguí el trámite", description: "Consultá el estado en tu cuenta. El equipo te indicará los próximos pasos." },
];

export default function Sumate() {
  useSumateMetadata();
  const { hash, key } = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash === "#sumate-formulario" || hash === "#como-sumarte") document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, key]);
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <SectionTitle as="h1" title="La libertad" accent="empieza con vos" breakLine />
          <p className={styles.invitation}>
            Los grandes cambios se realizan cuando todos están 
            comprometidos. Queremos lo mejor para la provincia y para
            el país, ya que en ellos están esos jóvenes, empresarios,
            comerciantes, profesionales y niños que sueñan con una Argentina
            grande nuevamente. Por eso, necesitamos de tu apoyo, de
            tu valentía y coraje para dar esta batalla ante la casta.
          </p>

        </div>
        <figure className={styles.heroPhoto}>
          <img
            src={afiliacion}
            srcSet={`${afiliacionMobile} 640w, ${afiliacion} 1280w`}
            sizes="(min-width: 1440px) 700px, (min-width: 960px) 52vw, calc(100vw - 40px)"
            width="1280"
            height="816"
            alt="Encuentro de militantes con banderas argentinas y de La Libertad Avanza"
            loading="eager"
            fetchPriority="high"
          />
          <figcaption>
            <span>La Libertad Avanza</span>
            <span>Las ideas, en acción.</span>
          </figcaption>
        </figure>
      </header>
       <section id="sumate-formulario" className={styles.contact} aria-labelledby="sumate-form-title" tabIndex={-1}>
        <div className={styles.contactLayout}>
          <div className={styles.contactIntro}>

            <h2 id="sumate-form-title">Tu lugar<span>empieza acá</span></h2>
            <p>Iniciá tu solicitud de afiliación y seguí su estado desde tu cuenta.</p>
            <div className={styles.contactNote}>
              <span aria-hidden="true" />
              <p>Queremos que seas parte de esta convocatoria.</p>
            </div>
          </div>

          <div className={styles.formArea}><AffiliationForm /></div>
        </div>
      </section>

      <section id="como-sumarte" className={styles.process} aria-labelledby="sumate-process-title" tabIndex={-1}>
        <div className={styles.processIntro}>

          <h2 id="sumate-process-title">De las ideas<span>a la acción</span></h2>
        </div>
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>


    </div>
  );
}
