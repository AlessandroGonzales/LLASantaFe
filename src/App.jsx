import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./ScrollToTop";
import HomePage from "./pages/HomePage";

const SeccionPropuestas = lazy(() => import("./components/SeccionPropuestas"));
const PropuestaDetalle = lazy(() => import("./components/PropuestaDetalle"));
const NoticiaDetalle = lazy(() => import("./components/NoticiasDetalle"));
const Sumate = lazy(() => import("./components/Sumate"));
const NosotrosHistoria = lazy(() => import("./components/NosotrosHistoria"));
const SeccionRepresentantes = lazy(() => import("./components/SeccionRepresentantes"));
const SeccionDiputados = lazy(() => import("./components/SeccionDiputados"));

// Fallback más profesional
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-15 h-15 border-4 border-liberty-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-liberty-text-secondary text-sm">Cargando...</p>
    </div>
  </div>
);


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      <div className="min-h-screen bg-liberty-bg text-liberty-text font-satoshi antialiased selection:bg-liberty-primary selection:text-white">
        <Navbar />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            <Route path="/propuestas" element={<SeccionPropuestas />} />
            <Route path="/propuesta/:id" element={<PropuestaDetalle />} />
            <Route path="/noticia/:id" element={<NoticiaDetalle />} />
            <Route path="/sumate" element={<Sumate />} />
            <Route path="/nosotros" element={<NosotrosHistoria />} />
            <Route path="/representantes" element={<SeccionRepresentantes />} />
            <Route path="/diputados" element={<SeccionDiputados />}/>
          </Routes>
        </Suspense>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;