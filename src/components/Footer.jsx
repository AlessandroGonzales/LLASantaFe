import logo from "../assets/aguila.webp"; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-liberty-bg border-t border-liberty-border/100 pt-10 pb-8 px-6 font-satoshi overflow-hidden">
      
      {/* Brillo de fondo optimizado - mucho más ligero */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[120px] 
                   bg-liberty-primary/20 rounded-full blur-[80px] pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        
        {/* LOGO Y NOMBRE */}
        <div className="flex flex-col items-center mb-8 group cursor-default">
          <img
            src={logo}
            alt="La Libertad Avanza Logo"
            loading="lazy"
            decoding="async"
            className="h-20 md:h-24 w-auto mb-3 
                       transition-transform duration-500 
                       group-hover:scale-105 
                       will-change-transform"   // ← GPU friendly
          />
          
          <h3 className="text-white font-black tracking-widest text-lg md:text-xl uppercase text-center">
            La Libertad Avanza
          </h3>
          
          <p className="text-liberty-text-secondary font-bold tracking-[0.3em] text-xs md:text-sm mt-1 uppercase text-center">
            Santa Fe
          </p>
        </div>

        {/* REDES SOCIALES */}
        <div className="flex gap-8 mb-2 items-center">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/lalibertadavanzasantafe/"
            className="text-liberty-text-secondary hover:text-liberty-cyan 
                       transition-all duration-300 hover:scale-110 
                       will-change-transform"
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* Facebook y X (Twitter) - mismo patrón optimizado */}
          <a
            href="https://www.facebook.com/profile.php?id=61574583127255&locale=es_LA"
            className="text-liberty-text-secondary hover:text-liberty-cyan 
                       transition-all duration-300 hover:scale-110 
                       will-change-transform"
            aria-label="Facebook"
            target="_blank"
            rel="noreferrer"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
            </svg>
          </a>

          <a
            href="https://x.com/LLASantaFe"
            className="text-liberty-text-secondary hover:text-liberty-cyan 
                       transition-all duration-300 hover:scale-110 
                       will-change-transform"
            aria-label="X"
            target="_blank"
            rel="noreferrer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
            </svg>
          </a>
        </div>

        {/* LÍNEA SEPARADORA */}
        <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-liberty-border/40 to-transparent mb-6" />

        {/* COPYRIGHT */}
        <div className="flex flex-col justify-between w-full items-center gap-4 text-liberty-text-secondary/80 text-[11px] md:text-xs uppercase tracking-[2px]">
          <p className="text-center">
            © {currentYear} LLA SANTA FE - TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>
      </div>
    </footer>
  );
}