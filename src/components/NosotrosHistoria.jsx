import { motion } from "framer-motion";
import uno from "../assets/santafe.jpeg";
import santafedos from "../assets/santafedos.jpeg";
import santafetres from "../assets/santafetres.jpeg";
import rominasantafe from "../assets/romisantafe.png";
import karina from "../assets/karina.jpeg";
import libertad from "../assets/libertad.jpeg";
// Importes para las 3 fotos de UPL (Modifica las rutas según tu proyecto)
import uplUno from "../assets/utn.png";
import uplDos from "../assets/cierreupl.jpeg";
import uplTres from "../assets/uplunidos.jpg";

export default function NosotrosHistoria() {
  return (
    <section className="relative w-full py-24 bg-liberty-bg text-white overflow-hidden">
      
      {/* Brillos sutiles de fondo */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-liberty-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-liberty-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full px-4 md:px-8 xl:px-12 space-y-22 md:space-y-38 relative z-10">
        
        {/* =========================================
            BLOQUE 1: AÑO 2023 - EL DESPERTAR
            Layout: Textos/Fotos chicas (Izquierda) | Foto Gigante (Derecha)
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Columna Izquierda */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-12 lg:mb-0 flex flex-col items-center text-center"
            >
              <span className="text-yellow-300 text-sm md:text-base font-black uppercase tracking-[0.3em] block mb-4">
                Año 2023
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                El rugido <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-300">
                  en las calles.
                </span>
              </h2>
              <p className="text-lg text-liberty-text-secondary font-light leading-relaxed max-w-lg mx-auto">
                Comenzamos siendo un grupo de ciudadanos cansados, caminando las calles de Santa Fe con boletas en la mano y convicción en el pecho. Fue el año de la épica, de la militancia orgánica y de cuidar cada voto frente al aparato de la casta. El año en que demostramos que las ideas de la libertad eran imparables.
              </p>
            </motion.div>

            {/* Dos imágenes pequeñas inferiores */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/5] overflow-hidden rounded-md group"
              >
                <img 
                  src={uno}
                  alt="Militancia 2023" 
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative aspect-[4/5] overflow-hidden rounded-md group mt-8"
              >
                <img 
                  src={santafetres}
                  alt="Fiscalización 2023" 
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            </div>
          </div>

          {/* Columna Derecha: Imagen Masiva Vertical */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="lg:col-span-6 h-[60vh] lg:h-[90vh] relative rounded-md overflow-hidden group border border-white/5"
          >
            <img 
              src={santafedos}
              alt="Campaña Presidencial 2023 Santa Fe" 
              className="w-full h-full object-cover group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" />
          </motion.div>

        </div>

        {/* Separador Visual Elegante */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* =========================================
            BLOQUE 2: AÑO 2024 - LA CONSOLIDACIÓN
            Layout Invertido: Foto Gigante (Izquierda) | Textos/Fotos chicas (Derecha)
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Columna Izquierda: Imagen Masiva Vertical */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="lg:col-span-6 h-[60vh] lg:h-[90vh] relative rounded-md overflow-hidden group border border-white/5 order-last lg:order-first"
          >
            <img 
              src={rominasantafe}
              alt="Constitución del Partido LLA Santa Fe 2024" 
              className="w-full h-full object-cover group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" />
          </motion.div>

          {/* Columna Derecha */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-12 lg:mb-0 lg:pl-8 flex flex-col items-center text-center"
            >
              <span className="text-liberty-primary text-sm md:text-base font-black uppercase tracking-[0.3em] block mb-4">
                Año 2024
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Nuestra <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-liberty-primary drop-shadow-lg">
                  Consolidación.
                </span>
              </h2>
              <p className="text-lg text-liberty-text-secondary font-light leading-relaxed max-w-lg mx-auto">
                Ya siendo gobierno a nivel nacional, dimos el paso definitivo en la provincia: la conformación oficial del partido La Libertad Avanza en Santa Fe. Bajo el liderazgo de Karina Milei y Romina Diez, estructuramos una fuerza política real, superando récords de afiliaciones y preparándonos para ser la alternativa definitiva en nuestra provincia.
              </p>
            </motion.div>

            {/* Dos imágenes pequeñas inferiores */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8 lg:pl-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/5] overflow-hidden rounded-md group"
              >
                <img 
                  src={karina}
                  alt="Afiliaciones 2024" 
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative aspect-[4/5] overflow-hidden rounded-md group mt-8"
              >
                <img 
                  src={libertad}
                  alt="Evento Oficial LLA 2024" 
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Separador Visual Elegante */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* =========================================
            BLOQUE 3: AÑO 2024 - EL NACIMIENTO DE UPL
            Layout: Textos/Fotos chicas (Izquierda) | Foto Gigante (Derecha)
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Columna Izquierda */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-12 lg:mb-0 flex flex-col items-center text-center"
            >
              <span className="text-blue-600 text-sm md:text-base font-black uppercase tracking-[0.3em] block mb-4">
                Año 2024
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                La batalla <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-900">
                  en las aulas.
                </span>
              </h2>
              <p className="text-lg text-liberty-text-secondary font-light leading-relaxed max-w-lg mx-auto">
                Ese mismo año marcamos un hito con el nacimiento de <strong>Universitarios por la Libertad (UPL)</strong>. Frente al adoctrinamiento y a las estructuras tradicionales en las universidades, decidimos conformar el primer frente estudiantil puramente liberal. El objetivo era claro: devolverle las facultades a los estudiantes y llevar la batalla cultural a cada universidad, defendiendo siempre la libertad de pensamiento.
              </p>
            </motion.div>

            {/* Dos imágenes pequeñas inferiores */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/5] overflow-hidden rounded-md group"
              >
                <img 
                  src={uplUno}
                  alt="Nacimiento UPL 2024" 
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative aspect-[4/5] overflow-hidden rounded-md group mt-8"
              >
                <img 
                  src={uplDos}
                  alt="Militancia Universitaria UPL" 
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            </div>
          </div>

          {/* Columna Derecha: Imagen Masiva Vertical */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="lg:col-span-6 h-[60vh] lg:h-[90vh] relative rounded-md overflow-hidden group border border-white/5"
          >
            <img 
              src={uplTres}
              alt="Universitarios por la Libertad" 
              className="w-full h-full object-cover group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" />
          </motion.div>

        </div>

      </div>
    </section>
  );
}