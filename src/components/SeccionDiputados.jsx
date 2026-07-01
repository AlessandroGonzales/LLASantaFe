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

import { diputadosData } from "../data/diputadosData";

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

export default function SeccionDiputados() {
  const [selectedDiputado, setSelectedDiputado] = useState(null);

  useEffect(() => {
    if (selectedDiputado) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedDiputado]);

  return (
    <section className="relative w-full py-24 md:py-32 bg-liberty-bg text-white overflow-hidden font-satoshi">
      {/* Elementos de fondo futuristas / minimalistas */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-liberty-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-liberty-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-20 mb-16 md:mb-24">
        <div className="text-center">
          <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-liberty-primary uppercase block mb-4">
            Congreso de la Nación
          </span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            Nuestra voz en <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-liberty-primary to-liberty-primary-hover">
              la Nación
            </span>
          </h2>
          <p className="text-base md:text-lg text-liberty-text-secondary leading-relaxed max-w-2xl mx-auto">
            Conoce a los diputados nacionales que defienden los intereses de Santa Fe y 
            dan la batalla cultural en la Cámara Baja del Congreso.
          </p>
        </div>
      </div>

      {/* Grilla de cards (Ajustada a 3 columnas en desktop para darle más presencia a cada diputado) */}
      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto relative z-10">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {diputadosData.map((diputado) => (
              <motion.div
                layout
                key={diputado.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedDiputado(diputado)}
                className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm group cursor-pointer bg-black/50 border border-white/5 shadow-lg hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] transition-shadow duration-500"
              >
                <img
                  src={diputado.foto}
                  alt={diputado.nombre}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover contrast-125 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                  <span className="text-white text-sm md:text-base font-black uppercase tracking-widest relative inline-block after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[1px] after:bg-liberty-primary">
                    {diputado.nombre}
                  </span>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-liberty-cyan font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                    Ver Perfil
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {diputadosData.length === 0 && (
          <div className="w-full py-12 text-center">
            <p className="text-liberty-text-secondary tracking-widest uppercase text-sm">
              No hay diputados registrados actualmente.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      <AnimatePresence>
        {selectedDiputado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90  p-0 md:p-6 lg:p-12"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full max-w-[1400px] bg-liberty-bg md:rounded-2xl overflow-hidden flex flex-col lg:flex-row relative shadow-[0_0_100px_rgba(0,0,0,0.9)] border border-liberty-border/50"
            >
              <button
                onClick={() => setSelectedDiputado(null)}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 md:p-3 bg-black/40 hover:bg-liberty-primary text-white rounded-full  transition-all duration-300 group cursor-pointer border border-white/10 hover:border-transparent"
              >
                <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              <div className="w-full lg:w-1/2 h-[45vh] lg:h-full relative overflow-hidden bg-black flex-shrink-0">
                <img
                  src={selectedDiputado.foto}
                  alt={selectedDiputado.nombre}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
                <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-liberty-bg to-transparent" />
                <div className="lg:hidden absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-liberty-bg to-transparent" />
              </div>

              <div className="w-full lg:w-1/2 h-[55vh] lg:h-full overflow-y-auto p-6 md:p-12 lg:p-16 flex flex-col hide-scrollbar bg-gradient-to-br from-liberty-bg to-liberty-surface">
                <div className="max-w-xl mx-auto lg:mx-0 w-full mt-auto lg:mt-0">
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 bg-liberty-primary/10 text-liberty-primary text-[12px] uppercase tracking-widest font-bold rounded-sm mb-4 border border-liberty-primary/20">
                      {selectedDiputado.cargo || "Diputado Nacional"}
                    </span>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-2">
                      {selectedDiputado.nombre}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8 border-y border-white/10 py-6">
                    <div className="flex items-center gap-3 text-liberty-text-secondary">
                      <MapPin className="w-5 h-5 text-liberty-cyan" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest">Representación</p>
                        <p className="text-sm font-bold text-white">Santa Fe</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-liberty-text-secondary">
                      <Briefcase className="w-5 h-5 text-liberty-cyan" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest">Profesión</p>
                        <p className="text-sm font-bold text-white">{selectedDiputado.profesion}</p>
                      </div>
                    </div>
                    {selectedDiputado.edad && (
                      <div className="flex items-center gap-3 text-liberty-text-secondary">
                        <Calendar className="w-5 h-5 text-liberty-cyan" />
                        <div>
                          <p className="text-[10px] uppercase tracking-widest">Edad</p>
                          <p className="text-sm font-bold text-white">
                            {selectedDiputado.edad} años
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-liberty-text-secondary mb-4">
                      Labor Parlamentaria y Visión
                    </h4>
                    <p className="text-base md:text-lg leading-relaxed text-zinc-300">
                      {selectedDiputado.descripcion}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-auto">
                    {selectedDiputado.proyectos && (
                      <a
                        href={selectedDiputado.proyectos}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-liberty-card border border-liberty-border text-white text-xs font-bold uppercase tracking-widest hover:border-liberty-primary hover:text-liberty-primary transition-colors duration-300 rounded-sm"
                      >
                        <LinkIcon className="w-4 h-4" />
                        Ver Proyectos de Ley
                      </a>
                    )}

                    <div className="flex gap-3 justify-center sm:justify-start">
                      {selectedDiputado.redes?.instagram && (
                        <a
                          href={`https://instagram.com/${selectedDiputado.redes.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-primary hover:border-liberty-primary rounded-sm transition-colors text-white"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}

                      {selectedDiputado.redes?.twitter && (
                        <a
                          href={`https://twitter.com/${selectedDiputado.redes.twitter.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-primary hover:border-liberty-primary rounded-sm transition-colors text-white"
                        >
                          <X className="w-4 h-4" />
                        </a>
                      )}

                      {selectedDiputado.mail && (
                        <a
                          href={`mailto:${selectedDiputado.mail}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-cyan hover:border-liberty-cyan rounded-sm transition-colors text-white"
                          title="Enviar Email Institucional"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}

                      {selectedDiputado.telefono && (
                        <a
                          href={`https://wa.me/${selectedDiputado.telefono.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-cyan hover:border-liberty-cyan rounded-sm transition-colors text-white"
                          title="Contactar Asesoría"
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