import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "./ScrollToTop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import NewsCarousel from "./components/NewCarousel";
import PropuestasPreview from "./components/PropuestasPreview";
import Footer from "./components/Footer";
import SeccionPropuestas from "./components/SeccionPropuestas";
import PropuestaDetalle from "./components/PropuestaDetalle";

function Home() {
  return (
    <>
      <Hero />
      <NewsCarousel />
      <PropuestasPreview />
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
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;