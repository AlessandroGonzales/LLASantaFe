import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import ScrollToTop from "./ScrollToTop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import NewsCarousel from "./components/NewCarousel";
import PropuestasPreview from "./components/PropuestasPreview";
import Footer from "./components/Footer";
import SeccionPropuestas from "./components/SeccionPropuestas";
import PropuestaDetalle from "./components/PropuestaDetalle";
import NoticiaDetalle from "./components/NoticiasDetalle";
import Sumate from "./components/Sumate";
import NosotrosPreview from "./components/NosotrosPreview";
import NosotrosHistoria from "./components/NosotrosHistoria";
import RepresentantesPreview from "./components/RepresentantesPreview";
import SeccionRepresentantes from "./components/SeccionRepresentantes";

function Home() {
  const location = useLocation();

  useEffect(() => {
    // Si la URL tiene un hash (ej: #preview), hacemos scroll suave hacia él
    if (location.hash) {
      const id = location.hash.replace("#", ""); // Quitamos el "#"
      const element = document.getElementById(id);
      
      if (element) {
        // Usamos un pequeño timeout para asegurar que React ya renderizó la sección
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      // Si estamos en el home pero no hay hash, vamos arriba de todo
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);
  
  return (
    <>
      <Hero />
      <NewsCarousel />
      <PropuestasPreview />
      <NosotrosPreview />
      <RepresentantesPreview />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className="min-h-screen bg-liberty-bg text-liberty-text font-satoshi antialiased selection:bg-liberty-primary selection:text-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/propuestas" element={<SeccionPropuestas />}/>
          <Route path="/propuesta/:id" element={<PropuestaDetalle />}/>
          <Route path="/noticia/:id" element={<NoticiaDetalle/>} />
          <Route path="/sumate" element={<Sumate />}/>
          <Route path="/nosotros" element={<NosotrosHistoria />}/>
          <Route path="/representantes" element={<SeccionRepresentantes />}/>
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;