import { useState, useEffect, memo, useCallback } from "react";
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

// 1. Memoizamos el ícono puro
const Instagram = memo((props) => (
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
));

// 2. Tarjeta extraída y memoizada para que no se re-renderice al abrir el modal
const DiputadoCard = memo(({ diputado, onSelect }) => {
  return (
    <motion.div
      // Se mantiene layout por si en el futuro agregas un filtro
      layout 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => onSelect(diputado)}
      className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm group cursor-pointer border border-white/5 shadow-lg"
    >
      <img
        src={diputado.foto}
        alt={diputado.nombre}
        loading="lazy"
        decoding="async"
        // transform-gpu y will-change trasladan el cálculo visual a la placa de video
        className="w-full h-full object-cover transform-gpu will-change-[transform,filter] transition-[transform,filter] duration-700 ease-out  group-hover:grayscale-0 group-hover:scale-105"
      />
      <div className="absolute bottom-8 left-0 right-0 text-center px-4">
        <span className="text-white text-sm md:text-base font-black uppercase tracking-widest relative inline-block after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[1px] after:bg-liberty-primary">
          {diputado.nombre}
        </span>
      </div>
    </motion.div>
  );
});

// 3. Modal extraído para aislar su ciclo de vida
const ModalDiputado = memo(({ diputado, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-0 md:p-6 lg:p-12"
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full max-w-[1400px] bg-liberty-bg md:rounded-2xl overflow-hidden flex flex-col lg:flex-row relative border border-liberty-border/50 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 md:p-3 bg-black/40 hover:bg-liberty-primary text-white rounded-full group cursor-pointer border border-white/10 transition-colors"
        >
          <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        <div className="w-full lg:w-1/2 h-[45vh] lg:h-full relative overflow-hidden bg-black flex-shrink-0">
          <img
            src={diputado.foto}
            alt={diputado.nombre}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top transform-gpu"
          />
        </div>

        <div className="w-full lg:w-1/2 h-[55vh] lg:h-full overflow-y-auto p-6 md:p-12 lg:p-16 flex flex-col hide-scrollbar bg-gradient-to-br from-liberty-bg to-liberty-surface">
          <div className="max-w-xl mx-auto lg:mx-0 w-full mt-auto lg:mt-0">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-liberty-primary/10 text-liberty-primary text-[12px] uppercase tracking-widest font-bold rounded-sm mb-4 border border-liberty-primary/20">
                {diputado.cargo || "Diputado Nacional"}
              </span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-2">
                {diputado.nombre}
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
                  <p className="text-sm font-bold text-white">{diputado.profesion}</p>
                </div>
              </div>
              {diputado.edad && (
                <div className="flex items-center gap-3 text-liberty-text-secondary">
                  <Calendar className="w-5 h-5 text-liberty-cyan" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest">Edad</p>
                    <p className="text-sm font-bold text-white">{diputado.edad} años</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-10">
              <h4 className="text-xs font-black uppercase tracking-widest text-liberty-text-secondary mb-4">
                Labor Parlamentaria y Visión
              </h4>
              <p className="text-base md:text-lg leading-relaxed text-zinc-300">
                {diputado.descripcion}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-auto">
              {diputado.proyectos && (
                <a
                  href={diputado.proyectos}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-liberty-card border border-liberty-border text-white text-xs font-bold uppercase tracking-widest hover:border-liberty-primary hover:text-liberty-primary rounded-sm transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Ver Proyectos de Ley
                </a>
              )}

              <div className="flex gap-3 justify-center sm:justify-start">
                {diputado.redes?.instagram && (
                  <a
                    href={`https://instagram.com/${diputado.redes.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-primary hover:border-liberty-primary rounded-sm text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {diputado.redes?.twitter && (
                  <a
                    href={`https://twitter.com/${diputado.redes.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-primary hover:border-liberty-primary rounded-sm text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </a>
                )}
                {diputado.mail && (
                  <a
                    href={`mailto:${diputado.mail}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-cyan hover:border-liberty-cyan rounded-sm text-white transition-colors"
                    title="Enviar Email Institucional"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {diputado.telefono && (
                  <a
                    href={`https://wa.me/${diputado.telefono.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-cyan hover:border-liberty-cyan rounded-sm text-white transition-colors"
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
  );
});

export default function SeccionDiputados() {
  const [selectedDiputado, setSelectedDiputado] = useState(null);

  // Mantenemos la referencia estable de las funciones para no romper el React.memo
  const handleSelectDiputado = useCallback((diputado) => {
    setSelectedDiputado(diputado);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDiputado(null);
  }, []);

  useEffect(() => {
    if (selectedDiputado) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup de seguridad al desmontar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedDiputado]);

  return (
    <section className="relative w-full py-24 md:py-32 bg-liberty-bg text-white overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-20 mb-16 md:mb-24">
        <div className="text-center">
          <span className="text-[11px] md:text-xs font-bold tracking-[0.4em] text-liberty-primary uppercase block mb-4">
            Congreso de la Nación
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            Nuestra voz en <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-liberty-primary to-liberty-primary-hover">
              la Nación
            </span>
          </h2>
          <p className="text-base md:text-lg text-liberty-text-secondary leading-relaxed max-w-2xl mx-auto">
            Conoce a los diputados nacionales que defienden los intereses de Santa Fe y dan la batalla cultural en la Cámara Baja del Congreso.
          </p>
        </div>
      </div>

      <div className="w-full px-10 md:px-12 lg:px-20 max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4">
          <AnimatePresence mode="popLayout">
            {diputadosData.map((diputado) => (
              <DiputadoCard
                key={diputado.id}
                diputado={diputado}
                onSelect={handleSelectDiputado}
              />
            ))}
          </AnimatePresence>
        </div>

        {diputadosData.length === 0 && (
          <div className="w-full py-12 text-center">
            <p className="text-liberty-text-secondary tracking-widest uppercase text-sm">
              No hay diputados registrados actualmente.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedDiputado && (
          <ModalDiputado
            diputado={selectedDiputado}
            onClose={handleCloseModal}
          />
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