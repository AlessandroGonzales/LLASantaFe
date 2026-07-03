import { motion } from "framer-motion";
import { useState } from "react";

export default function Propone() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica para enviar a Excel (ej. Google Sheets API, FormSpree, etc.)
    alert("¡Propuesta lista para ser enviada!");
  };

  return (
    <section className="w-full py-24 bg-liberty-bg flex justify-center items-center px-4 md:px-8 overflow-hidden relative">
      
      
      <div className="max-w-7xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row rounded-[2rem] overflow-hidden  border border-liberty-border"
        >
          
          {/* PANEL IZQUIERDO - Información y Call to Action */}
          <div className="lg:w-5/12 bg-liberty-surface p-10 md:p-14 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-liberty-primary/22 to-liberty-primary/5 pointer-events-none" />
            
            <div className="relative z-10">
        
              
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter  mb-6">
                Tu visión <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-primary ">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-liberty-text-secondary">Nombre y Apellido *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-liberty-text-secondary">Teléfono *</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors"
                    placeholder="Ej. 341 123 4567"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-liberty-text-secondary">Email *</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Profesión / Ocupación */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-liberty-text-secondary">Profesión / Ocupación *</label>
                  <select 
                    required
                    className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled selected>Seleccioná tu sector</option>
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

              {/* Tipo de Contacto (Dropdown ancho completo) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-liberty-text-secondary">¿Cuál es el motivo de tu mensaje? *</label>
                <select 
                  required
                  className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>Elegí una opción</option>
                  <option value="proyecto">Tengo un Proyecto / Propuesta formal</option>
                  <option value="sugerencia">Sugerencia para la provincia</option>
                  <option value="duda">Duda o Consulta general</option>
                  <option value="voluntariado">Quiero sumarme como voluntario/fiscal</option>
                  <option value="denuncia">Denuncia / Irregularidad</option>
                </select>
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-liberty-text-secondary">Tu Mensaje *</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full bg-liberty-bg border border-liberty-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-liberty-cyan focus:ring-1 focus:ring-liberty-cyan transition-colors resize-none"
                  placeholder="Escribí acá tu idea, propuesta o consulta..."
                ></textarea>
              </div>

              {/* Input File Personalizado */}
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
                    <svg className="w-5 h-5 mr-2 group-hover:text-liberty-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-sm group-hover:text-white transition-colors">
                      {fileName ? fileName : "Subir documento de tu proyecto (PDF, Word)"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-center pt-2">
                <input 
                  type="checkbox" 
                  id="privacy" 
                  required
                  className="w-4 h-4 rounded border-liberty-border bg-liberty-bg text-liberty-cyan focus:ring-liberty-cyan focus:ring-offset-liberty-card accent-liberty-cyan cursor-pointer"
                />
                <label htmlFor="privacy" className="ml-3 text-sm text-liberty-text-secondary cursor-pointer">
                  Acepto compartir mis datos para ser contactado por el equipo.
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full mt-4 group relative inline-flex items-center justify-center px-8 py-4 bg-liberty-primary text-liberty-bg font-black uppercase text-sm tracking-[0.2em] rounded-xl  overflow-hidden transform-gpu cursor-pointer"
              >
                <span className="relative z-10">Enviar Propuesta</span>
              </button>

            </form>
          </div>
        </motion.div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}