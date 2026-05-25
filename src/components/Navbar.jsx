import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/aguila.png'; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 h-16 transition-all duration-300 font-satoshi ${
        isScrolled
          ? 'bg-liberty-bg/90 backdrop-blur-md shadow-lg border-b border-liberty-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* LOGO E IDENTIDAD (Equilibrado) */}
        <Link to="/" className="flex items-center  group">
          <div className="relative flex items-center h-9 w-auto transition-transform duration-300 group-hover:scale-105">
            <img
              src={logo}
              alt="La Libertad Avanza Santa Fe"
              className="h-18 w-auto object-contain brightness-100 group-hover:brightness-110 transition-all"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          
          {/* Texto que equilibra la falta de logo horizontal */}
          <div className="flex flex-col justify-center leading-none">
            <span className="text-[11px] font-black tracking-tight text-white uppercase group-hover:text-liberty-primary transition-colors">
              LA LIBERTAD <span className="text-liberty-primary group-hover:text-liberty-cyan transition-colors">AVANZA</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-liberty-cyan uppercase mt-0.5">
              SANTA FE
            </span>
          </div>
        </Link>

        {/* MENÚ DE NAVEGACIÓN CENTRAL (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link 
            to="/propuestas" 
            className="text-liberty-text-secondary hover:text-liberty-cyan transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-liberty-cyan after:transition-all hover:after:w-full"
          >
            Propuestas
          </Link>
          <Link 
            to="/departamentos" 
            className="text-liberty-text-secondary hover:text-liberty-cyan transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-liberty-cyan after:transition-all hover:after:w-full"
          >
            Departamentos
          </Link>
          <Link 
            to="/prensa" 
            className="text-liberty-text-secondary hover:text-liberty-cyan transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-liberty-cyan after:transition-all hover:after:w-full"
          >
            Prensa
          </Link>
        </div>

        {/* BOTÓN DE ACCIÓN DESTACADO */}
        <div className="flex items-center">
          <Link
            to="/militancia"
            className="relative inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-xl bg-liberty-card border border-liberty-border overflow-hidden transition-all duration-300 hover:border-liberty-primary hover:text-white hover:scale-[1.03] shadow-sm hover:shadow-glow group cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-liberty-primary/20 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center gap-1.5">
              Portal Militante
            </span>
          </Link>
        </div>

      </nav>
    </header>
  );
}