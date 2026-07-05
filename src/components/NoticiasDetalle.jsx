import { useParams } from "react-router-dom";
import { Share2 } from "lucide-react";
import { newsData } from "../data/noticiasData";

export default function NoticiaDetalle() {
  const { id } = useParams();
  const noticia =
    newsData.find((n) => n.id === parseInt(id || "")) || newsData[0];

  const handleShare = () => {
    const text = `Entérate de la última noticia de La Libertad Avanza Santa Fe: *${noticia.title}*\n\nLee más acá: ${window.location.href}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Clases centralizadas para dar formato profesional al HTML inyectado
  const htmlContentClasses = `
    text-base md:text-lg leading-relaxed text-liberty-text-secondary text-balance
    [&>p]:mb-6 [&>p:last-child]:mb-0
    [&>h3]:text-2xl [&>h3]:md:text-3xl [&>h3]:font-black [&>h3]:text-white [&>h3]:uppercase [&>h3]:tracking-tight [&>h3]:mt-12 [&>h3]:mb-6 [&>h3]:border-b [&>h3]:border-liberty-border/50 [&>h3]:pb-4
    [&>strong]:text-white [&>strong]:font-bold [&>strong]:tracking-wide
    [&>.final-salute]:text-liberty-cyan [&>.final-salute]:font-black [&>.final-salute]:uppercase [&>.final-salute]:tracking-[0.2em] [&>.final-salute]:mt-10
  `;

  return (
    <main className="bg-liberty-bg text-white min-h-screen relative pb-20">
      {/* IMAGEN HERO INMERSIVA */}
      <div className="relative w-full h-[40vh] md:h-[50vh] ">
        <div className="absolute inset-0 bg-gradient-to-t from-liberty-bg via-liberty-bg/30 to-transparent z-10" />

        <img
          src={noticia.image}
          alt={noticia.title}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="w-full md:max-w-4/5 mx-auto px-6 md:px-12 relative z-20 -mt-16 md:-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* COLUMNA IZQUIERDA - CUERPO DE LA NOTICIA */}
          <div className="lg:col-span-8">
            <div>
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black px-4 py-2 bg-liberty-primary text-black rounded-sm">
                  {noticia.category}
                </span>
                <span className="text-xs font-medium text-liberty-text-secondary tracking-widest">
                  {noticia.fecha}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.05] mb-6">
                {noticia.title}
              </h1>

              {/* Bajada */}
              <p className="text-xl md:text-2xl text-liberty-primary mb-10 border-l-2 border-liberty-primary pl-6">
                {noticia.description}
              </p>
            </div>

            <div className="space-y-8">
              {/* Cuerpo de la noticia: PARTE 1 */}
              <div 
                className={htmlContentClasses}
                dangerouslySetInnerHTML={{ __html: noticia.contenidoParte1 }}
              />

              {/* Imagen Secundaria */}
              {noticia.imagenSecundaria && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden my-12 border border-white/10 shadow-2xl">
                  <img
                    src={noticia.imagenSecundaria}
                    alt="Imagen complementaria"
                    loading="lazy"
                    className="w-full h-full object-cover"
                    decoding="async"
                  />
                </div>
              )}

              {/* Cuerpo de la noticia: PARTE 2 */}
              <div 
                className={htmlContentClasses}
                dangerouslySetInnerHTML={{ __html: noticia.contenidoParte2 }}
              />
            </div>
          </div>

          {/* COLUMNA DERECHA - STICKY SIDEBAR */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-24 bg-liberty-card border border-liberty-border/50 rounded-2xl p-6 shadow-xl">
              <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-liberty-primary to-transparent" />

              <h4 className="text-sm uppercase tracking-[0.2em] text-white mb-2 font-black text-center">
                Rompé el cerco
              </h4>
              <p className="text-sm text-liberty-text-secondary text-center mb-8 leading-relaxed">
                Los medios no te van a mostrar esto. Ayudanos a difundir la verdad compartiendo esta noticia.
              </p>

              <div className="space-y-4">
                {/* Botón X */}
                <a
                  href={noticia.linkX}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-black text-white border border-white/20 font-black uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-white hover:text-black transition-colors duration-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.25H5.078z" />
                  </svg>
                  Ver en X
                </a>

                {/* Botón Instagram */}
                <a
                  href={noticia.linkInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-black uppercase tracking-wider py-4 px-6 rounded-xl hover:scale-[1.02] transition-transform duration-300"
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
                  <div className="flex-grow border-t border-liberty-border/50" />
                  <span className="flex-shrink-0 mx-4 text-liberty-text-secondary text-xs uppercase font-bold tracking-widest">
                    O compartí directo
                  </span>
                  <div className="flex-grow border-t border-liberty-border/50" />
                </div>

                {/* Botón WhatsApp */}
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-3 bg-liberty-primary/10 text-liberty-primary border border-liberty-primary/30 font-black uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-liberty-primary hover:text-black cursor-pointer transition-colors duration-300"
                >
                  <Share2 className="w-5 h-5" />
                  Compartir en WhatsApp
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-liberty-border/30 text-center">
                <span className="block text-white font-black tracking-[0.3em] uppercase text-sm">
                  VLLC
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}