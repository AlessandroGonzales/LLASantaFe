import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Link as LinkIcon,
  Phone,
  ChevronDown,
  Filter,
} from "lucide-react";

import { concejalesData } from "../data/representantes";

// 1. Memoizamos los íconos puros para evitar re-crearlos
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

// 2. Extraemos y Memoizamos la Tarjeta (VITAL para el rendimiento con >30 items)
// Al usar memo, cuando filtras o abres el modal, las tarjetas que no cambian no se re-renderizan.
const ConcejalCard = memo(({ concejal, onSelect }) => {
  return (
    <motion.div
      layout // Mantiene la magia de reordenamiento automático
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }} // Un poco más rápido para no saturar al tener 30 items
      onClick={() => onSelect(concejal)}
      className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm group cursor-pointer border border-white/5"
    >
      <img
        src={concejal.foto}
        alt={concejal.nombre}
        loading="lazy"
        decoding="async"
        // Optimizamos el CSS: pasamos de transition-all a will-change y transform-gpu
        className="w-full h-full object-cover transform-gpu will-change-[transform,filter] transition-[transform,filter] duration-700   group-hover:grayscale-0 group-hover:scale-105"
      />
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <span className="text-white text-xs md:text-sm font-black uppercase tracking-widest relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-[1px] after:bg-liberty-primary">
          {concejal.nombre}
        </span>
      </div>
    </motion.div>
  );
});

// 3. Extraemos el Modal para aislar su carga del hilo principal de la lista
const ModalConcejal = memo(({ concejal, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-0 md:p-6 lg:p-12"
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full max-w-[1400px] bg-liberty-bg md:rounded-2xl overflow-hidden flex flex-col lg:flex-row relative border border-liberty-border shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 md:p-3 bg-black/40 hover:bg-liberty-primary text-white rounded-full cursor-pointer transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full lg:w-1/2 h-[45vh] lg:h-full relative overflow-hidden bg-black flex-shrink-0">
          <img
            src={concejal.foto}
            alt={concejal.nombre}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transform-gpu"
          />
        </div>

        <div className="w-full lg:w-1/2 h-[55vh] lg:h-full overflow-y-auto p-6 md:p-12 lg:p-16 flex flex-col hide-scrollbar bg-gradient-to-br from-liberty-bg to-liberty-surface">
          <div className="max-w-xl mx-auto lg:mx-0 w-full mt-auto lg:mt-0">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-liberty-primary/10 text-liberty-primary text-[12px] uppercase tracking-widest font-bold rounded-sm mb-4 border border-liberty-primary/20">
                {concejal.cargo}
              </span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-2">
                {concejal.nombre}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 border-y border-white/10 py-6">
              <div className="flex items-center gap-3 text-liberty-text-secondary">
                <MapPin className="w-5 h-5 text-liberty-cyan" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest">Ciudad</p>
                  <p className="text-sm font-bold text-white">{concejal.ciudad}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-liberty-text-secondary">
                <Briefcase className="w-5 h-5 text-liberty-cyan" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest">Profesión</p>
                  <p className="text-sm font-bold text-white">{concejal.profesion}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-liberty-text-secondary">
                <Calendar className="w-5 h-5 text-liberty-cyan" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest">Edad</p>
                  <p className="text-sm font-bold text-white">{concejal.edad} años</p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h4 className="text-xs font-black uppercase tracking-widest text-liberty-text-secondary mb-4">
                Visión y Objetivos
              </h4>
              <p className="text-base md:text-lg leading-relaxed text-zinc-100">
                {concejal.descripcion}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-auto">
              {concejal.proyectos && (
                <a
                  href={concejal.proyectos}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-liberty-card border border-liberty-border text-white text-xs font-bold uppercase tracking-widest hover:border-liberty-primary hover:text-liberty-primary rounded-sm transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Ver Proyectos
                </a>
              )}

              <div className="flex gap-3 justify-center sm:justify-start">
                {concejal.redes?.instagram && (
                  <a
                    href={`https://instagram.com/${concejal.redes.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-primary hover:border-liberty-primary rounded-sm text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {concejal.redes?.twitter && (
                  <a
                    href={`https://twitter.com/${concejal.redes.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-primary hover:border-liberty-primary rounded-sm text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </a>
                )}
                {concejal.mail && (
                  <a
                    href={`mailto:${concejal.mail}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-cyan hover:border-liberty-cyan rounded-sm text-white transition-colors"
                    title="Enviar Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {concejal.telefono && (
                  <a
                    href={`https://wa.me/${concejal.telefono.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/10 hover:bg-liberty-cyan hover:border-liberty-cyan rounded-sm text-white transition-colors"
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
  );
});

// Componente Principal
export default function SeccionRepresentantes() {
  const [selectedConcejal, setSelectedConcejal] = useState(null);
  const [ciudadFiltro, setCiudadFiltro] = useState("Todos");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Mantenemos la identidad de la función para no romper el memo() de los hijos
  const handleSelectConcejal = useCallback((concejal) => {
    setSelectedConcejal(concejal);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedConcejal(null);
  }, []);

  const ciudades = useMemo(() => {
    return ["Todos", ...new Set(concejalesData.map((c) => c.ciudad))];
  }, []);

  const concejalesFiltrados = useMemo(() => {
    return ciudadFiltro === "Todos"
      ? concejalesData
      : concejalesData.filter((c) => c.ciudad === ciudadFiltro);
  }, [ciudadFiltro]);

  useEffect(() => {
    if (selectedConcejal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedConcejal]);

  return (
    <section className="relative w-full py-24 md:py-32 bg-liberty-bg text-white overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-20 mb-16 md:mb-24">
        <div className="text-center">
          <span className="text-[11px] md:text-xs font-bold tracking-[0.4em] text-liberty-primary uppercase block mb-4">
            Nuestros Representantes
          </span>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            La fuerza de <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-liberty-primary to-liberty-primary-hover">
              Santa Fe
            </span>
          </h2>
          <p className="text-base md:text-lg text-liberty-text-secondary leading-relaxed max-w-2xl mx-auto">
            Conoce a los hombres y mujeres que están dando la batalla cultural y política en cada concejo deliberante. Profesionales, trabajadores y ciudadanos comprometidos con las ideas de la libertad.
          </p>
        </div>

        {/* Filtro */}
        <div className="flex justify-center mt-12 relative z-50">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="w-full flex items-center justify-between px-6 py-4 bg-liberty-surface border border-liberty-border rounded-xl shadow-lg hover:border-liberty-primary text-white group cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-liberty-cyan group-hover:text-liberty-primary transition-colors" />
                <span className="font-bold tracking-widest uppercase text-sm">
                  {ciudadFiltro === "Todos" ? "Filtrar por Ciudad" : ciudadFiltro}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  isFilterMenuOpen ? "rotate-180 text-liberty-primary" : "text-liberty-text-secondary"
                }`}
              />
            </button>

            <AnimatePresence>
              {isFilterMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 w-full mt-3 bg-liberty-card border border-liberty-border rounded-xl z-50 origin-top shadow-2xl"
                >
                  <div className="p-6 border-b border-white/5 bg-gradient-to-br from-liberty-bg to-transparent">
                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-widest mb-1">
                      Ciudades de Santa Fe
                    </h3>
                    <p className="text-[10px] md:text-xs text-liberty-cyan uppercase tracking-[0.2em] font-bold">
                      Busca según tu ciudad
                    </p>
                  </div>
                  <div className="p-4 md:p-6 max-h-[40vh] overflow-y-auto hide-scrollbar flex flex-wrap gap-2 md:gap-3 bg-liberty-surface/50">
                    {ciudades.map((ciudad) => (
                      <button
                        key={ciudad}
                        onClick={() => {
                          setCiudadFiltro(ciudad);
                          setIsFilterMenuOpen(false);
                        }}
                        className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                          ciudadFiltro === ciudad
                            ? "bg-liberty-primary border-liberty-primary text-white "
                            : "bg-transparent border-liberty-border text-liberty-text-secondary hover:border-liberty-primary hover:text-white hover:bg-liberty-primary/10"
                        }`}
                      >
                        {ciudad}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Grilla de Cards Optimizada */}
      <div className="w-full px-4 md:px-12 lg:px-10 max-w-[1700px] mx-auto relative z-10">
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-4">
          <AnimatePresence mode="popLayout">
            {concejalesFiltrados.map((concejal) => (
              <ConcejalCard
                key={concejal.id}
                concejal={concejal}
                onSelect={handleSelectConcejal}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {concejalesFiltrados.length === 0 && (
          <div className="w-full py-12 text-center">
            <p className="text-liberty-text-secondary tracking-widest uppercase text-sm">
              No se encontraron representantes en esta ciudad.
            </p>
          </div>
        )}
      </div>

      {/* Modal Desacoplado */}
      <AnimatePresence>
        {selectedConcejal && (
          <ModalConcejal
            concejal={selectedConcejal}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>

      {/* Estilos para el scroll */}
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