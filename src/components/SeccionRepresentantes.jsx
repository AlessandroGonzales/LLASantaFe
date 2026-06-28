import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Link as LinkIcon,
  Phone,
} from "lucide-react";

import { concejalesData } from "../data/representantes";

// Icono de Instagram (SVG inline)
const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function SeccionRepresentantes() {
  const [selectedConcejal, setSelectedConcejal] = useState(null);

  useEffect(() => {
    if (selectedConcejal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedConcejal]);

  return (
    <section className="relative w-full py-24 md:py-32 bg-liberty-bg text-white overflow-hidden font-satoshi">
      {/* Luces de fondo */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-liberty-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-liberty-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Encabezado */}
      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-10 mb-16 md:mb-24">
        <div className="text-center">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-liberty-cyan uppercase block mb-4">
            Nuestros Representantes
          </span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            La fuerza de <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-primary">
              Santa Fe.
            </span>
          </h2>
          <p className="text-base md:text-lg text-liberty-text-secondary leading-relaxed max-w-2xl mx-auto">
            Conoce a los hombres y mujeres que están dando la batalla cultural y
            política en cada concejo deliberante. Profesionales, trabajadores y
            ciudadanos comprometidos con las ideas de la libertad.
          </p>
        </div>
      </div>

      {/* Grilla de cards */}
      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1700px] mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {concejalesData.map((concejal) => (
            <motion.div
              key={concejal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={() => setSelectedConcejal(concejal)}
              className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm group cursor-pointer bg-black/50 border border-white/5"
            >
              <img
                src={concejal.foto}
                alt={concejal.nombre}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="text-white text-xs md:text-sm font-black uppercase tracking-widest relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[1px] after:bg-liberty-primary">
                  {concejal.nombre}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedConcejal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-6 lg:p-12"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full max-w-[1400px] bg-liberty-bg md:rounded-2xl overflow-hidden flex flex-col lg:flex-row relative shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-liberty-border/50"
            >
              <button
                onClick={() => setSelectedConcejal(null)}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 md:p-3 bg-black/20 hover:bg-liberty-primary text-white rounded-full backdrop-blur-md transition-colors duration-300 group cursor-pointer"
              >
                <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              {/* Imagen */}
              <div className="w-full lg:w-1/2 h-[45vh] lg:h-full relative overflow-hidden bg-black flex-shrink-0">
                <img
                  src={selectedConcejal.foto}
                  alt={selectedConcejal.nombre}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
                <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-liberty-bg to-transparent" />
                <div className="lg:hidden absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-liberty-bg to-transparent" />
              </div>

              {/* Información */}
              <div className="w-full lg:w-1/2 h-[55vh] lg:h-full overflow-y-auto p-6 md:p-12 lg:p-16 flex flex-col hide-scrollbar bg-gradient-to-br from-liberty-bg to-liberty-surface">
                <div className="max-w-xl mx-auto lg:mx-0 w-full mt-auto lg:mt-0">
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 bg-liberty-primary/10 text-liberty-primary text-[12px] uppercase tracking-widest font-bold rounded-sm mb-4 border border-liberty-primary/20">
                      {selectedConcejal.cargo}
                    </span>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-2">
                      {selectedConcejal.nombre}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 border-y border-white/10 py-6">
                    <div className="flex items-center gap-3 text-liberty-text-secondary">
                      <MapPin className="w-5 h-5 text-liberty-cyan" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest">Ciudad</p>
                        <p className="text-sm font-bold text-white">{selectedConcejal.ciudad}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-liberty-text-secondary">
                      <Briefcase className="w-5 h-5 text-liberty-cyan" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest">Profesión</p>
                        <p className="text-sm font-bold text-white">{selectedConcejal.profesion}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-liberty-text-secondary">
                      <Calendar className="w-5 h-5 text-liberty-cyan" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest">Edad</p>
                        <p className="text-sm font-bold text-white">
                          {selectedConcejal.edad} años
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-liberty-text-secondary mb-4">
                      Visión y Objetivos
                    </h4>
                    <p className="text-base md:text-lg leading-relaxed text-zinc-100">
                      {selectedConcejal.descripcion}
                    </p>
                  </div>

                  {/* ==================== CONTACTO Y REDES ==================== */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-auto">
                    {selectedConcejal.proyectos && (
                      <a
                        href={selectedConcejal.proyectos}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-liberty-card border border-liberty-border text-white text-xs font-bold uppercase tracking-widest hover:border-liberty-primary hover:text-liberty-primary transition-colors duration-300 rounded-sm"
                      >
                        <LinkIcon className="w-4 h-4" />
                        Ver Proyectos
                      </a>
                    )}

                    <div className="flex gap-3 justify-center sm:justify-start">
                      {/* Instagram */}
                      {selectedConcejal.redes.instagram && (
                        <a
                          href={`https://instagram.com/${selectedConcejal.redes.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-primary hover:border-liberty-primary rounded-sm transition-colors text-white"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}

                      {/* Twitter / X */}
                      {selectedConcejal.redes.twitter && (
                        <a
                          href={`https://twitter.com/${selectedConcejal.redes.twitter.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-primary hover:border-liberty-primary rounded-sm transition-colors text-white"
                        >
                          <X className="w-4 h-4" />
                        </a>
                      )}

                      {/* Email */}
                      {selectedConcejal.mail && (
                        <a
                          href={`mailto:${selectedConcejal.mail}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-cyan hover:border-liberty-cyan rounded-sm transition-colors text-white"
                          title="Enviar Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}

                      {/* Teléfono / WhatsApp */}
                      {selectedConcejal.telefono && (
                        <a
                          href={`https://wa.me/${selectedConcejal.telefono.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-cyan hover:border-liberty-cyan rounded-sm transition-colors text-white"
                          title="Contactar por WhatsApp"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </section>
  );
}