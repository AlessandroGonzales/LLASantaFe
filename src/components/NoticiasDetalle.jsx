import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
// Elimina Instagram del import
import { ArrowLeft, Share2 } from "lucide-react";
// import { newsData } from "../data/newsData";
import { newsData } from "../data/noticiasData";

// Datos de prueba extendidos para la vista de detalle
export default function NoticiaDetalle() {
  const { id } = useParams();

  // Convertimos el id a número para buscar la noticia (asegúrate de que el id coincida con el tipo de dato)
  const noticia = newsData.find((n) => n.id === parseInt(id)) || newsData[0]; // Fallback al primero para demostración

  if (!noticia) {
    return (
      <div className="min-h-screen bg-liberty-bg flex items-center justify-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-liberty-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="text-center relative z-10">
          <h2 className="text-5xl font-black mb-6 uppercase tracking-tight">
            Noticia no encontrada
          </h2>
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-liberty-primary font-bold uppercase tracking-widest hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
            Volver al portal
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    const text = `Enterate la verdad que no te cuentan en la TV: *${noticia.title}*\n\nLee más acá: ${window.location.href}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="bg-liberty-bg text-white min-h-screen font-satoshi relative pb-20">
      {/* IMAGEN HERO INMERSIVA */}
      <div className="relative w-full h-[40vh] md:h-[50vh]">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-liberty-bg via-liberty-bg/80 to-transparent z-10" />
        <img
          src={noticia.image}
          alt={noticia.title}
          className="w-full h-full object-cover object-center scale-100"
        />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="w-full md:max-w-4/5 mx-auto px-6 md:px-12 relative z-20 -mt-20 md:-mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* COLUMNA IZQUIERDA (Texto de la Noticia) */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Categoría y Fecha */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black px-4 py-2 bg-liberty-primary text-black rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                  {noticia.category}
                </span>
                <span className="text-xs font-medium text-liberty-text-secondary tracking-widest">
                  {noticia.fecha}
                </span>
              </div>

              {/* Título Monumental */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.05] mb-6 drop-shadow-lg">
                {noticia.title}
              </h1>

              {/* Bajada */}
              <p className="text-xl md:text-2xl text-liberty-primary  mb-10 border-l-2 border-liberty-primary pl-6">
                {noticia.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Tarjeta de Datos Duros (Para mostrar gestión real) */}

              {/* Cuerpo de la noticia */}
              <div className="text-base md:text-lg leading-loose space-y-8">
                {/* Texto Parte 1 */}
                <div className="whitespace-pre-line">
                  {noticia.contenidoParte1}
                </div>

                {/* Imagen en el medio (Con estilo editorial) */}
                {noticia.imagenSecundaria && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl my-2 border border-white/10"
                  >
                    <img
                      src={noticia.imagenSecundaria}
                      alt="Más información"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}

                {/* Texto Parte 2 */}
                <div className="whitespace-pre-line">
                  {noticia.contenidoParte2}
                </div>
              </div>
            </motion.div>
          </div>

          {/* COLUMNA DERECHA (Acciones y Redes - Sticky) */}
          <div className="lg:col-span-3 relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-24 bg-gradient-to-b from-liberty-card to-liberty-bg border border-liberty-border/50 rounded-2xl p-6 lg:p-6 shadow-2xl"
            >
              <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-liberty-primary/70 to-transparent" />

              <h4 className="text-sm uppercase tracking-[0.2em] text-white mb-2 font-black text-center">
                Rompé el cerco
              </h4>
              <p className="text-sm text-liberty-text-secondary text-center mb-8 leading-relaxed">
                Los medios no te van a mostrar esto. Ayudanos a difundir la
                verdad compartiendo esta noticia.
              </p>

              <div className="space-y-4">
                {/* Botón X (Twitter) */}
                <a
                  href={noticia.linkX}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-black text-white border border-white/20 font-black uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-white hover:text-black transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.25H5.078z"></path>
                  </svg>
                  Ver en X
                </a>

                {/* Botón Instagram */}
                <a
                  href={noticia.linkInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-black uppercase tracking-wider py-4 px-6 rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  Ver en Instagram
                </a>

                <div className="relative py-4 flex items-center">
                  <div className="flex-grow border-t border-liberty-border/50"></div>
                  <span className="flex-shrink-0 mx-4 text-liberty-text-secondary text-xs uppercase font-bold tracking-widest">
                    O compartí directo
                  </span>
                  <div className="flex-grow border-t border-liberty-border/50"></div>
                </div>

                {/* Botón Compartir (WSP/General) */}
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-3 bg-liberty-primary/10 text-liberty-primary border border-liberty-primary/30 font-black uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-liberty-primary hover:text-black transition-all duration-300  cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                  Copiar Enlace
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-liberty-border/30 text-center">
                <span className="block text-white font-black tracking-[0.3em] uppercase text-sm">
                  VLLC
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
