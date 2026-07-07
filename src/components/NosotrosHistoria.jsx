import { motion } from "framer-motion";
import { memo } from "react";
import uno from "../assets/santafe.webp";
import santafedos from "../assets/santafedos.webp";
import santafetres from "../assets/inicios.webp";
import rominasantafe from "../assets/romisantafe.webp";
import karina from "../assets/karina.jpeg";
import libertad from "../assets/libertad.webp";
import uplUno from "../assets/utn.webp";
import uplDos from "../assets/cierreupl.webp";
import uplTres from "../assets/uplunidos.webp";

// 1. Definimos las variantes FUERA del componente para no recrearlas en cada render.
// Esto orquesta las animaciones para que fluyan en cadena sin saturar el procesador.
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Retraso de 0.2s entre cada elemento hijo
      delayChildren: 0.1,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

const smallImageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  },
};

const largeImageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 1, ease: "easeOut" } 
  },
};

// 2. Usamos memo para evitar re-renderizados innecesarios si cambian estados globales
const NosotrosHistoria = memo(function NosotrosHistoria() {
  const hasAnimated = sessionStorage.getItem("historia_animated") === "true";

  const markAsAnimated = () => {
    if (!hasAnimated) {
      sessionStorage.setItem("historia_animated", "true");
    }
  };

  // Configuración base para no repetir código en cada bloque
  const motionProps = {
    variants: sectionVariants,
    initial: hasAnimated ? "visible" : "hidden",
    whileInView: hasAnimated ? undefined : "visible",
    viewport: { once: true, margin: "-100px" },
    onViewportEnter: markAsAnimated,
  };

  // Clase optimizada para las imágenes (Hardware Acceleration + Lazy Loading)
  const imageClass = "w-full h-full object-cover transform-gpu will-change-[transform,filter] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out";

  return (
    <section className="relative w-full py-24 bg-liberty-bg text-white overflow-hidden">
      <div className="w-full px-4 md:px-8 xl:px-12 space-y-22 md:space-y-38 relative z-10">
        
        {/* =========================================
            BLOQUE 1: AÑO 2023 - EL DESPERTAR
        ========================================= */}
        <motion.div {...motionProps} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-6 flex flex-col justify-between">
            
            <motion.div variants={textVariants} className="mb-12 lg:mb-0 flex flex-col items-center text-center">
              <span className="text-yellow-300 text-sm md:text-base font-black uppercase tracking-[0.3em] block mb-4">
                Año 2023
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                El inicio del <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-300">
                  cambio en santa fe
                </span>
              </h2>
             <p className="text-lg text-liberty-text-secondary leading-relaxed w-full md:w-full mx-auto">
                Comenzamos siendo un grupo de ciudadanos cansados de los mismos de siempre, caminando las calles de Santa Fe con boletas en la mano y convicción en el pecho. Fue el año donde empezó la batalla cultural, con una militancia inquebrantable liderada por la fuerza de <strong>Romina Diez</strong> en la provincia y bajo la conducción de <strong>Javier Milei</strong> a nivel nacional, teniendo la precaución de cuidar cada voto frente al aparato de la casta. El año en que demostramos que las ideas de la libertad eran imparables.
              </p>

            </motion.div>

            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8">
              <motion.div variants={smallImageVariants} className="relative aspect-[4/5] overflow-hidden rounded-md group">
                <img src={uno} alt="Militancia 2023" loading="lazy" decoding="async" className={imageClass} />
              </motion.div>
              <motion.div variants={smallImageVariants} className="relative aspect-[4/5] overflow-hidden rounded-md group mt-8">
                <img src={santafetres} alt="Fiscalización 2023" loading="lazy" decoding="async" className={imageClass} />
              </motion.div>
            </div>
          </div>

          <motion.div variants={largeImageVariants} className="lg:col-span-6 h-[60vh] lg:h-[90vh] relative rounded-md overflow-hidden group border border-white/5">
            <img src={santafedos} alt="Campaña Presidencial" loading="lazy" decoding="async" className={imageClass} />
          </motion.div>
        </motion.div>

        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-liberty-text-secondary/70 to-transparent" />

        {/* =========================================
            BLOQUE 2: AÑO 2024 - LA CONSOLIDACIÓN
        ========================================= */}
        <motion.div {...motionProps} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <motion.div variants={largeImageVariants} className="lg:col-span-6 h-[60vh] lg:h-[90vh] relative rounded-md overflow-hidden group border border-white/5 order-last lg:order-first">
            <img src={rominasantafe} alt="Constitución Partido" loading="lazy" decoding="async" className={imageClass} />
            <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60 pointer-events-none" />
          </motion.div>

          <div className="lg:col-span-6 flex flex-col justify-between">
            <motion.div variants={textVariants} className="mb-12 lg:mb-0 lg:pl-8 flex flex-col items-center text-center">
              <span className="text-liberty-primary text-sm md:text-base font-black uppercase tracking-[0.3em] block mb-4">
                Año 2024
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Nuestra <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-primary drop-shadow-lg">
                  Consolidación
                </span>
              </h2>
               <p className="text-lg text-liberty-text-secondary leading-relaxed w-full mx-auto">
                Los argentinos decidieron el rumbo para cambiar drásticamente a la Argentina: con el 56% de los votos obtenidos en las elecciones y siendo ya gobierno a nivel nacional, dimos el paso definitivo en nuestra región con la conformación oficial del partido La Libertad Avanza en Santa Fe. Bajo el liderazgo de<strong> Javier Milei, Karina Milei y Romina Diez</strong>, estructuramos una fuerza política real, superando récords de afiliaciones y consolidándonos como la alternativa definitiva para la provincia.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8 lg:pl-8">
              <motion.div variants={smallImageVariants} className="relative aspect-[4/5] overflow-hidden rounded-md group">
                <img src={karina} alt="Afiliaciones 2024" loading="lazy" decoding="async" className={imageClass} />
              </motion.div>
              <motion.div variants={smallImageVariants} className="relative aspect-[4/5] overflow-hidden rounded-md group mt-8">
                <img src={libertad} alt="Evento Oficial" loading="lazy" decoding="async" className={imageClass} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-liberty-text-secondary/70 to-transparent" />

        {/* =========================================
            BLOQUE 3: AÑO 2024 - EL NACIMIENTO DE UPL
        ========================================= */}
        <motion.div {...motionProps} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <motion.div variants={textVariants} className="mb-12 lg:mb-0 flex flex-col items-center text-center">
              <span className="text-blue-600 text-sm md:text-base font-black uppercase tracking-[0.3em] block mb-4">
                Año 2024
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Frente al <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-900">
                  adoctrinamiento 
                </span>
              </h2>
                <p className="text-lg text-liberty-text-secondary leading-relaxed max-w-lg mx-auto">
                Ese mismo año marcamos un hito con el nacimiento de <strong>Universitarios por la Libertad (UPL)</strong>. Frente al adoctrinamiento y a las estructuras tradicionales en las universidades, decidimos conformar el primer frente estudiantil puramente liberal. El objetivo era claro: devolverle las facultades a los estudiantes y llevar la batalla cultural a cada universidad, defendiendo siempre la libertad de pensamiento.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8">
              <motion.div variants={smallImageVariants} className="relative aspect-[4/5] overflow-hidden rounded-md group">
                <img src={uplUno} alt="Nacimiento UPL 2024" loading="lazy" decoding="async" className={imageClass} />
              </motion.div>
              <motion.div variants={smallImageVariants} className="relative aspect-[4/5] overflow-hidden rounded-md group mt-8">
                <img src={uplDos} alt="Militancia Universitaria" loading="lazy" decoding="async" className={imageClass} />
              </motion.div>
            </div>
          </div>

          <motion.div variants={largeImageVariants} className="lg:col-span-6 h-[60vh] lg:h-[90vh] relative rounded-md overflow-hidden group border border-white/5">
            <img src={uplTres} alt="Universitarios por la Libertad" loading="lazy" decoding="async" className={imageClass} />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
});

export default NosotrosHistoria;