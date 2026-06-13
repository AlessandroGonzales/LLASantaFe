import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Share2, MapPin } from "lucide-react";
import { propuestasData } from "../data/propuestasData";

export default function PropuestaDetalle() {
  const { id } = useParams();
  const propuesta = propuestasData.find((p) => p.id === parseInt(id));
  
  if (!propuesta) {
    return (
      <div className="min-h-screen bg-liberty-bg flex items-center justify-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-liberty-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="text-center relative z-10">
          <h2 className="text-5xl font-black mb-6 uppercase tracking-tight">Propuesta no encontrada</h2>
          <Link to="/propuestas" className="inline-flex items-center gap-2 text-liberty-primary font-bold uppercase tracking-widest hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            Volver al plan de gobierno
          </Link>
        </div>
      </div>
    );
  }

  const handleShareWSP = () => {
    const text = `¡Mirá esta propuesta de La Libertad Avanza Santa Fe!\n\n*${propuesta.titulo}*\n${propuesta.bajada}\n\nLee más acá: ${window.location.href}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleDownloadPDF = () => {
    // Lógica para descargar el PDF
    alert("Iniciando descarga del documento completo...");
  };

  return (
    <main className="bg-liberty-bg text-white min-h-screen font-satoshi relative overflow-hidden pt-24 pb-20">
      {/* Fondos ambientales épicos */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-liberty-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-liberty-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Botón de Volver Integrado */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link 
            to="/propuestas" 
            className="inline-flex items-center gap-3 text-liberty-primary hover:text-white transition-colors group text-xs md:text-sm font-black tracking-[0.2em] uppercase"
          >
            <span className="p-2 rounded-full bg-liberty-primary/10 group-hover:bg-liberty-primary group-hover:text-black transition-colors duration-300">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </span>
            Volver a las propuestas
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* COLUMNA PRINCIPAL (Contenido) */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Etiquetas asimétricas */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest font-black px-4 py-2 bg-liberty-primary text-black rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                  <MapPin className="w-3.5 h-3.5" />
                  {propuesta.alcance === "provincial"
                    ? "Provincia de Santa Fe"
                    : propuesta.alcance}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest font-black text-white border border-liberty-border/50 px-4 py-2 rounded-sm bg-white/5 backdrop-blur-sm">
                  {propuesta.categoria}
                </span>
              </div>

              {/* Título y Bajada */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 uppercase tracking-tight leading-[1.05] mb-8">
                {propuesta.titulo}
              </h1>
              
              <div className="relative mb-12">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-liberty-primary to-transparent" />
                <p className="text-xl md:text-2xl text-liberty-text-secondary font-light leading-relaxed pl-6 lg:pl-8">
                  {propuesta.bajada}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Resumen Ejecutivo Destacado */}
              <div className="bg-gradient-to-br from-liberty-card to-liberty-bg border border-liberty-border/50 rounded-2xl p-8 mb-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-liberty-primary/10 rounded-full blur-[40px] group-hover:bg-liberty-primary/20 transition-colors duration-700" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-liberty-primary">
                  Resumen Ejecutivo
                </h3>
                <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                  {propuesta.detalle}
                </p>
              </div>

              {/* Texto Minucioso Completo */}
              <div className="whitespace-pre-line text-base md:text-lg font-light text-liberty-text-secondary leading-loose">
                {/* 
                  Nota: Si tu data no tiene 'contenidoCompleto' aún, esto mostrará el 'detalle' por defecto para que no quede vacío.
                  Asegúrate de agregar 'contenidoCompleto' a tus objetos en propuestasData.
                */}
                {propuesta.contenidoCompleto || "El desarrollo detallado de esta propuesta se encuentra en el documento oficial adjunto. Haz clic en 'Descargar Proyecto' para acceder al marco técnico y legislativo completo."}
              </div>
            </motion.div>
          </div>

          {/* COLUMNA LATERAL (Acciones - Sticky) */}
          <div className="lg:col-span-4 relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="sticky top-32 bg-gradient-to-b from-liberty-card to-liberty-card/20 border border-liberty-border/40 rounded-2xl p-6 lg:p-8 shadow-2xl backdrop-blur-xl"
            >
              {/* Acento superior */}
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-liberty-primary to-transparent" />

              <h4 className="text-xs uppercase tracking-[0.2em] text-white/50 mb-8 font-black text-center">
                Involucrate
              </h4>

              <div className="space-y-4">
                {/* Botón Descargar PDF */}
                <button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center gap-3 bg-liberty-primary text-black font-black uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-white hover:-translate-y-1 transition-all duration-300 shadow-[0_5px_20px_rgba(255,215,0,0.15)] hover:shadow-[0_10px_30px_rgba(255,215,0,0.3)]"
                >
                  <Download className="w-5 h-5" />
                  Descargar Proyecto
                </button>

                {/* Botón Compartir WSP */}
                <button
                  onClick={handleShareWSP}
                  className="w-full flex items-center justify-center gap-3 bg-liberty-card text-white border border-liberty-border/50 font-black uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-[#25D366] hover:border-[#25D366] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <Share2 className="w-5 h-5 group-hover:text-white text-[#25D366] transition-colors" />
                  Compartir vía WhatsApp
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-liberty-border/20 text-center">
                <p className="text-xs text-liberty-text-secondary leading-relaxed font-medium">
                  Difundiendo nuestras ideas nos ayudás a romper el cerco
                  mediático.
                  <span className="block mt-2 text-white font-black tracking-widest uppercase">
                    La Libertad Avanza
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}