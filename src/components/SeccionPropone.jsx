import { motion } from "framer-motion";
import { useState } from "react";

export default function Propone() {
  const [fileName, setFileName] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    profesion: "",
    motivo: "",
    mensaje: "",
    fileData: "",
    fileType: "",
    fileName: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Separamos el Base64 puro del prefijo data:*/*;base64,
        const base64String = reader.result.split(",")[1];
        setFormData((prev) => ({
          ...prev,
          fileData: base64String,
          fileType: file.type,
          fileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Reemplazá con la URL del nuevo Google Apps Script para este formulario
      const GOOGLE_SCRIPT_URL = "PEGAR_AQUI_LA_NUEVA_URL_DE_APPS_SCRIPT";

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
      alert("Hubo un problema al enviar la propuesta. Intentá de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="w-full py-24 bg-liberty-bg flex justify-center items-center px-4 md:px-8 overflow-hidden relative">
      <div className="max-w-7xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row rounded-[2rem] overflow-hidden border border-liberty-border"
        >
          {/* PANEL IZQUIERDO */}
          <div className="lg:w-5/12 bg-liberty-surface p-10 md:p-14 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-liberty-primary/22 to-liberty-primary/5 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-6">
                Tu visión <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-primary">
                  es nuestro plan
                </span>
              </h3>
              <p className="text-[20px] text-liberty-text-secondary leading-relaxed mb-8">
                Estamos escribiendo la mejor página de la historia de Argentina y la provincia de Santa Fe. Ya sea que tengas un proyecto de ley detallado, una sugerencia para tu sector o una duda sobre nuestro plan de gobierno, queremos escucharte. 
              </p>
            </div>
            <div className="relative z-10 pt-8 border-t border-liberty-border/50">
              <span className="block text-sm font-bold tracking-[0.2em] text-liberty-primary uppercase mb-2">
                ¿Contacto Directo?
              </span>
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                info@lla-santafe.com
              </span>
            </div>
          </div>

          {/* PANEL DERECHO - Formulario */}
          <div className="lg:w-7/12 bg-liberty-card p-10 md:p-14">
            {enviado ? (
              <div className="flex flex-col items-center justify-center text-center py-16 space-y-5">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                  ¡Propuesta Enviada con Éxito!
                </h3>
                <p className="text-base text-liberty-text-secondary max-w-md leading-relaxed">
                  Muchas gracias por aportar tu visión. El equipo la revisará y se pondrá en contacto pronto.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition hover:bg-gray-200 cursor-pointer"
                >
                  Enviar otra propuesta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-liberty-text-secondary">Nombre y Apellido *</label>
                    <input 
                      type="text" 
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-liberty-text-secondary">Teléfono *</label>
                    <input 
                      type="tel" 
                      name="telefono"
                      required
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors"
                      placeholder="Ej. 341 123 4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-liberty-text-secondary">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-liberty-text-secondary">Profesión / Ocupación *</label>
                    <select 
                      name="profesion"
                      required
                      value={formData.profesion}
                      onChange={handleChange}
                      className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Seleccioná tu sector</option>
                      <option value="estudiante">Estudiante</option>
                      <option value="comerciante">Comerciante / Pyme</option>
                      <option value="empresario">Emprendedor / Empresario</option>
                      <option value="salud">Profesional de la Salud</option>
                      <option value="docente">Docente / Investigador</option>
                      <option value="agro">Sector Agropecuario</option>
                      <option value="independiente">Trabajador Independiente</option>
                      <option value="jubilado">Jubilado</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-liberty-text-secondary">¿Cuál es el motivo de tu mensaje? *</label>
                  <select 
                    name="motivo"
                    required
                    value={formData.motivo}
                    onChange={handleChange}
                    className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Elegí una opción</option>
                    <option value="proyecto">Tengo un Proyecto / Propuesta formal</option>
                    <option value="sugerencia">Sugerencia para la provincia</option>
                    <option value="duda">Duda o Consulta general</option>
                    <option value="voluntariado">Quiero sumarme como voluntario/fiscal</option>
                    <option value="denuncia">Denuncia / Irregularidad</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-liberty-text-secondary">Tu Mensaje *</label>
                  <textarea 
                    name="mensaje"
                    required
                    rows="4"
                    value={formData.mensaje}
                    onChange={handleChange}
                    className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors resize-none"
                    placeholder="Escribí acá tu idea, propuesta o consulta..."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-liberty-text-secondary">Adjuntar Archivo (Opcional)</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <label 
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-liberty-border rounded-xl cursor-pointer hover:border-liberty-primary"
                    >
                      <span className="text-sm text-liberty-text-secondary transition-colors">
                        {fileName ? fileName : "Subir documento de tu proyecto (PDF, Word)"}
                      </span>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={cargando}
                  className="w-full mt-4 group relative inline-flex items-center justify-center px-8 py-4 bg-liberty-primary text-liberty-bg font-black uppercase text-sm tracking-[0.2em] rounded-xl overflow-hidden transform-gpu cursor-pointer disabled:opacity-50"
                >
                  <span className="relative z-10">{cargando ? "Enviando propuesta..." : "Enviar Propuesta"}</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}