import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import rominapropuestas from "../assets/rominanuevo.jpeg";
import fotopropuestas from "../assets/fotopropuestas.jpeg";
import tercerafoto from "../assets/lla.webp";
import { propuestasData } from "../data/propuestasData";

export default function SeccionPropuestas() {
  const [alcanceFiltro, setAlcanceFiltro] = useState("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");

  // 1. Verificamos si las animaciones ya se ejecutaron en esta sesión
  const hasAnimated = sessionStorage.getItem("seccionPropuestas_animated") === "true";

  // 2. Función que se dispara cuando el componente entra en pantalla
  const markAsAnimated = () => {
    sessionStorage.setItem("seccionPropuestas_animated", "true");
  };

  const propuestasFiltradas = propuestasData.filter((propuesta) => {
    const matchesAlcance =
      alcanceFiltro === "todos" || propuesta.alcance === alcanceFiltro;
    const matchesCategoria =
      categoriaFiltro === "todas" || propuesta.categoria === categoriaFiltro;
    return matchesAlcance && matchesCategoria;
  });

  return (
    <section className="bg-liberty-bg text-white py-30 lg:py-34 px-6 md:px-12 min-h-screen font-satoshi relative overflow-hidden">
      {/* Luces ambientales centradas para acompañar la simetría */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-liberty-cyan/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-liberty-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full md:w-full">
        {/* ========================================================================= */}
        {/* ENCABEZADO TOTALMENTE CENTRADO Y SIMÉTRICO */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center mb-20 pb-12">
          <div className="relative inline-block">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[120px] bg-liberty-primary/30 rounded-full blur-[100px] pointer-events-none z-0" />
            <motion.h1 
              onViewportEnter={markAsAnimated}
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] max-w-4xl"
            >
              El Plan para Transformar <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-primary">
                Santa Fe
              </span>
            </motion.h1>
          </div>

          <motion.p 
            initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-liberty-text-secondary leading-relaxed max-w-3xl mt-10 text-lg md:text-xl"
          >
            No venimos a solucionar un sistema que está roto. Presentamos un
            esquema de reformas estructurales basado en las ideas de la
            libertad, la desregulación económica y el orden institucional para
            terminar con las mafias y la burocracia que asfixian a nuestra
            provincia.
          </motion.p>

          <motion.div 
            initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full md:max-w-3/5 mt-20 grid gap-6 md:grid-cols-3 bg-gradient-to-b from-liberty-card to-liberty-card/40 border border-liberty-border/50 rounded-2xl p-6 lg:p-8 relative shadow-xl text-left"
          >
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-liberty-primary to-transparent" />

            {/* Card 1 */}
            <motion.div 
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="space-y-2"
            >
              <div className="text-liberty-primary font-black text-lg">
                01. Gasto Político
              </div>
              <p className="text-base md:text-base text-liberty-text-secondary leading-relaxed ">
                Reducción Drástica: Todo el ahorro fiscal generado por el
                achicamiento del Estado vuelve directo al bolsillo de los
                contribuyentes.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.75 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="space-y-2 md:border-x md:border-liberty-border/30 md:px-6"
            >
              <div className="text-liberty-primary font-black text-lg">
                02. Sector Privado
              </div>
              <p className="text-base md:text-base text-liberty-text-secondary leading-relaxed ">
                Fin del Ajuste: Eliminación de trabas regulatorias,
                tasas municipales obsoletas e impuestos distorsivos a la
                producción.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="space-y-2 md:pl-4"
            >
              <div className="text-liberty-primary font-black text-lg">
                03. Orden Absoluto
              </div>
              <p className="text-base md:text-base text-liberty-text-secondary leading-relaxed ">
                Seguridad y Justicia: Respaldo político e institucional total a
                los policiales para recuperar el control de las
                calles.
              </p>
            </motion.div>
          </motion.div>
        </div>
        {/* ========================================================================= */}

        {/* ========================================================================= */}
        {/* NUEVA COMPOSICIÓN ESTILO MINIMALISTA / LUJO */}
        {/* ========================================================================= */}
        <div className="mb-14 pb-20 border-b border-liberty-border/30 overflow-hidden">
          {/* Grid responsivo: 1 completa y 2 mitad en mobile, 3 iguales en desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 mb-12">
            {/* Imagen 1 */}
            <motion.div
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-2 md:col-span-1 relative group overflow-hidden aspect-square md:aspect-[3/4] bg-liberty-card"
            >
              <img
                src={fotopropuestas}
                alt="Convicción"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 transform-gpu"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-white text-xs md:text-sm font-semibold tracking-[0.2em] uppercase relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-white group-hover:after:w-full transition-all duration-500">
                  Convicción
                </span>
              </div>
            </motion.div>

            {/* Imagen 2 */}
            <motion.div
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="col-span-1 relative group overflow-hidden aspect-[3/4] bg-liberty-card"
            >
              <img
                src={rominapropuestas}
                alt="Fuerza"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 transform-gpu"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-white text-xs md:text-sm font-semibold tracking-[0.2em] uppercase relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-white group-hover:after:w-full transition-all duration-500">
                  Fuerza
                </span>
              </div>
            </motion.div>

            {/* Imagen 3 */}
            <motion.div
              initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="col-span-1 relative group overflow-hidden aspect-[3/4] bg-liberty-card"
            >
              <img
                src={tercerafoto}
                alt="Futuro"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 transform-gpu"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-white text-xs md:text-sm font-semibold tracking-[0.2em] uppercase relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-white group-hover:after:w-full transition-all duration-500">
                  Futuro
                </span>
              </div>
            </motion.div>
          </div>

          {/* TEXTO INFERIOR */}
          <motion.div
            initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-end mt-8"
          >
            <div className="max-w-2xl text-center md:text-right">
              <p className="text-liberty-text-secondary text-base md:text-xl leading-relaxed">
                No vinimos a guiar corderos, vinimos a despertar leones. Es hora
                de llevar las banderas de la libertad económica, el orden
                absoluto y el progreso a cada rincón de nuestra provincia. El
                cambio es inevitable.
              </p>
              <div className="mt-8 flex justify-center md:justify-end items-center gap-4">
                <div className="hidden md:block h-[1px] w-20 bg-liberty-primary/40" />
                <span className="text-white font-black uppercase tracking-tighter text-xl md:text-2xl">
                  LA LIBERTAD AVANZA{" "}
                  <span className="text-liberty-primary">SANTA FE</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        {/* ========================================================================= */}

        <div className="w-full md:max-w-9/12 mx-auto ">
          {/* Sección de Filtros Activa */}
          <div className="mb-10 text-center md:text-left ">
            <motion.h3 
              initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xl font-black uppercase tracking-tight text-white mb-2"
            >
              Explorar Propuestas
            </motion.h3>
            <motion.p 
              initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm text-liberty-text-secondary"
            >
              Usa los filtros para segmentar según tu región o área de interés.
            </motion.p>
          </div>

          {/* Barra de Filtros */}
          <motion.div 
            initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className=" flex flex-col gap-6 mb-10 bg-liberty-card p-6 rounded-xl border border-liberty-border/50 shadow-lg"
          >
            <div>
              <h4 className="text-xs uppercase tracking-widest text-liberty-text-secondary/70 mb-3 font-bold text-center md:text-left">
                Territorio / Alcance
              </h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {[
                  { id: "todos", label: "Ver Todo" },
                  { id: "provincial", label: "Provincial (Macro)" },
                  { id: "rosario", label: "Rosario" },
                  { id: "santa-fe", label: "Santa Fe Capital" },
                ].map((t, index) => (
                  <motion.button
                    key={t.id}
                    onClick={() => setAlcanceFiltro(t.id)}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2.5 text-sm transition-all duration-300 rounded-lg border cursor-pointer ${
                      alcanceFiltro === t.id
                        ? "bg-liberty-primary text-black font-black"
                        : "bg-transparent text-liberty-text-secondary border-liberty-border hover:text-white hover:border-liberty-cyan/80"
                    }`}
                  >
                    {t.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-liberty-text-secondary/70 mb-3 font-bold text-center md:text-left">
                Ejes Temáticos
              </h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {[
                  { id: "todas", label: "Todos los ejes" },
                  { id: "seguridad", label: "Seguridad y Orden" },
                  { id: "economia", label: "Economía y Producción" },
                  { id: "burocracia", label: "Reforma del Estado" },
                ].map((c, index) => (
                  <motion.button
                    key={c.id}
                    onClick={() => setCategoriaFiltro(c.id)}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index + 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-full cursor-pointer ${
                      categoriaFiltro === c.id
                        ? "bg-liberty-primary text-black shadow-md"
                        : "bg-liberty-border/30 text-liberty-text-secondary hover:bg-liberty-border/60 hover:text-white border border-transparent hover:border-liberty-cyan/80"
                    }`}
                  >
                    {c.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grid de Propuestas */}
          {propuestasFiltradas.length > 0 ? (
            <motion.div 
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              initial={hasAnimated ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: hasAnimated ? 0 : 0.1
                  }
                }
              }}
            >
              {propuestasFiltradas.map((item) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: hasAnimated ? 0 : 0.5, ease: "easeOut" }
                    }
                  }}
                >
                  <Link
                    to={`/propuesta/${item.id}`}
                    className="group bg-liberty-card border border-liberty-border/50 rounded-xl p-6 flex flex-col justify-between transition-all duration-500 hover:border-liberty-primary hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,215,0,0.05)] cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <span className="text-[10px] uppercase tracking-widest font-black px-2.5 py-1 bg-white/5 text-white border border-white/10 rounded-md">
                          {item.alcance === "provincial"
                            ? "Provincia"
                            : item.alcance}
                        </span>
                        <span className="text-xs text-liberty-primary font-bold tracking-wide drop-shadow-sm">
                          {item.categoria === "seguridad" && "Seguridad"}
                          {item.categoria === "economia" && "Economía"}
                          {item.categoria === "burocracia" && "Reforma"}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mb-3 leading-snug">
                        {item.titulo}
                      </h3>
                      <p className="text-liberty-text-secondary text-sm md:text-base leading-relaxed mb-6 ">
                        {item.bajada}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-liberty-border/30 text-xs text-liberty-text-secondary/80 leading-relaxed font-medium">
                      {item.detalle}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={hasAnimated ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 border border-dashed border-liberty-border rounded-xl bg-liberty-card/50"
            >
              <p className="text-liberty-text-secondary text-lg ">
                No se encontraron propuestas específicas para esta combinación
                de filtros.
              </p>
              <button
                onClick={() => {
                  setAlcanceFiltro("todos");
                  setCategoriaFiltro("todas");
                }}
                className="mt-4 px-6 py-2 bg-transparent border border-liberty-primary text-liberty-primary text-sm font-bold rounded hover:bg-liberty-primary hover:text-black transition-colors"
              >
                Limpiar Filtros
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}