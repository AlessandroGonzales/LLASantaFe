import { useRef, useEffect } from "react";
import { newsData } from "../data/noticiasData";
import CinematicLink from "./CinematicLink";

export default function NewsCarousel() {
  const carouselRef = useRef(null);

  // 1. Restauramos la posición de forma nativa con el ciclo de renderizado
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("newsCarouselScroll");
    if (savedScrollPosition && carouselRef.current) {
      requestAnimationFrame(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft = parseInt(savedScrollPosition, 10);
        }
      });
    }
  }, []);

  // 2. Función para guardar la posición exacta
  const handleNewsClick = () => {
    if (carouselRef.current) {
      sessionStorage.setItem(
        "newsCarouselScroll",
        carouselRef.current.scrollLeft
      );
    }
  };

  // 3. Lectura de DOM optimizada (sin querySelectors costosos)
  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.offsetWidth || 500;
      carouselRef.current.scrollBy({
        left: -(cardWidth + 24),
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.offsetWidth || 500;
      carouselRef.current.scrollBy({
        left: cardWidth + 24,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="noticias"
      className="w-full py-25 bg-liberty-bg border-t border-liberty-border/30 overflow-hidden font-satoshi transform-gpu translate-z-0"
    >
      {/* TÍTULO DE LA SECCIÓN */}
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            Últimas Noticias
          </h2>
          <p className="text-liberty-text-secondary mt-3 text-sm md:text-base tracking-wide">
            Enterate de las novedades del espacio en Santa Fe.
          </p>
        </div>
      </div>

      {/* CONTENEDOR DEL CARRUSEL */}
      <div className="relative">
        {/* GRADIENTE IZQUIERDO */}
        <div className="hidden lg:flex absolute left-0 top-0 h-full w-28 bg-gradient-to-r from-liberty-bg via-liberty-bg/20 to-transparent z-20 items-center pl-4 pointer-events-none transform-gpu translate-z-0">
          <button
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full bg-liberty-card/95 border border-liberty-border text-white hover:border-liberty-cyan hover:text-liberty-cyan transition-all duration-300 flex items-center justify-center cursor-pointer pointer-events-auto will-change-transform"
            aria-label="Desplazar a la izquierda"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </div>

        {/* GRADIENTE DERECHO */}
        <div className="hidden lg:flex absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-liberty-bg via-liberty-bg/20 to-transparent z-20 items-center justify-end pr-4 pointer-events-none transform-gpu translate-z-0">
          <button
            onClick={scrollRight}
            className="w-12 h-12 rounded-full bg-liberty-card/90 border border-liberty-border text-white hover:border-liberty-cyan hover:text-liberty-cyan transition-all duration-300 flex items-center justify-center cursor-pointer pointer-events-auto will-change-transform"
            aria-label="Desplazar a la derecha"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        {/* CARRUSEL - Aceleración de hardware en el track de scroll */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 px-6 pb-8 hide-scrollbar scroll-smooth transform-gpu translate-z-0 will-change-scroll"
          style={{ scrollPaddingLeft: "1.5rem" }}
        >
          {newsData.map((news, index) => (
            <CinematicLink
              key={news.id}
              to={`/noticia/${news.id}`}
              onClick={handleNewsClick}
              className="relative flex-none w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[31vw] h-[60dvh] md:h-[500px] bg-liberty-card rounded-2xl overflow-hidden snap-center md:snap-start group border border-liberty-border/50 block transform-gpu translate-z-0"
            >
              {/* IMAGEN: Lógica condicional para LCP */}
              <img
                src={news.image}
                alt={news.title}
                loading={index < 2 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 transform-gpu will-change-transform group-hover:scale-105 bg-liberty-bg/50"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 pointer-events-none transform-gpu translate-z-0" />

              {/* CATEGORÍA */}
              <div className="absolute top-6 left-6 z-10">
                {/* Reemplazamos drop-shadow por text-shadow nativo */}
                <span className="text-xs font-bold text-white/90 uppercase tracking-[0.2em] [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)]">
                  {news.category}
                </span>
              </div>

              {/* CONTENIDO */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-10 flex flex-col justify-end">
                {/* Reemplazamos drop-shadow por text-shadow nativo */}
                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 [text-shadow:_0_2px_8px_rgba(0,0,0,0.9)]">
                  {news.title}
                </h3>

                <p className="text-sm md:text-base text-gray-200 mb-6 line-clamp-2 [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">
                  {news.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <span className="w-full sm:w-auto px-10 py-3 rounded-4xl font-bold text-sm bg-liberty-card border border-liberty-border text-white transition-all duration-300 group-hover:bg-liberty-border/40 group-hover:text-liberty-cyan text-center cursor-pointer inline-block will-change-transform">
                    Ver más
                  </span>
                </div>
              </div>
            </CinematicLink>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </section>
  );
}