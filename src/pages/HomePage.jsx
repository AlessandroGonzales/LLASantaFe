import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Hero from "../components/Hero";
import NewsCarousel from "../components/NewCarousel";
import PropuestasPreview from "../components/PropuestasPreview";
import NosotrosPreview from "../components/NosotrosPreview";
import DiputadosPreview from "../components/DiputadosPreview";
import RepresentantesPreview from "../components/RepresentantesPreview";

export default function HomePage() {
  const location = useLocation();

  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");

      requestAnimationFrame(() => {
        setTimeout(() => {
          document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location]);

  // Esperamos a que Safari pinte el Hero
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowRest(true);
      });
    });
  }, []);

  return (
    <>
      <Hero />

      {showRest && (
        <>
          <NewsCarousel />
          <PropuestasPreview />
          <NosotrosPreview />
          <DiputadosPreview />
          <RepresentantesPreview />
        </>
      )}
    </>
  );
}