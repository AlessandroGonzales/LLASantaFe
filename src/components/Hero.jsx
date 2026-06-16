import logoLibertad from "../assets/logoLibertad.png";
import backgroundImage from "../assets/mileidiezz.png"; // Para mobile
import backgroundImageDos from "../assets/mileidiez.png"; // Para Desktop
import { Link } from "react-router-dom";
export default function Hero() {
  return (
    <header className="relative min-h-[100vh] bg-hero-gradient flex flex-col justify-center items-center px-4 overflow-hidden border-b border-liberty-border">
      {/* IMAGEN PARA MOBILE: Se muestra por defecto y se oculta a partir de pantallas medianas (md) */}
      <img
        src={backgroundImage}
        alt="Grupo de Santa Fe Mobile"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-65 object-top md:hidden "
      />

      {/* IMAGEN PARA DESKTOP: Oculta por defecto (hidden) y se activa solo en pantallas md en adelante */}
      <img
        src={backgroundImageDos}
        alt="Grupo de Santa Fe Desktop"
        className="hidden md:block absolute inset-0 w-full h-full object-cover z-0 opacity-65 object-[center_10%]"
      />

      {/* Efectos de iluminación sutiles en el fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-liberty-bg/10 via-transparent to-liberty-bg z-0 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-liberty-primary/10 rounded-full blur-[140px] pointer-events-none z-10" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-liberty-cyan/10 rounded-full blur-[120px] pointer-events-none z-10" />

      <div className="max-w-4xl mx-auto text-center relative z-20 space-y-8  ">
        {/* CONTENEDOR DEL ÁGUILA (Centrado arriba del título) */}
        <div className="flex justify-center ">
          <img
            src={logoLibertad}
            alt="Águila La Libertad Avanza"
            className="h-36 md:h-45 w-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-none uppercase text-white drop-shadow-md ">
          La Libertad Avanza
        </h1>

        <p className="text-lg md:text-2xl font-light tracking-widest text-liberty-text-secondary mb-32">
          SANTA FE
        </p>

        {/* CTAs Principales con Glows configurados */}
        <div className=" flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#preview" className="w-full sm:w-auto px-10 py-4 rounded-4xl font-bold bg-liberty-card border border-liberty-border text-liberty-text transition-all duration-300 hover:bg-liberty-border/40 hover:text-liberty-cyan cursor-pointer">
            Conocer Propuestas
          </a>
          <Link
            to="/sumate"
            className="w-full sm:w-auto px-10 py-4 rounded-4xl font-bold 
                 bg-[#C026D3] border border-[#C026D3] 
                 text-white hover:bg-[#A21CAF] transition-all duration-300 cursor-pointer"
          >
            Súmate al partido
          </Link>
        </div>
      </div>
    </header>
  );
}
