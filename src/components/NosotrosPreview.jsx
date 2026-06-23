import { motion } from "framer-motion";
import { History, ShieldAlert, TrendingUp } from "lucide-react";
import nosotrosimg from "../assets/nosotros.jpg";

export default function NosotrosPreview() {
  return (
    <section id="nosotros"className="relative w-full py-24 md:py-40 flex justify-center px-4 md:px-8 z-10 overflow-hidden bg-liberty-bg">
      
      {/* Luces cinematográficas de fondo - Más amplias y difusas */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[800px] h-[800px] bg-liberty-cyan/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/4 w-[800px] h-[800px] bg-liberty-primary/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="w-full max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA: Textos (Ocupa 7 columnas) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-12 lg:col-span-7 pr-0 lg:pr-10"
          >
            {/* Header / Subtítulo cinematográfico */}
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-liberty-cyan text-[10px] md:text-xs font-black uppercase tracking-[0.4em] shadow-liberty-cyan-glow">
                  Nuestra Historia
                </span>
              </div>
              
              <h2 className="text-5xl sm:text-5xl md:text-6xl  font-black uppercase tracking-tighter text-white leading-[0.85]">
                El rugido que <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-liberty-primary via-white to-liberty-cyan drop-shadow-2xl">
                  despertó
                </span> <br />
                a Santa Fe.
              </h2>
            </div>

            <p className="text-lg text-liberty-text-secondary font-light leading-relaxed max-w-2xl">
              No somos políticos tradicionales. Somos ciudadanos de a pie, trabajadores y estudiantes cansados de que nos roben el futuro. Somos la <strong className="text-white font-medium drop-shadow-md">única opción real</strong> para cambiar el rumbo.
            </p>

            {/* Manifiesto / Puntos clave (Minimalista) */}
            <div className="relative pl-6 md:pl-8 border-l border-white/10 space-y-8 py-2">
              <div className="absolute top-0 left-[-1px] w-[2px] h-1/3 bg-gradient-to-b from-liberty-primary to-transparent" />
              
              <motion.div whileHover={{ x: 5 }} className="flex items-start gap-5 group transition-transform">
                <History className="w-6 h-6 text-liberty-primary shrink-0  group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                <p className="text-sm md:text-lg text-gray-300 group-hover:text-white font-light transition-colors duration-500">
                  De dónde venimos y cómo se forjó este movimiento.
                </p>
              </motion.div>
              
              <motion.div whileHover={{ x: 5 }} className="flex items-start gap-5 group transition-transform">
                <ShieldAlert className="w-6 h-6 text-liberty-cyan shrink-0  group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                <p className="text-sm md:text-lg text-gray-300 group-hover:text-white font-light transition-colors duration-500">
                  Las batallas de frente que estamos dando hoy en la provincia.
                </p>
              </motion.div>
              
              <motion.div whileHover={{ x: 5 }} className="flex items-start gap-5 group transition-transform">
                <TrendingUp className="w-6 h-6 text-liberty-accent shrink-0  group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                <p className="text-sm md:text-lg text-gray-300 group-hover:text-white font-light transition-colors duration-500">
                  Nuestro plan definitivo para volver a ser potencia.
                </p>
              </motion.div>
            </div>

            {/* Botón Call to Action Elegante */}
            <div className="pt-4">
              <button 
                onClick={() => window.location.href = '/nosotros'}
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 font-bold text-white transition-all duration-300 bg-liberty-card border border-liberty-border rounded-4xl hover:bg-liberty-border/40 hover:border-liberty-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] overflow-hidden cursor-pointer"
              >
                Conocer nuestra historia
              </button>
            </div>
          </motion.div>

          {/* COLUMNA DERECHA: Imagen Destacada Cinematográfica (Ocupa 5 columnas) */}
          <motion.div 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="lg:col-span-5 relative w-full h-[500px] md:h-[600px] lg:h-[750px] group cursor-pointer"
            onClick={() => window.location.href = '/nosotros'}
          >
            {/* Marco sutil */}
            
            <div className="relative w-full h-full rounded-[4rem] overflow-hidden bg-black shadow-2xl">
              
              {/* Overlay dramático (Viñeteado y sombras) */}
              
              <img 
                src={nosotrosimg} 
                alt="Multitud de La Libertad Avanza" 
                className="w-full h-full object-cover object-center"
              /> 
            </div>

            {/* Sello / Etiqueta flotante minimalista */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-8 -left-8 md:-bottom-10 md:-left-10 bg-liberty-surface/80 backdrop-blur-md border border-white/10 p-5 md:p-8 rounded-2xl shadow-2xl z-30 hidden sm:flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 absolute animate-ping opacity-75" />
                  <div className="w-2 h-2 rounded-full bg-red-500 relative" />
                </div>
                <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.2em] text-white/70">
                  El Momento es Hoy
                </span>
              </div>
              <span className="text-white font-serif text-base italic drop-shadow-md">
                "Despertando Leones"
              </span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}