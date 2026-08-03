import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { TransitionProvider } from "./context/TransitionContext";
import GlobalTransition from "./components/GlobalTransition";
import { LazyMotion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./ScrollToTop";

// 🚀 1. IMPORTACIONES ESTÁTICAS (Para la carga inicial)
// Estos componentes arman el Home. Se cargan de inmediato para no mostrar el loader al entrar.
import Hero from "./components/Hero";
import NewsCarousel from "./components/NewCarousel";
import PropuestasPreview from "./components/PropuestasPreview";
import NosotrosPreview from "./components/NosotrosPreview";
import RepresentantesPreview from "./components/RepresentantesPreview";
import DiputadosPreview from "./components/DiputadosPreview";
import ProponePreview from "./components/ProponePreview";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

// ✂️ 2. IMPORTACIONES LAZY (Code Splitting real)
// El navegador SOLO descargará el código de estas páginas si el usuario hace clic en sus enlaces.
const SeccionPropuestas = lazy(() => import("./components/SeccionPropuestas"));
const PropuestaDetalle = lazy(() => import("./components/PropuestaDetalle"));
const SedesLLA = lazy(() => import("./components/SedesLLA"));
const NoticiaDetalle = lazy(() => import("./components/NoticiasDetalle"));
const Sumate = lazy(() => import("./components/Sumate"));
const NosotrosHistoria = lazy(() => import("./components/NosotrosHistoria"));
const SeccionRepresentantes = lazy(
  () => import("./components/SeccionRepresentantes"),
);
const SeccionDiputados = lazy(() => import("./components/SeccionDiputados"));
const SeccionPropone = lazy(() => import("./components/SeccionPropone"));

// Fallback más profesional (Se mostrará solo al navegar hacia otras páginas)
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-15 h-15 border-4 border-liberty-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-liberty-text-secondary text-sm">Cargando...</p>
    </div>
  </div>
);

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  return (
    <>
      <Hero />
      <NewsCarousel />
      <PropuestasPreview />
      <NosotrosPreview />
      <DiputadosPreview />
      <RepresentantesPreview />
      <ProponePreview />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LazyMotion features={loadFeatures} strict>
        <TransitionProvider>
          <GlobalTransition />
          <ScrollToTop />

          <div className="bg-liberty-bg text-liberty-text font-satoshi">
            <Navbar />

            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Home se carga rápido, sin Suspense interrumpiendo el primer pantallazo */}
                <Route path="/" element={<Home />} />

                {/* Estas rutas se descargan bajo demanda gracias al Suspense y el lazy */}
                <Route path="/propuestas" element={<SeccionPropuestas />} />
                <Route path="/propuesta/:id" element={<PropuestaDetalle />} />
                <Route path="/noticia/:id" element={<NoticiaDetalle />} />
                <Route path="/sumate" element={<Sumate />} />
                <Route path="/nosotros" element={<NosotrosHistoria />} />
                <Route
                  path="/representantes"
                  element={<SeccionRepresentantes />}
                />
                <Route path="/diputados" element={<SeccionDiputados />} />
                <Route path="/propone" element={<SeccionPropone />} />
                <Route path="/sedes" element={<SedesLLA/>} />
              </Routes>
            </Suspense>

            <Footer />
          </div>
        </TransitionProvider>
      </LazyMotion>
    </BrowserRouter>
  );
}

export default App;
