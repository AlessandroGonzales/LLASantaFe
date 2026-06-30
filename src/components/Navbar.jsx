import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/aguila.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú mobile

  // Efecto para cambiar el estilo al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      // Solo actualiza el estado si realmente cambia la condición
      if (window.scrollY > 10 && !isScrolled) {
        setIsScrolled(true);
      } else if (window.scrollY <= 10 && isScrolled) {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true }); // passive: true mejora el scroll en mobile
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]); // Agrega isScrolled a las dependencias

  // Bloquear el scroll de la página de fondo cuando el menú esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 h-16 transition-all duration-300 font-satoshi ${
        isScrolled || isOpen
          ? "bg-liberty-bg/90 backdrop-blur-md shadow-lg border-b border-liberty-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* LOGO E IDENTIDAD */}
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center group z-50"
        >
          <div className="relative flex items-center h-9 w-auto transition-transform duration-300 group-hover:scale-105">
            <img
              src={logo}
              alt="La Libertad Avanza Santa Fe"
              fetchPriority="high"
              className="h-16 w-auto object-contain brightness-200 group-hover:brightness-110 transition-all"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          <div className="flex flex-col justify-center leading-none ml-2">
            <span className="text-[12px] font-black tracking-tight  uppercase group-hover:text-liberty-primary transition-colors">
              LA LIBERTAD AVANZA
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white uppercase mt-0.5">
              SANTA FE
            </span>
          </div>
        </Link>

        {/* MENÚ DE NAVEGACIÓN CENTRAL (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          <Link
            to="/#noticias"
            className="text-liberty-text-secondary hover:text-liberty-cyan transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-liberty-cyan after:transition-all hover:after:w-full"
          >
            Noticias
          </Link>
          <Link
            to="/#preview"
            className="text-liberty-text-secondary hover:text-liberty-cyan transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-liberty-cyan after:transition-all hover:after:w-full"
          >
            Propuestas
          </Link>
          <Link
            to="/#nosotros"
            className="text-liberty-text-secondary hover:text-liberty-cyan transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-liberty-cyan after:transition-all hover:after:w-full cursor-pointer"
          >
            Nosotros
          </Link>
          <Link
            to="/#representantes"
            className="text-liberty-text-secondary hover:text-liberty-cyan transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-liberty-cyan after:transition-all hover:after:w-full"
          >
            Representantes
          </Link>
        </div>

        {/* BOTÓN HAMBURGUESA (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col justify-center items-center md:hidden z-50 w-8 h-8 rounded-lg border border-liberty-border/40 bg-liberty-card/50 space-y-1.5 focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          <span
            className={`block w-4 h-0.5 bg-white transition-all duration-300 ease-out ${
              isOpen ? "rotate-45 translate-y-2 w-5" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-out ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-4 h-0.5 bg-white transition-all duration-300 ease-out ${
              isOpen ? "-rotate-45 -translate-y-2 w-5" : ""
            }`}
          />
        </button>

        <div
          className={`fixed inset-0 top-0 left-0 w-full h-screen bg-liberty-bg/100 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 md:hidden pt-24 pb-12 px-10 ${
            isOpen
              ? "opacity-100 pointer-events-auto translate-x-0"
              : "opacity-0 pointer-events-none translate-x-full"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-liberty-bg/20 via-transparent to-liberty-bg pointer-events-none" />

          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-liberty-primary/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-liberty-cyan/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="absolute top-1/2 right-0 w-[250px] h-[250px] bg-liberty-primary/10 rounded-full blur-[100px] pointer-events-none" />

          {/* ENLACES ALINEADOS A LA IZQUIERDA */}
          <div className="relative z-10 flex flex-col flex-1 justify-center space-y-6 text-2xl font-black uppercase tracking-widest">
            <Link
              to="/#noticias"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-md text-white hover:text-liberty-cyan transition-colors duration-200 border-b border-liberty-border/30 pb-2 flex justify-center items-center group relative"
            >
              <span>Noticias</span>
            </Link>

            <Link
              to="/#preview"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-md text-white hover:text-liberty-cyan transition-colors duration-200 border-b border-liberty-border/30 pb-2 flex justify-center items-center group relative"
            >
              <span>Propuestas</span>
            </Link>

            <Link
              to="/#nosotros"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-md text-white hover:text-liberty-cyan transition-colors duration-200 border-b border-liberty-border/30 pb-2 flex justify-center items-center group relative cursor-pointer"
            >
              <span>Nosotros</span>
            </Link>

            <Link
              to="/#representantes"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-md text-white hover:text-liberty-cyan transition-colors duration-200 border-b border-liberty-border/30 pb-2 flex justify-center items-center group relative"
            >
              <span>Representantes</span>
            </Link>
          </div>

          {/* FRASE DEL PARTIDO EN LA BASE DEL MENÚ */}
          <div className="relative z-10 text-center mt-auto pt-8 border-t border-liberty-border">
            <p className="text-sm md:text-sm tracking-wide text-liberty-text-secondary max-w-xs mx-auto leading-relaxed">
              "Una vida sin libertad no merece ser vivida"
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
}
