import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react"; // Añadimos el icono para el dropdown
import logo from "../assets/aguila.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Menú mobile general
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false); // Submenú mobile

  // Efecto para cambiar el estilo al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10 && !isScrolled) {
        setIsScrolled(true);
      } else if (window.scrollY <= 10 && isScrolled) {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // Bloquear el scroll de la página de fondo cuando el menú esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobileDropdownOpen(false); // Cerramos el submenú si se cierra el menú general
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
            <span className="text-[12px] font-black tracking-tight uppercase group-hover:text-liberty-primary transition-colors">
              LA LIBERTAD AVANZA
            </span>
            <span className="text-[10px] font-bold tracking-widest text-white uppercase mt-0.5">
              SANTA FE
            </span>
          </div>
        </Link>

        {/* =========================================
            MENÚ DE NAVEGACIÓN CENTRAL (Desktop)
        ========================================= */}
        <div className="hidden md:flex items-center h-full gap-8 text-[15px] font-medium">
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

          {/* DROPDOWN DE REPRESENTANTES (Desktop) */}
          <div className="relative group h-full flex items-center">
            <button className="text-liberty-text-secondary transition-colors duration-200 relative py-1 flex items-center gap-1 group-hover:text-white cursor-pointer">
              Representantes
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 group-hover:text-liberty-cyan" />
              {/* Línea animada inferior */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-liberty-cyan transition-all duration-300 group-hover:w-full"></span>
            </button>

            {/* Cartilla desplegable invisible hasta hover */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <div className="bg-liberty-card border border-liberty-border rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden w-48 flex flex-col py-2">
                <Link
                  to="/#diputados"
                  className="px-5 py-3 text-[13px] font-bold tracking-widest uppercase text-white hover:bg-liberty-primary/10 hover:text-liberty-primary transition-colors flex items-center"
                >
                  Diputados
                </Link>
                <Link
                  to="/#representantes"
                  className="px-5 py-3 text-[13px] font-bold tracking-widest uppercase text-white hover:bg-liberty-cyan/10 hover:text-liberty-cyan transition-colors flex items-center"
                >
                  Concejales
                </Link>
              </div>
            </div>
          </div>
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

        {/* =========================================
            MENÚ FULLSCREEN (Mobile)
        ========================================= */}
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

          {/* ENLACES ALINEADOS AL CENTRO */}
          <div className="relative z-10 flex flex-col flex-1 justify-center space-y-6 text-2xl font-black uppercase tracking-widest">
            <Link
              to="/#noticias"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-md text-white hover:text-liberty-cyan transition-colors duration-200 border-b border-liberty-border/60 pb-2 flex justify-center items-center group relative mx-auto"
            >
              <span>Noticias</span>
            </Link>

            <Link
              to="/#preview"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-md text-white hover:text-liberty-cyan transition-colors duration-200 border-b border-liberty-border/60 pb-2 flex justify-center items-center group relative mx-auto"
            >
              <span>Propuestas</span>
            </Link>

            <Link
              to="/#nosotros"
              onClick={() => setIsOpen(false)}
              className="w-full max-w-md text-white hover:text-liberty-cyan transition-colors duration-200 border-b border-liberty-border/60 pb-2 flex justify-center items-center group relative cursor-pointer mx-auto"
            >
              <span>Nosotros</span>
            </Link>

            {/* DROPDOWN ACORDEÓN (Mobile) */}
            <div className="w-full max-w-md flex flex-col items-center border-b border-liberty-border/60 pb-2 mx-auto">
              <button
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                className="w-full text-white transition-colors duration-200 flex justify-center items-center gap-2 cursor-pointer"
              >
                <span>REPRESENTANTES</span>
                <ChevronDown 
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isMobileDropdownOpen ? "rotate-180 text-liberty-primary" : "text-liberty-text-secondary"
                  }`} 
                />
              </button>
              
              {/* Opciones del submenú animadas */}
              <div 
                className={`flex flex-col items-center overflow-hidden transition-all duration-300 ease-in-out w-full ${
                  isMobileDropdownOpen ? "max-h-40 mt-5 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <Link
                  to="/#diputados"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-liberty-text-secondary hover:text-liberty-primary py-3 w-full text-center transition-colors tracking-widest uppercase"
                >
                  Diputados
                </Link>
                <Link
                  to="/#representantes"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-liberty-text-secondary hover:text-liberty-cyan py-2 w-full text-center transition-colors tracking-widest uppercase"
                >
                  Concejales
                </Link>
              </div>
            </div>
          </div>

          {/* FRASE DEL PARTIDO */}
          <div className="relative z-10 text-center mt-auto pt-8 border-t border-liberty-border">
            <p className="text-base md:text-base tracking-wide text-liberty-text-secondary max-w-xs mx-auto leading-relaxed">
              "Una vida sin libertad no merece ser vivida"
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
}