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
} from "lucide-react";
import afiliacion from "../assets/mileirosario.png";

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
        mode: "no-cors", // <-- ESTA ES LA MAGIA QUE SOLUCIONA EL ERROR
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Como usamos 'no-cors', la respuesta es opaca y no podemos leerla.
      // Pero si el código llegó hasta acá sin saltar al 'catch', el envío fue exitoso.
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
    <main className="min-h-screen bg-liberty-bg text-white font-satoshi relative overflow-hidden flex flex-col items-center py-10 md:py-24">
      {/* Elementos ambientales de fondo */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C026D3]/15 via-liberty-bg to-liberty-bg pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-liberty-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-5xl px-4 md:px-6 relative z-10 flex flex-col items-center space-y-12 md:space-y-20">
        {/* SECCIÓN SUPERIOR: COPY MOTIVACIONAL CENTRADO */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center space-y-6 md:space-y-8 max-w-4xl px-2"
        >
          <div className="inline-block mt-16">
            <span className="bg-[#C026D3]/10 text-[#C026D3] border border-[#C026D3]/30 px-4 md:px-6 py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(192,38,211,0.15)] block md:inline ">
              La historia la escriben los que se animan
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] md:leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400">
            La Reconstrucción <br />
            <span className="text-[#C026D3] drop-shadow-[0_0_15px_rgba(192,38,211,0.4)]">
              Necesita Leones.
            </span>
          </h1>

          <div className="space-y-4 md:space-y-4 text-base sm:text-lg md:text-xl text-liberty-text-secondary font-light leading-relaxed max-w-3xl mx-auto pt-2 md:pt-4 ">
            <p>
              A vos, que te levantás todos los días al alba para sostener a tu
              familia. A vos, que conseguiste todo por{" "}
              <strong className="text-white font-bold">mérito propio</strong> y
              viste cómo políticos corruptos te arrebataban el fruto de tu
              trabajo. Nos robaron los sueños, pero jamás nos van a quebrar la
              voluntad. No podemos ser simplistas ni mirar para otro lado; la
              destrucción que dejaron es total, y{" "}
              <strong className="text-white font-bold">
                la obligación de repararla es nuestra.
              </strong>
            </p>
            <p className="text-[#C026D3] font-medium">
              Este no es un espacio para tibios. Necesitamos tu osadía, tu
              fuerza y tu valor.
            </p>
          </div>
        </motion.div>

        {/* IMAGEN PANORÁMICA OPCIONAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full relative h-48 sm:h-64 md:h-80 rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-transparent transition-colors duration-700" />
          <img
            src={afiliacion}
            alt="Multitud Bandera Argentina"
            className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-liberty-bg via-transparent to-transparent z-15" />
        </motion.div>

        {/* SECCIÓN INFERIOR: FORMULARIO CENTRADO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-liberty-card backdrop-blur-2xl border border-liberty-border/50 rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Brillo interno superior */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#C026D3] to-transparent opacity-50" />

            {enviado ? (
              <div className="flex flex-col items-center justify-center text-center py-10 md:py-16 space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="w-20 h-20 md:w-24 md:h-24 text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]" />
                </motion.div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                  ¡Bienvenido a las fuerzas del cielo!
                </h3>
                <p className="text-gray-400 text-base md:text-lg max-w-md">
                  Tus datos fueron recibidos. Un referente de tu localidad te va
                  a contactar por WhatsApp en los próximos días.
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="mt-6 md:mt-8 px-8 md:px-10 py-3 md:py-4 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs md:text-sm"
                >
                  Volver al inicio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="text-center mb-6 md:mb-10">
                  <h2 className="text-2xl md:text-3xl font-black uppercase text-white mb-2 md:mb-3 tracking-wide">
                    Ficha de Pre-Afiliación
                  </h2>
                  <p className="text-xs md:text-sm text-gray-400">
                    Completá tus datos reales para que podamos contactarte
                    oficialmente.
                  </p>
                </div>

                {/* Input: Nombre */}
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Nombre y Apellido
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 md:h-5 md:w-5 text-gray-500 group-focus-within:text-[#C026D3] transition-colors" />
                    </div>
                    <input
                      required
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-liberty-border rounded-xl md:rounded-2xl py-4 md:py-5 pl-11 md:pl-14 pr-4 md:pr-5 text-white placeholder-gray-600 focus:outline-none focus:border-[#C026D3] focus:ring-1 focus:ring-[#C026D3] transition-all text-base md:text-lg"
                      placeholder="Ej: Javier Milei"
                    />
                  </div>
                </div>

                {/* Input: DNI & WhatsApp (Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                      DNI (Sin puntos)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none">
                        <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-gray-500 group-focus-within:text-[#C026D3] transition-colors" />
                      </div>
                      <input
                        required
                        type="number"
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-liberty-border rounded-xl md:rounded-2xl py-4 md:py-5 pl-11 md:pl-14 pr-4 md:pr-5 text-white placeholder-gray-600 focus:outline-none focus:border-[#C026D3] focus:ring-1 focus:ring-[#C026D3] transition-all appearance-none text-base md:text-lg"
                        placeholder="12345678"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                      WhatsApp
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 md:h-5 md:w-5 text-gray-500 group-focus-within:text-[#C026D3] transition-colors" />
                      </div>
                      <input
                        required
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-liberty-border rounded-xl md:rounded-2xl py-4 md:py-5 pl-11 md:pl-14 pr-4 md:pr-5 text-white placeholder-gray-600 focus:outline-none focus:border-[#C026D3] focus:ring-1 focus:ring-[#C026D3] transition-all text-base md:text-lg"
                        placeholder="+54 9 341..."
                      />
                    </div>
                  </div>
                </div>

                {/* Input: Localidad */}
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Localidad (Santa Fe)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-gray-500 group-focus-within:text-[#C026D3] transition-colors" />
                    </div>
                    <input
                      required
                      type="text"
                      name="localidad"
                      value={formData.localidad}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-liberty-border rounded-xl md:rounded-2xl py-4 md:py-5 pl-11 md:pl-14 pr-4 md:pr-5 text-white placeholder-gray-600 focus:outline-none focus:border-[#C026D3] focus:ring-1 focus:ring-[#C026D3] transition-all text-base md:text-lg"
                      placeholder="Ej: Rosario, Santa Fe..."
                    />
                  </div>
                </div>

                {/* Checkbox: Fiscalización */}
                <div className="pt-4 md:pt-6 mt-2 md:mt-4 border-t border-liberty-border/30">
                  <label className="flex items-start space-x-3 md:space-x-5 cursor-pointer group bg-black/20 p-4 md:p-5 rounded-xl md:rounded-2xl border border-transparent hover:border-liberty-border/50 transition-colors">
                    <div className="relative flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        name="quiereFiscalizar"
                        checked={formData.quiereFiscalizar}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-6 h-6 md:w-7 md:h-7 bg-black border-2 border-gray-600 rounded-lg peer-checked:bg-[#C026D3] peer-checked:border-[#C026D3] transition-colors flex items-center justify-center">
                        <ShieldCheck
                          className={`w-4 h-4 md:w-5 md:h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold uppercase tracking-wide text-base md:text-lg">
                        Quiero ser Fiscal
                      </span>
                      <span className="text-xs md:text-sm text-gray-400 mt-1 leading-relaxed">
                        Las elecciones se ganan cuidando los votos. Marcá esta
                        casilla si estás dispuesto a defender las urnas en tu
                        ciudad el día de la elección.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Botón de Submit */}
                <button
                  type="submit"
                  disabled={cargando}
                  className={`w-full mt-6 md:mt-10 flex items-center justify-center gap-2 md:gap-3 bg-[#C026D3] text-white font-black uppercase tracking-widest py-4 md:py-6 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-300 group text-sm md:text-lg ${cargando ? "opacity-70 cursor-not-allowed" : "hover:bg-[#A21CAF] hover:shadow-[0_0_40px_rgba(192,38,211,0.5)]"}`}
                >
                  {cargando ? "Enviando..." : "Sumarme al Equipo"}
                  {!cargando && (
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                  )}
                </button>

                <p className="text-[9px] md:text-[11px] text-center text-gray-500 uppercase tracking-widest mt-4 md:mt-6">
                  Al enviar, acepto ser contactado por los referentes
                  territoriales.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
