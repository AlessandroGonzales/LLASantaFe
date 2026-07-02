import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { TransitionProvider } from "./context/TransitionContext";
import GlobalTransition from "./components/GlobalTransition";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./ScrollToTop";

// Lazy imports
const Hero = lazy(() => import("./components/Hero"));
const NewsCarousel = lazy(() => import("./components/NewCarousel"));
const PropuestasPreview = lazy(() => import("./components/PropuestasPreview"));
const NosotrosPreview = lazy(() => import("./components/NosotrosPreview"));
const RepresentantesPreview = lazy(() => import("./components/RepresentantesPreview"),);
const DiputadosPreview = lazy(() => import("./components/DiputadosPreview"));

const SeccionPropuestas = lazy(() => import("./components/SeccionPropuestas"));
const PropuestaDetalle = lazy(() => import("./components/PropuestaDetalle"));
const NoticiaDetalle = lazy(() => import("./components/NoticiasDetalle"));
const Sumate = lazy(() => import("./components/Sumate"));
const NosotrosHistoria = lazy(() => import("./components/NosotrosHistoria"));
const SeccionRepresentantes = lazy(() => import("./components/SeccionRepresentantes"),);
const SeccionDiputados = lazy(() => import("./components/SeccionDiputados"));
const ProponePreview = lazy(() => import ("./components/ProponePreview"))

// Fallback más profesional
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
      <TransitionProvider>
        <GlobalTransition />
        <ScrollToTop />

        <div className="min-h-screen bg-liberty-bg text-liberty-text font-satoshi">
          <Navbar />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />

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
            </Routes>
          </Suspense>

          <Footer />
        </div>
      </TransitionProvider>
    </BrowserRouter>
  );
}

export default App;
