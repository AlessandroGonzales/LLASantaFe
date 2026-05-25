import logoLibertad from "../assets/logoLibertad.png";
import backgroundImage from "../assets/grupoSantaFe.png"; // Reemplaza con la ruta real de tu imagen

export default function Hero() {
  return (
    <header className="relative min-h-[100vh] bg-hero-gradient flex flex-col justify-center items-center px-4 overflow-hidden border-b border-liberty-border">
      {/* Imagen de fondo */}
      <img
        src={backgroundImage}
        alt="Grupo de Santa Fe"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 object-top md:object-[center_28%]"
      />

      {/* Efectos de iluminación sutiles en el fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-liberty-bg/10 via-transparent to-liberty-bg z-0 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-liberty-primary/10 rounded-full blur-[140px] pointer-events-none z-10" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-liberty-cyan/10 rounded-full blur-[120px] pointer-events-none z-10" />

      <div className="max-w-4xl mx-auto text-center relative z-20 space-y-6">
        {/* CONTENEDOR DEL ÁGUILA (Centrado arriba del título) */}
        <div className="flex justify-center ">
          <img
            src={logoLibertad}
            alt="Águila La Libertad Avanza"
            className="h-36 md:h-40 w-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            onError={(e) => {
              // Si no encuentra la imagen todavía, oculta el recuadro roto para que no moleste
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Título Principal - Satoshi al extremo con font-black */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase text-white">
          La Libertad{" "}
          <span className="bg-gradient-to-r from-liberty-primary via-liberty-cyan to-liberty-accent bg-clip-text text-transparent">
            Avanza
          </span>
        </h1>

        <p className="text-xl md:text-2xl font-light tracking-widest text-liberty-text-secondary">
          SANTA FE
        </p>

        {/* CTAs Principales con Glows configurados */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-liberty-card border border-liberty-border text-liberty-text transition-all duration-300 hover:bg-liberty-border/40 hover:text-liberty-cyan cursor-pointer">
            Quiero Fiscalizar
          </button>

          <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-liberty-card border border-liberty-border text-liberty-text transition-all duration-300 hover:bg-liberty-border/40 hover:text-liberty-cyan cursor-pointer">
            Plataforma de Ideas
          </button>
        </div>
      </div>
    </header>
  );
}
