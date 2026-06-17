import { motion } from "framer-motion";
import uno from "../assets/santafe.jpeg"
import santafedos from "../assets/santafedos.jpeg"
import santafetres from "../assets/santafetres.jpeg"
import rominasantafe from "../assets/romisantafe.jpeg"
import karina from "../assets/karina.jpeg"
import libertad from "../assets/libertad.jpeg"


export default function NosotrosHistoria() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-liberty-bg text-white overflow-hidden">
      
      {/* Brillos sutiles de fondo */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-liberty-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-liberty-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 space-y-32 md:space-y-48 relative z-10">
        
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
              className="mb-12 lg:mb-0"
            >
              <span className="text-liberty-cyan text-sm md:text-base font-black uppercase tracking-[0.3em] block mb-4">
                Año 2023
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                El rugido <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                  en las calles.
                </span>
              </h2>
              <p className="text-lg text-liberty-text-secondary font-light leading-relaxed max-w-lg">
                Comenzamos siendo un grupo de ciudadanos cansados, caminando las calles de Santa Fe con boletas en la mano y convicción en el pecho. Fue el año de la épica, de la militancia orgánica y de cuidar cada voto frente al aparato de la casta. El año en que demostramos que las ideas de la libertad eran imparables.
              </p>
            </motion.div>

            {/* Dos imágenes pequeñas inferiores (Estilo Editorial) */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/5] overflow-hidden rounded-md group"
              >
                {/* Reemplazar src por tu foto chica 1 del 2023 */}
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
                className="relative aspect-[4/5] overflow-hidden rounded-md group mt-8" /* mt-8 para desfasarlas sutilmente como en la referencia */
              >
                {/* Reemplazar src por tu foto chica 2 del 2023 */}
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
            {/* Reemplazar src por tu foto principal del 2023 */}
            <img 
              src={santafedos}
              alt="Campaña Presidencial 2023 Santa Fe" 
              className="w-full h-full object-cover  group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
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
            {/* Reemplazar src por tu foto principal del 2024 */}
            <img 
              src={rominasantafe}
              alt="Constitución del Partido LLA Santa Fe 2024" 
              className="w-full h-full object-cover  group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t  via-transparent to-transparent opacity-60" />
          </motion.div>

          {/* Columna Derecha */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-12 lg:mb-0 lg:pl-8"
            >
              <span className="text-liberty-primary text-sm md:text-base font-black uppercase tracking-[0.3em] block mb-4">
                Año 2024
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Nuestra <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-liberty-primary to-white drop-shadow-lg">
                  Consolidación.
                </span>
              </h2>
              <p className="text-lg text-liberty-text-secondary font-light leading-relaxed max-w-lg">
                Ya siendo gobierno a nivel nacional, dimos el paso definitivo en la provincia: la conformación oficial del partido La Libertad Avanza en Santa Fe. Bajo el liderazgo de Karina Milei y Romina Diez, estructuramos una fuerza política real, superando récords de afiliaciones y preparándonos para ser la alternativa definitiva en nuestra provincia.
              </p>
            </motion.div>

            {/* Dos imágenes pequeñas inferiores (Estilo Editorial) */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8 lg:pl-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/5] overflow-hidden rounded-md group"
              >
                {/* Reemplazar src por tu foto chica 1 del 2024 */}
                <img 
                  src={karina}
                  alt="Afiliaciones 2024" 
                  className="w-full h-full object-cover  group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0  group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative aspect-[4/5] overflow-hidden rounded-md group mt-8"
              >
                {/* Reemplazar src por tu foto chica 2 del 2024 */}
                <img 
                  src={libertad}
                  alt="Evento Oficial LLA 2024" 
                  className="w-full h-full object-cover group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0  group-hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}