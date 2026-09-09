import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, CheckCircle2, LoaderCircle } from "lucide-react";
import afiliacion from "../assets/militantes.webp";
import afiliacionMobile from "../assets/sumate-mobile.webp";
import useSumateMetadata from "../hooks/useSumateMetadata";
import styles from "./Sumate.module.css";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx-VKfxtg1dQrFMt1zT9Zxy7zq21Rop7B0r2eaM5WyTdAJNAol0dcgVv0lbBxyU6dH35Q/exec";

const steps = [
  {
    title: "Dejá tus datos",
    description: "Completá el formulario para que podamos conocerte y contactarte.",
  },
  {
    title: "Conectá con tu localidad",
    description: "Un referente del equipo se comunica con vos por WhatsApp.",
  },
  {
    title: "Encontrá cómo participar",
    description: "Conocé las actividades, los equipos y las formas de aportar.",
  },
];

export default function Sumate() {
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    whatsapp: "",
    localidad: "",
    quiereFiscalizar: false,
  });
  const inFlight = useRef(false);
  const successRef = useRef(null);
  const errorRef = useRef(null);
  useSumateMetadata();

  useEffect(() => {
    if (enviado) successRef.current?.focus();
  }, [enviado]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  useEffect(() => {
    // Las rutas se cargan bajo demanda: el destino existe después del montaje.
    const frame = requestAnimationFrame(() => {
      const hash = window.location.hash;
      if (hash === "#sumate-formulario" || hash === "#como-sumarte") {
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inFlight.current || enviado) return;
    inFlight.current = true;
    setCargando(true);
    setError("");

    try {
      // Se conserva el contrato del Apps Script: endpoint, modo y cinco campos.
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Una respuesta opaca no permite comprobar el guardado en Google Sheets.
      setEnviado(true);
    } catch {
      setError("No pudimos enviar tu solicitud. Revisá tu conexión e intentá nuevamente. Tus datos siguen en el formulario.");
    } finally {
      inFlight.current = false;
      setCargando(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>La libertad<span>empieza</span><span className={styles.accent}>con vos.</span></h1>
          <p className={styles.invitation}>
            Los grandes cambios se realizan cuando todos están sumamente
            comprometidos. Nosotros queremos lo mejor para la provincia y para
            el país, ya que en ellos están esos jóvenes, empresarios,
            comerciantes, profesionales y niños que sueñan con una Argentina
            grande nuevamente. Por eso, necesitamos de tu apoyo; precisamos de
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

      <section id="como-sumarte" className={styles.process} aria-labelledby="sumate-process-title" tabIndex={-1}>
        <div className={styles.processIntro}>
          <p className={styles.eyebrow}>Cómo sumarte</p>
          <h2 id="sumate-process-title">De las ideas<span>a la acción.</span></h2>
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

      <section id="sumate-formulario" className={styles.contact} aria-labelledby="sumate-form-title" tabIndex={-1}>
        <div className={styles.contactLayout}>
          <div className={styles.contactIntro}>
            <p className={styles.eyebrow}>El primer paso</p>
            <h2 id="sumate-form-title">Tu lugar<span>empieza acá.</span></h2>
            <p>Dejanos tus datos para que el equipo de tu localidad se contacte con vos.</p>
            <div className={styles.contactNote}>
              <span aria-hidden="true" />
              <p>Queremos que seas parte de esta convocatoria.</p>
            </div>
          </div>

          <div className={styles.formArea}>
            {enviado ? (
              <div className={styles.success}>
                <CheckCircle2 size={48} strokeWidth={1.4} aria-hidden="true" />
                <p className={styles.eyebrow}>Solicitud enviada</p>
                <h3 ref={successRef} tabIndex={-1}>Gracias por dar<span>el primer paso.</span></h3>
                <p>
                  El siguiente paso es el contacto con un referente de tu
                  localidad por WhatsApp para conversar sobre cómo participar.
                </p>
                <Link to="/" className={styles.submit}>
                  Volver al inicio <ArrowRight size={19} aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} aria-labelledby="sumate-form-title" aria-busy={cargando}>
                <div className={styles.formHeading}>
                  <p className={styles.eyebrow}>Solicitud de contacto</p>
                  <p>Los cuatro campos son obligatorios.</p>
                </div>
                {error && (
                  <p className={styles.error} ref={errorRef} tabIndex={-1} role="alert">{error}</p>
                )}

                <fieldset className={styles.fields} disabled={cargando}>
                  <legend className={styles.srOnly}>Tus datos de contacto</legend>
                  <div className={styles.field}>
                    <label htmlFor="sumate-nombre">Nombre y apellido</label>
                    <input
                      id="sumate-nombre"
                      required
                      type="text"
                      name="nombre"
                      autoComplete="name"
                      autoCapitalize="words"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label htmlFor="sumate-dni">DNI</label>
                      <input
                        id="sumate-dni"
                        required
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]+"
                        title="Ingresá el DNI con números, sin puntos ni espacios."
                        name="dni"
                        aria-describedby="sumate-dni-help"
                        value={formData.dni}
                        onChange={handleChange}
                        placeholder="Tu número de documento"
                      />
                      <p id="sumate-dni-help" className={styles.fieldHelp}>Sin puntos ni espacios.</p>
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="sumate-whatsapp">WhatsApp</label>
                      <input
                        id="sumate-whatsapp"
                        required
                        type="tel"
                        name="whatsapp"
                        autoComplete="tel"
                        aria-describedby="sumate-whatsapp-help"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="Código de área y número"
                      />
                      <p id="sumate-whatsapp-help" className={styles.fieldHelp}>Incluí el código de área.</p>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="sumate-localidad">Localidad</label>
                    <input
                      id="sumate-localidad"
                      required
                      type="text"
                      name="localidad"
                      autoComplete="address-level2"
                      autoCapitalize="words"
                      value={formData.localidad}
                      onChange={handleChange}
                      placeholder="Tu ciudad o comuna"
                    />
                  </div>

                  <label className={styles.fiscalOption}>
                    <span className={styles.checkbox}>
                      <input
                        type="checkbox"
                        name="quiereFiscalizar"
                        checked={formData.quiereFiscalizar}
                        onChange={handleChange}
                        aria-describedby="sumate-fiscal-help"
                      />
                      <Check size={16} strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span>
                      <span className={styles.fiscalTitle}>Quiero ser fiscal <span>Opcional</span></span>
                      <span id="sumate-fiscal-help" className={styles.fiscalDescription}>
                        También quiero colaborar cuidando los votos el día de la elección.
                      </span>
                    </span>
                  </label>

                  <p className={styles.consent}>
                    Al enviar, aceptás que los referentes territoriales te
                    contacten por WhatsApp.
                  </p>
                  <button type="submit" className={styles.submit} disabled={cargando}>
                    {cargando ? (
                      <>Enviando… <LoaderCircle className={styles.spinner} size={20} aria-hidden="true" /></>
                    ) : (
                      <>Quiero ser parte <ArrowRight size={20} aria-hidden="true" /></>
                    )}
                  </button>
                </fieldset>
              </form>
            )}
            <p role="status" aria-live="polite" className={styles.srOnly}>
              {cargando ? "Enviando tu solicitud. Esperá un momento." : ""}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
