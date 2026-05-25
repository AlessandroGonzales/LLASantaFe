import { BrowserRouter } from "react-router-dom";

import ScrollToTop from "./scrolltotop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-liberty-bg text-liberty-text font-satoshi antialiased selection:bg-liberty-primary selection:text-white">
      <Navbar />

      <Hero/>
      </div>
     
    </BrowserRouter>
  );
}

export default App;
