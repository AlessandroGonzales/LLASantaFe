import { motion } from "framer-motion";
import logoLibertad from "../assets/logoLibertad.png";
import backgroundImage from "../assets/mileidiezz.webp"; // Para mobile
import backgroundImageDos from "../assets/mileidiez.webp"; // Para Desktop
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <header className="relative min-h-[100vh] bg-hero-gradient flex flex-col justify-center items-center px-4 overflow-hidden border-b border-liberty-border">
      
      {/* IMAGEN PARA MOBILE */}
      <motion.img
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src={backgroundImage}
        alt="Grupo de Santa Fe Mobile"
        className="absolute inset-0 w-full h-full object-cover z-0 object-top md:hidden"
      />

      {/* IMAGEN PARA DESKTOP */}
      <motion.img
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src={backgroundImageDos}
        alt="Grupo de Santa Fe Desktop"
        className="hidden md:block absolute inset-0 w-full h-full object-cover z-0 object-[center_1%]"
      />

      {/* Efectos de iluminación sutiles en el fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-liberty-bg/10 via-transparent to-liberty-bg z-0 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-liberty-primary/10 rounded-full blur-[140px] pointer-events-none z-10" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute bottom-10 left-1/4 w-80 h-80 bg-liberty-cyan/10 rounded-full blur-[120px] pointer-events-none z-10" 
      />

      {/* =========================================
          BLOQUE SUPERIOR: Textos y Logo (Sube)
          Cambio: -translate-y-28 para mobile y space-y-4 para compactar.
          ========================================= */}
      <div className="max-w-4xl mx-auto text-center relative z-20 space-y-4 md:space-y-8 -translate-y-28 md:-translate-y-32">
        
        {/* CONTENEDOR DEL ÁGUILA */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <img
            src={logoLibertad}
            alt="Águila La Libertad Avanza"
            className="h-36 md:h-45 w-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </motion.div>

        {/* TÍTULO */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-none uppercase text-white drop-shadow-md"
        >
          La Libertad Avanza
        </motion.h1>

        {/* SUBTÍTULO */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-2xl tracking-widest text-liberty-text-secondary"
        >
          SANTA FE
        </motion.p>
      </div>

      {/* =========================================
          BLOQUE INFERIOR: Botones (Bajan)
          ========================================= */}
      <div className="relative z-20 translate-y-12 md:translate-y-24 w-full px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/#preview" className="w-full sm:w-auto px-10 py-4 rounded-4xl font-bold bg-liberty-card border border-liberty-border text-liberty-text transition-all duration-300 hover:bg-liberty-border/40 hover:text-liberty-cyan cursor-pointer text-center">
            Conocer Propuestas
          </Link>
          <Link
            to="/sumate"
            className="w-full sm:w-auto px-10 py-4 rounded-4xl font-bold bg-[#C026D3] border border-[#C026D3] text-white hover:bg-[#A21CAF] transition-all duration-300 cursor-pointer text-center"
          >
            Súmate al partido
          </Link>
        </motion.div>
      </div>

    </header>
  );
}