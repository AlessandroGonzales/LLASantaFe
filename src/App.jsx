import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Componentes esenciales (deben cargar rápido, son los primeros que ve el usuario)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./ScrollToTop";

// Componentes pesados: cargados de forma "perezosa" (Lazy)
const Hero = lazy(() => import("./components/Hero"));
const NewsCarousel = lazy(() => import("./components/NewCarousel"));
const PropuestasPreview = lazy(() => import("./components/PropuestasPreview"));
const NosotrosPreview = lazy(() => import("./components/NosotrosPreview"));
const RepresentantesPreview = lazy(() => import("./components/RepresentantesPreview"));
const SeccionPropuestas = lazy(() => import("./components/SeccionPropuestas"));
const PropuestaDetalle = lazy(() => import("./components/PropuestaDetalle"));
const NoticiaDetalle = lazy(() => import("./components/NoticiasDetalle"));
const Sumate = lazy(() => import("./components/Sumate"));
const NosotrosHistoria = lazy(() => import("./components/NosotrosHistoria"));
const SeccionRepresentantes = lazy(() => import("./components/SeccionRepresentantes"));

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } else {
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
        
        {/* Suspense muestra un fallback mientras el componente se descarga */}
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/propuestas" element={<SeccionPropuestas />}/>
            <Route path="/propuesta/:id" element={<PropuestaDetalle />}/>
            <Route path="/noticia/:id" element={<NoticiaDetalle/>} />
            <Route path="/sumate" element={<Sumate />}/>
            <Route path="/nosotros" element={<NosotrosHistoria />}/>
            <Route path="/representantes" element={<SeccionRepresentantes />}/>
          </Routes>
        </Suspense>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;