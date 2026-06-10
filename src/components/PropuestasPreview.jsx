import { Link } from "react-router-dom";
import mapaSantaFe from "../assets/mapaSantaFe.png"; // Reemplaza la ruta si está en otra carpeta

export default function PropuestasPreview() {
  return (
    <section className="relative w-full py-6 lg:py-32 bg-liberty-bg overflow-hidden font-satoshi mb-10">
      {/* LUZ DE FONDO */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-liberty-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-liberty-cyan/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* TÍTULO MOBILE (solo en mobile) */}
          <div className="w-full text-center lg:hidden">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-[0.3em] text-liberty-cyan uppercase">
                El plan para la provincia
              </span>

              <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-none mt-5">
                Nuestras{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-text-secondary">
                  Propuestas
                </span>
              </h2>
            </div>
          </div>

          {/* COLUMNA IZQUIERDA: Mapa de Santa Fe */}
          <div className="w-full lg:w-1/2 flex justify-center relative group">
            {/* Círculo de luz dinámico detrás del mapa */}
            <div className="absolute inset-0 bg-gradient-to-tr from-liberty-primary/20 to-transparent rounded-full blur-[60px] lg:blur-[80px] opacity-40 group-hover:opacity-80 transition-opacity duration-700" />

            <img
              src={mapaSantaFe}
              alt="Mapa de los Departamentos de Santa Fe"
              className="w-3/5 sm:w-1/2 lg:w-3/4 h-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-transform duration-700 group-hover:-translate-y-3 group-hover:scale-105 z-10 relative"
            />
          </div>

          {/* COLUMNA DERECHA: Texto y Botón */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8">

            {/* Títulos (solo desktop) */}
            <div className="space-y-2 hidden lg:block">
              <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-liberty-cyan uppercase">
                El plan para la provincia
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none drop-shadow-md mt-5">
                Nuestras <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-text-secondary">
                  Propuestas
                </span>
              </h2>
            </div>

            {/* Descripción */}
            <p className="text-base md:text-lg text-liberty-text-secondary font-light leading-relaxed max-w-2xl">
              Tenemos un plan integral diseñado para transformar cada rincón de la provincia de Santa Fe. Desde el norte productivo hasta el sur industrial, nuestras ideas nacen de escuchar a los santafesinos y aplicar los valores de la libertad para volver a ser el motor del país.
            </p>

            {/* Botón de Acción */}
            <div className="pt-2 w-full sm:w-auto">
              <Link
                to="/propuestas"
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 font-bold text-white transition-all duration-300 bg-liberty-card border border-liberty-border rounded-4xl hover:bg-liberty-border/40 hover:border-liberty-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative z-10 flex items-center gap-3">
                  Ver Todas las Propuestas
                </span>
              </Link>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}