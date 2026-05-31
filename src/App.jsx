import { BrowserRouter } from "react-router-dom";

import ScrollToTop from "./scrolltotop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import NewsCarousel from "./components/NewCarousel";
import PropuestasPreview from "./components/PropuestasPreview";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-liberty-bg text-liberty-text font-satoshi antialiased selection:bg-liberty-primary selection:text-white">
      <Navbar />
      <Hero/>
      <NewsCarousel/>
      <PropuestasPreview/>
      <Footer/>
      </div>
     
    </BrowserRouter>
  );
}

export default App;
