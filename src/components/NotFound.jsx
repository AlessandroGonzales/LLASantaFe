import { useEffect } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle.jsx";

export default function NotFound() {
  useEffect(() => {
    const previousTitle = document.title;
    let robots = document.head.querySelector('meta[name="robots"]');
    const created = !robots;
    const previousContent = robots?.getAttribute("content");
    if (created) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    document.title = "Página no encontrada | La Libertad Avanza Santa Fe";
    robots.setAttribute("content", "noindex, follow");
    return () => {
      document.title = previousTitle;
      if (created) robots.remove();
      else if (previousContent === null) robots.removeAttribute("content");
      else robots.setAttribute("content", previousContent);
    };
  }, []);

  return (
    <section
      aria-labelledby="not-found-title"
      className="flex min-h-[80dvh] flex-col items-center justify-center px-6 pb-16 pt-32 text-center"
    >
      <p className="mb-4 text-sm font-bold tracking-[0.25em] text-liberty-primary">404</p>
      <SectionTitle id="not-found-title" title="Página no encontrada" />
      <p className="mt-4 max-w-md text-base leading-relaxed text-liberty-text-secondary">
        La página que buscás no existe o cambió de dirección.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-liberty-primary px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-liberty-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-liberty-bg"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
