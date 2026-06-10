import { useState } from "react";

const propuestasData = [
  {
    id: 1,
    alcance: "provincial",
    categoria: "economia",
    titulo: "Eliminación de Ingresos Brutos",
    bajada:
      "Reducción impositiva gradual para reactivar el sector productivo santafesino.",
    detalle:
      "Se implementará un esquema de quita del impuesto a los ingresos brutos para pymes y productores agropecuarios en un plazo de 24 meses, financiado con el achicamiento del gasto político.",
  },
  {
    id: 2,
    alcance: "provincial",
    categoria: "seguridad",
    titulo: "Modernización del Servicio Penitenciario",
    bajada:
      "Construcción de penales de máxima seguridad alejados de los centros urbanos.",
    detalle:
      "Inversión en tecnología de inhibición de señal absoluta y descentralización de las unidades penitenciarias actuales para cortar el vínculo operativo de las bandas organizadas.",
  },
  {
    id: 3,
    alcance: "rosario",
    categoria: "seguridad",
    titulo: "Anillo de Seguridad Digital",
    bajada:
      "Control absoluto de los accesos a la ciudad mediante IA y lectura de patentes.",
    detalle:
      "Monitoreo en tiempo real coordinado entre fuerzas provinciales y federales, digitalizando el 100% de los ingresos por autopistas y rutas principales a Rosario.",
  },
  {
    id: 4,
    alcance: "rosario",
    categoria: "burocracia",
    titulo: "Habilitaciones Comerciales Express",
    bajada:
      "Apertura de comercios en 24 horas eliminando la burocracia municipal.",
    detalle:
      "Trámite 100% digitalizado. El comerciante inicia su actividad bajo declaración jurada y las inspecciones se realizan a posteriori, eliminando las coimas y demoras de meses.",
  },
  {
    id: 5,
    alcance: "santa-fe",
    categoria: "burocracia",
    titulo: "Digitalización Total de la Administración",
    bajada:
      "Cierre de dependencias físicas obsoletas y unificación de trámites.",
    detalle:
      "Optimización de los recursos de la capital provincial, migrando el 90% de los trámites vecinales a una plataforma única con validación biométrica.",
  },
];

export default function SeccionPropuestas() {
  const [alcanceFiltro, setAlcanceFiltro] = useState("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");

  const propuestasFiltradas = propuestasData.filter((propuesta) => {
    const matchesAlcance =
      alcanceFiltro === "todos" || propuesta.alcance === alcanceFiltro;
    const matchesCategoria =
      categoriaFiltro === "todas" || propuesta.categoria === categoriaFiltro;
    return matchesAlcance && matchesCategoria;
  });

  return (
    <section className="bg-liberty-bg text-white py-30 lg:py-34 px-6 md:px-12 min-h-screen font-satoshi relative overflow-hidden ">
      {/* Luces ambientales centradas para acompañar la nueva simetría */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-liberty-cyan/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-liberty-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ========================================================================= */}
        {/* ENCABEZADO TOTALMENTE CENTRADO Y SIMÉTRICO */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center mb-20 pb-16 border-b border-liberty-border/30">
          {/* Título Principal */}
          {/* Título Principal */}
          <div className="relative inline-block">
            {/* Glow detrás del título */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[120px] bg-liberty-primary/30 rounded-full blur-[100px] pointer-events-none z-0" />

            <h1 className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] max-w-4xl">
              El Plan para Transformar <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-liberty-primary to-white">
                Santa Fe
              </span>
            </h1>
          </div>

          {/* Bajada Editorial */}
          <p className="text-liberty-text-secondary text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-3xl mt-10">
            No venimos a solucionar un sistema que está roto. Presentamos un
            esquema de reformas estructurales basado en las ideas de la
            libertad, la desregulación económica y el orden institucional para
            terminar con las mafias y la burocracia que asfixian a nuestra
            provincia.
          </p>

          {/* Bloque de Pilares / Manifiesto Estilo Horizontal Centrado */}
          <div className="w-full mt-20 grid gap-6 md:grid-cols-3 bg-gradient-to-b from-liberty-card to-liberty-card/40 border border-liberty-border/50 rounded-2xl p-6 lg:p-8 relative shadow-xl text-left ">
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-liberty-primary/70 to-transparent" />

            <div className="space-y-2">
              <div className="text-liberty-primary font-black text-lg">
                01. Gasto Político
              </div>
              <p className="text-xs md:text-sm text-liberty-text-secondary leading-relaxed font-light">
                Reducción Drástica: Todo el ahorro fiscal generado por el
                achicamiento del Estado vuelve directo al bolsillo de los
                contribuyentes.
              </p>
            </div>

            <div className="space-y-2 md:border-x md:border-liberty-border/30 md:px-6">
              <div className="text-liberty-primary  font-black text-lg">
                02. Sector Privado
              </div>
              <p className="text-xs md:text-sm text-liberty-text-secondary leading-relaxed font-light">
                Fin del Ajuste: Eliminación absoluta de trabas regulatorias,
                tasas municipales obsoletas e impuestos distorsivos a la
                producción.
              </p>
            </div>

            <div className="space-y-2 md:pl-4">
              <div className="text-liberty-primary  font-black text-lg">
                03. Orden Absoluto
              </div>
              <p className="text-xs md:text-sm text-liberty-text-secondary leading-relaxed font-light">
                Seguridad y Justicia: Respaldo político e institucional total a
                nuestras fuerzas policiales para recuperar el control de las
                calles.
              </p>
            </div>
          </div>
        </div>
        {/* ========================================================================= */}

        {/* Sección de Filtros Activa */}
        <div className="mb-6 text-center md:text-left">
          <h3 className="text-xl font-black uppercase tracking-tight text-white">
            Explorar Propuestas
          </h3>
          <p className="text-sm text-liberty-text-secondary">
            Usa los filtros para segmentar según tu región o área de interés.
          </p>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-col gap-6 mb-10 bg-liberty-card p-6 rounded-xl border border-liberty-border/50 shadow-lg">
          {/* Selector de Alcance Territorial */}
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
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setAlcanceFiltro(t.id)}
                  className={`px-5 py-2.5 text-sm transition-all duration-300 rounded-lg border ${
                    alcanceFiltro === t.id
                      ? "bg-liberty-cyan text-black border-liberty-cyan font-black shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                      : "bg-transparent text-liberty-text-secondary border-liberty-border hover:text-white hover:border-liberty-cyan/80"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Ejes Temáticos */}
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
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoriaFiltro(c.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-full ${
                    categoriaFiltro === c.id
                      ? "bg-white text-black shadow-md"
                      : "bg-liberty-border/30 text-liberty-text-secondary hover:bg-liberty-border/60 hover:text-white border border-transparent hover:border-liberty-border"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Propuestas */}
        {propuestasFiltradas.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {propuestasFiltradas.map((item) => (
              <div
                key={item.id}
                className="group bg-liberty-card border border-liberty-border/50 rounded-xl p-6 flex flex-col justify-between transition-all duration-500 hover:border-liberty-cyan hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,255,255,0.05)]"
              >
                <div>
                  {/* Etiquetas superiores de la Card */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="text-[10px] uppercase tracking-widest font-black px-2.5 py-1 bg-white/5 text-white border border-white/10 rounded-md">
                      {item.alcance === "provincial"
                        ? "Provincia"
                        : item.alcance}
                    </span>
                    <span className="text-xs text-liberty-cyan font-bold tracking-wide drop-shadow-sm">
                      {item.categoria === "seguridad" && "🛡️ Seguridad"}
                      {item.categoria === "economia" && "📈 Economía"}
                      {item.categoria === "burocracia" && "⚙️ Reforma"}
                    </span>
                  </div>

                  {/* Título y Descripción */}
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mb-3 leading-snug group-hover:text-liberty-cyan transition-colors duration-300">
                    {item.titulo}
                  </h3>
                  <p className="text-liberty-text-secondary text-sm md:text-base leading-relaxed mb-6 font-light">
                    {item.bajada}
                  </p>
                </div>

                {/* Detalle técnico al pie de la Card */}
                <div className="mt-auto pt-4 border-t border-liberty-border/30 text-xs text-liberty-text-secondary/80 leading-relaxed font-medium">
                  {item.detalle}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Estado Vacío */
          <div className="text-center py-20 border border-dashed border-liberty-border rounded-xl bg-liberty-card/50">
            <p className="text-liberty-text-secondary text-lg font-light">
              No se encontraron propuestas específicas para esta combinación de
              filtros.
            </p>
            <button
              onClick={() => {
                setAlcanceFiltro("todos");
                setCategoriaFiltro("todas");
              }}
              className="mt-4 px-6 py-2 bg-transparent border border-liberty-cyan text-liberty-cyan text-sm font-bold rounded hover:bg-liberty-cyan hover:text-black transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
