import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import rep1 from "../assets/lautaro.jpeg";
import rep2 from "../assets/giselle.jpeg";
import rep3 from "../assets/silvia.jpg";
import rep4 from "../assets/david.png";

export default function RepresentantesPreview() {
  return (
    <section id="representantes"className="relative w-full py-24 md:py-32 bg-liberty-bg text-liberty-text overflow-hidden border-t border-liberty-border font-satoshi">
      
      {/* Luces de fondo */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-liberty-primary/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-liberty-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-10">
        
        {/* =========================================
            TÍTULO + SUBTÍTULO MOBILE (Arriba)
        ========================================= */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:hidden text-center mb-12"
        >
          <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-liberty-cyan uppercase block mb-4">
            El equipo en el territorio
          </span>
          
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            Nuestros <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-primary">
              Concejales
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* =========================================
              COLUMNA IZQUIERDA: Imágenes (Medio en mobile)
          ========================================= */}
          <div className="lg:col-span-7 relative flex justify-center items-center w-full h-[450px] sm:h-[600px] lg:h-[700px]">
            <div className="relative w-full max-w-[400px] sm:max-w-[550px] lg:max-w-full h-full">
              
              {/* Imagen 4 */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: -30 }}
                whileInView={{ opacity: 0.6, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute top-[1%] left-0 w-[50%] md:w-[45%] aspect-square rounded-lg overflow-hidden hover:grayscale-0 hover:opacity-100 hover:z-50 transition-all duration-500 border-[6px] border-liberty-bg shadow-lg cursor-pointer"
              >
                <img src={rep4} alt="Concejal 4" className="w-full h-full object-cover" />
              </motion.div>

              {/* Imagen 3 */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: -20 }}
                whileInView={{ opacity: 0.7, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute top-[1%] right-0 w-[55%] md:w-[50%] aspect-square rounded-lg overflow-hidden hover:grayscale-0 hover:opacity-100 hover:z-50 transition-all duration-500 border-[6px] border-liberty-bg shadow-lg z-20 cursor-pointer"
              >
                <img src={rep3} alt="Concejal 3" className="w-full h-full object-cover" />
              </motion.div>

              {/* Imagen 2 */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 30 }}
                whileInView={{ opacity: 0.85, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute bottom-[10%] left-[2%] w-[58%] md:w-[55%] aspect-square rounded-lg overflow-hidden hover:grayscale-0 hover:opacity-100 hover:z-50 transition-all duration-500 border-[6px] border-liberty-bg shadow-lg z-30 cursor-pointer"
              >
                <img src={rep2} alt="Concejal 2" className="w-full h-full object-cover" />
              </motion.div>

              {/* Imagen 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="absolute bottom-0 right-[5%] w-[60%] md:w-[58%] aspect-square rounded-lg overflow-hidden z-40 border-[6px] border-liberty-bg shadow-2xl group cursor-pointer"
              >
                <img 
                  src={rep1} 
                  alt="Concejal Principal" 
                  className="w-full h-full object-cover contrast-110 opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" 
                />
              </motion.div>

            </div>
          </div>

          {/* =========================================
              COLUMNA DERECHA: Textos Desktop + Descripción Mobile + Botón
          ========================================= */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left z-10">
            
            {/* TEXTOS DESKTOP */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <span className="text-sm font-bold tracking-[0.3em] text-liberty-cyan uppercase block mb-4">
                El equipo en el territorio
              </span>
              
              <h2 className="text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Nuestros <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-primary">
                  Concejales
                </span>
              </h2>

              <p className="text-lg text-liberty-text-secondary max-w-lg lg:mx-0 mb-10">
                Ellos son la primera línea de defensa de las ideas de la libertad. Conoce a los representantes que están dando la batalla cultural y política en los concejos de toda la provincia de Santa Fe.
              </p>
            </motion.div>

            {/* DESCRIPCIÓN MOBILE (Ahora debajo de las imágenes) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:hidden mt-8 mb-10"
            >
              <p className="text-base md:text-lg text-liberty-text-secondary max-w-lg mx-auto">
                Ellos son la primera línea de defensa de las ideas de la libertad. Conoce a los representantes que están dando la batalla cultural y política en los concejos deliberantes de toda la provincia de Santa Fe.
              </p>
            </motion.div>

            {/* BOTÓN CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 lg:mt-0"
            >
              <Link
                to="/representantes"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-liberty-card text-white font-bold uppercase text-xs tracking-[0.2em] transition-all duration-300 rounded-3xl border border-liberty-border hover:border-liberty-cyan hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] w-full sm:w-max overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                <span className="relative z-10 flex items-center gap-2">
                  Conocer al equipo
                </span>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Estilo shimmer */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}