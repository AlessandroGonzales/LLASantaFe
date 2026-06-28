import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  CreditCard,
  Phone,
  MapPin,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  BadgeInfo,
} from "lucide-react";
import afiliacion from "../assets/mileirosario.png";

const steps = [
  {
    title: "Completá tus datos",
    description: "Ingresá tu información real para poder contactarte.",
  },
  {
    title: "Te contacta un referente",
    description: "Recibís el seguimiento del equipo de tu localidad.",
  },
  {
    title: "Entrás al movimiento",
    description: "Te incorporás a actividades, equipos y acciones concretas.",
  },
];

export default function Sumate() {
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    whatsapp: "",
    localidad: "",
    quiereFiscalizar: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbx-VKfxtg1dQrFMt1zT9Zxy7zq21Rop7B0r2eaM5WyTdAJNAol0dcgVv0lbBxyU6dH35Q/exec";

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setEnviado(true);
    } catch (error) {
      console.error("Error al enviar:", error);
      alert(
        "Hubo un problema de conexión. Revisá tu internet e intentá de nuevo.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-liberty-bg text-white font-satoshi relative overflow-hidden ">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(217,70,239,0.18)_0%,rgba(30,8,45,0.08)_30%,rgba(30,8,45,0)_65%)]" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-liberty-primary/10 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-liberty-cyan/10 blur-[160px] pointer-events-none" />

      {/* CONTENEDOR PRINCIPAL: Expansivo con padding dinámico en lugar de max-w */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-8 md:py-12 mt-10">
        {/* GRID: Aumentamos el gap (lg:gap-20 xl:gap-24) para aprovechar la amplitud */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 xl:gap-24 items-start">
          {/* Left / narrative */}
          <motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="pt-10 md:pt-14"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-liberty-border/70 bg-white/5 px-4 py-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.24em] text-liberty-primary shadow-[0_0_24px_rgba(217,70,239,0.12)]">
              <BadgeInfo className="h-3.5 w-3.5" />
              No es un formulario. Es un compromiso.
            </div>

            <h1 className="mt-7 max-w-3xl text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tight text-white">
              La reconstrucción <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r text-white">
                te necesita
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-liberty-text-secondary">
              A vos, que te levantás todos los días para sostener a tu familia.
              A vos, que construiste tu camino con mérito propio y no te
              resignaste. Esta provincia necesita personas que den un paso al
              frente, con convicción, con fuerza y con coraje.
            </p>

            <p className="mt-4 max-w-2xl text-base sm:text-lg font-medium text-liberty-primary">
              Queremos que seas parte de esta convocatoria histórica.
            </p>

            {/* Steps */}
            <div className="mt-10 rounded-[2rem] border border-liberty-border/60 bg-liberty-surface/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-sm uppercase tracking-[0.25em] text-center md:text-left font-black">
                Qué sucede después
              </h2>
              <div className="mt-5 grid gap-4">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-white/6 bg-black/20 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-liberty-primary/15 border border-liberty-primary/25 text-liberty-primary font-black">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-liberty-text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Right / image + form */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="sticky lg:top-8 pt-6 md:pt-10"
          >
            <div className="space-y-6">
              {/* Hero image */}
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-liberty-bg via-transparent to-transparent opacity-90" />
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-liberty-primary/10 via-transparent to-liberty-cyan/10" />
                <img
                  src={afiliacion}
                  alt="Militancia y encuentro"
                  className="h-[300px] md:h-[360px] w-full object-cover object-center scale-[1.03]"
                />
              </div>

              {/* Form card */}
              <div className="rounded-[2rem]  border border-liberty-border/70 bg-liberty-card/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
                <div className="h-1 w-full  bg-gradient-to-r from-liberty-primary via-fuchsia-300 to-liberty-cyan" />

                <div className="p-6 sm:p-8 md:p-10">
                  {enviado ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 md:py-16 space-y-5">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          damping: 14,
                        }}
                      >
                        <CheckCircle2 className="w-20 h-20 md:w-24 md:h-24 text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.35)]" />
                      </motion.div>
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                        ¡Bienvenido a La Libertad Avanza!
                      </h3>
                      <p className="text-sm md:text-base text-liberty-text-secondary max-w-md leading-relaxed">
                        Tus datos fueron recibidos. Un referente de tu localidad
                        te va a contactar por WhatsApp en los próximos días.
                      </p>
                      <button
                        onClick={() => (window.location.href = "/")}
                        className="mt-4 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition hover:bg-gray-200 cursor-pointer"
                      >
                        Volver al inicio
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                          Ingreso al partido
                        </h2>
                        <p className="mt-2 text-sm md:text-base text-liberty-text-secondary leading-relaxed">
                          Completá tus datos reales para que podamos contactarte
                          oficialmente.
                        </p>
                      </div>

                      {/* Nombre */}
                      <div className="space-y-2">
                        <label className="ml-1 text-[10px] md:text-xs font-black uppercase tracking-[0.24em] text-gray-300">
                          Nombre y apellido
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 md:pl-5 pointer-events-none">
                            <User className="h-4 w-4 md:h-5 md:w-5 text-gray-200 group-focus-within:text-liberty-primary transition-colors" />
                          </div>
                          <input
                            required
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-liberty-border bg-black/35 py-4 md:py-5 pl-11 md:pl-14 pr-4 md:pr-5 text-base md:text-lg text-white placeholder:text-gray-400 outline-none transition focus:border-liberty-primary focus:ring-1 focus:ring-liberty-primary/70"
                            placeholder="Ej: Javier Milei"
                          />
                        </div>
                      </div>

                      {/* DNI + WhatsApp */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="ml-1 text-[10px] md:text-xs font-black uppercase tracking-[0.24em] text-gray-300">
                            DNI
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 md:pl-5 pointer-events-none">
                              <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-gray-200 group-focus-within:text-liberty-primary transition-colors" />
                            </div>
                            <input
                              required
                              type="number"
                              name="dni"
                              value={formData.dni}
                              onChange={handleChange}
                              className="w-full rounded-2xl border border-liberty-border bg-black/35 py-4 md:py-5 pl-11 md:pl-14 pr-4 md:pr-5 text-base md:text-lg text-white placeholder:text-gray-400 outline-none transition focus:border-liberty-primary focus:ring-1 focus:ring-liberty-primary/70 appearance-none"
                              placeholder="12345678"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="ml-1 text-[10px] md:text-xs font-black uppercase tracking-[0.24em] text-gray-300">
                            WhatsApp
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 md:pl-5 pointer-events-none">
                              <Phone className="h-4 w-4 md:h-5 md:w-5 text-gray-200 group-focus-within:text-liberty-primary transition-colors" />
                            </div>
                            <input
                              required
                              type="tel"
                              name="whatsapp"
                              value={formData.whatsapp}
                              onChange={handleChange}
                              className="w-full rounded-2xl border border-liberty-border bg-black/35 py-4 md:py-5 pl-11 md:pl-14 pr-4 md:pr-5 text-base md:text-lg text-white placeholder:text-gray-400 outline-none transition focus:border-liberty-primary focus:ring-1 focus:ring-liberty-primary/70"
                              placeholder="+54 9 341..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Localidad */}
                      <div className="space-y-2">
                        <label className="ml-1 text-[10px] md:text-xs font-black uppercase tracking-[0.24em] text-gray-300">
                          Localidad
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 md:pl-5 pointer-events-none">
                            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-gray-200 group-focus-within:text-liberty-primary transition-colors" />
                          </div>
                          <input
                            required
                            type="text"
                            name="localidad"
                            value={formData.localidad}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-liberty-border bg-black/35 py-4 md:py-5 pl-11 md:pl-14 pr-4 md:pr-5 text-base md:text-lg text-white placeholder:text-gray-400 outline-none transition focus:border-liberty-primary focus:ring-1 focus:ring-liberty-primary/70"
                            placeholder="Ej: Rosario, Santa Fe"
                          />
                        </div>
                      </div>

                      {/* Checkbox */}
                      <div className="pt-2">
                        <label className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-liberty-border/50 bg-black/20 p-4 md:p-5 transition hover:border-liberty-primary/40 hover:bg-black/25">
                          <div className="relative mt-1 flex-shrink-0">
                            <input
                              type="checkbox"
                              name="quiereFiscalizar"
                              checked={formData.quiereFiscalizar}
                              onChange={handleChange}
                              className="peer sr-only"
                            />
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-gray-600 bg-black transition peer-checked:border-liberty-primary peer-checked:bg-liberty-primary">
                              <ShieldCheck className="h-4 w-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                            </div>
                          </div>
                          <div>
                            <span className="block text-base md:text-lg font-bold uppercase tracking-wide text-white">
                              Quiero ser fiscal
                            </span>
                            <span className="mt-1 block text-sm md:text-base leading-relaxed text-liberty-text-secondary">
                              Las elecciones se ganan cuidando los votos. Marcá
                              esta casilla si estás dispuesto a defender las
                              urnas en tu ciudad el día de la elección.
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={cargando}
                        className={`group mt-3 mx-auto flex w-full sm:w-fit items-center justify-center gap-3 rounded-2xl px-5 py-4 md:py-4 text-[14px] md:text-[15px] font-black uppercase tracking-[0.2em] text-white transition-all duration-300 cursor-pointer ${
                          cargando
                            ? "cursor-not-allowed bg-liberty-primary/65 opacity-80"
                            : "bg-gradient-to-r bg-liberty-primary hover:shadow-[0_0_40px_rgba(217,70,239,0.45)] hover:scale-[1.01]"
                        }`}
                      >
                        {cargando ? "Enviando..." : "Quiero ser parte"}
                        {!cargando && (
                          <ArrowRight className="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:translate-x-1.5" />
                        )}
                      </button>

                      <p className="mt-3 text-center text-[10px] md:text-xs uppercase tracking-[0.22em] text-gray-300">
                        Al enviar, acepto ser contactado por los referentes
                        territoriales.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
