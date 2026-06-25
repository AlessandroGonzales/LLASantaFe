import { motion } from "framer-motion";
import { History, ShieldAlert, TrendingUp } from "lucide-react";

import nosotrosimg1 from "../assets/uplunidos.jpg";
import nosotrosimg2 from "../assets/nosotros.jpg";
import nosotrosimg3 from "../assets/inicios.jpeg";

const gallery = [
  {
    src: nosotrosimg1,
    alt: "Inicio del movimiento en Santa Fe",
    className: "col-span-1 row-span-1",
  },
  {
    src: nosotrosimg2,
    alt: "Militancia y presencia territorial",
    className: "col-span-1 row-span-1",
  },
  {
    src: nosotrosimg3,
    alt: "Futuro de La Libertad Avanza Santa Fe",
    className: "col-span-2 row-span-1",
  },
];

export default function NosotrosPreview() {
  return (
    <section
      id="nosotros"
      className="relative w-full py-24 md:py-40 flex justify-center px-6 md:px-16 lg:px-24 xl:px-32 z-10 overflow-hidden bg-liberty-bg"
    >
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[800px] h-[800px] bg-liberty-cyan/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/4 w-[800px] h-[800px] bg-liberty-primary/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">

          {/* TEXTO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-12 lg:col-span-7 pr-0 lg:pr-10"
          >
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-liberty-cyan text-[13px] md:text-sm font-black uppercase tracking-[0.4em] shadow-liberty-cyan-glow">
                  Nuestra Historia
                </span>
              </div>

              <h2 className="text-5xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.85]">
                El rugido que <br />
                  despertó
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-liberty-primary">
                  a Santa Fe
                </span>{" "}
              </h2>
            </div>

            <p className="text-lg text-liberty-text-secondary leading-relaxed max-w-2xl">
              No somos políticos tradicionales. Somos ciudadanos de a pie, trabajadores y estudiantes
              cansados de que nos roben el futuro. Somos la{" "}
              <strong className="text-white font-medium drop-shadow-md">única opción real</strong> para
              cambiar el rumbo.
            </p>

            <div className="relative pl-6 md:pl-8 border-l border-white/10 space-y-8 py-2">
              <div className="absolute top-0 left-[-1px] w-[2px] h-1/3 bg-gradient-to-b from-liberty-primary to-transparent" />

              <motion.div whileHover={{ x: 5 }} className="flex items-start gap-5 group transition-transform">
                <History className="w-6 h-6 text-liberty-primary shrink-0 group-hover:scale-110 transition-all duration-500" />
                <p className="text-sm md:text-lg text-gray-100 group-hover:text-white transition-colors duration-500">
                  De dónde venimos y cómo se forjó este movimiento.
                </p>
              </motion.div>

              <motion.div whileHover={{ x: 5 }} className="flex items-start gap-5 group transition-transform">
                <ShieldAlert className="w-6 h-6 text-liberty-cyan shrink-0 group-hover:scale-110 transition-all duration-500" />
                <p className="text-sm md:text-lg text-gray-100 group-hover:text-white transition-colors duration-500">
                  Las batallas de frente que estamos dando hoy en la provincia.
                </p>
              </motion.div>

              <motion.div whileHover={{ x: 5 }} className="flex items-start gap-5 group transition-transform">
                <TrendingUp className="w-6 h-6 text-liberty-accent shrink-0 group-hover:scale-110 transition-all duration-500" />
                <p className="text-sm md:text-lg text-gray-100 group-hover:text-white transition-colors duration-500">
                  Nuestro plan definitivo para volver a ser potencia.
                </p>
              </motion.div>
            </div>

            {/* BOTÓN — solo en desktop, debajo del texto */}
            <div className="hidden lg:block">
              <button
                onClick={() => (window.location.href = "/nosotros")}
                className="group relative inline-flex items-center justify-center w-1/3 px-8 py-4 font-bold text-white transition-all duration-300 bg-liberty-card border border-liberty-border rounded-4xl hover:bg-liberty-border/40 hover:border-liberty-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] overflow-hidden cursor-pointer"
              >
                Conocer nuestra historia
              </button>
            </div>
          </motion.div>

          {/* GALERÍA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 w-full"
          >
            <div
              className="relative w-full cursor-pointer"
              onClick={() => (window.location.href = "/nosotros")}
            >
              <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.02] backdrop-blur-[2px]">
                <div className="grid grid-cols-2 gap-3 auto-rows-[250px] lg:auto-rows-[360px]">
                  {gallery.map((item, index) => (
                    <motion.div
                      key={item.alt}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: 0.1 * index, ease: "easeOut" }}
                      className={`${item.className} relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 shadow-xl`}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTÓN — solo en mobile, debajo de las imágenes */}
            <div className="pt-6 lg:hidden">
              <button
                onClick={() => (window.location.href = "/nosotros")}
                className="group relative  items-center justify-center w-full md:w-3.5 px-8 py-4 font-bold text-white transition-all duration-300 bg-liberty-card border border-liberty-border rounded-4xl hover:bg-liberty-border/40 hover:border-liberty-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] overflow-hidden cursor-pointer"
              >
                Conocer nuestra historia
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
