import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import sedeRosario from "../assets/sedeRosario.webp"

// 1. Array actualizado: Se agregaron lat y lng reales a cada sede
const mockSedes = [
  {
    id: 1,
    city: "Rosario",
    address: "Sarmiento 624, Centro",
    imageUrl: sedeRosario, 
    defaultVisible: true,
    lat: -32.94439811196542,
    lng: -60.63782675108395
  },
  {
    id: 2,
    city: "Santa Fe Capital",
    address: "Avenida Siempreviva 742",
    imageUrl: sedeRosario, 
    defaultVisible: true,
    lat: -31.6333,
    lng: -60.7000,
  },
  {
    id: 3,
    city: "Rafaela",
    address: "Bulevar Lehmann 456",
    imageUrl: "", 
    defaultVisible: false,
    lat: -31.2503,
    lng: -61.4867,
  },
  {
    id: 4,
    city: "Venado Tuerto",
    address: "San Martín 890",
    imageUrl: "", 
    defaultVisible: false,
    lat: -33.7456,
    lng: -61.9688,
  },
];

export default function SedesLLA() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // 2. Nuevo estado: Controla qué sede está seleccionada. 
  // Por defecto toma la primera que tenga defaultVisible en true.
  const [selectedSede, setSelectedSede] = useState(
    mockSedes.find((s) => s.defaultVisible) || mockSedes[0]
  );

  const displaySedes =
    searchTerm.trim() === ""
      ? mockSedes.filter((sede) => sede.defaultVisible)
      : mockSedes.filter((sede) =>
          sede.city.toLowerCase().includes(searchTerm.toLowerCase())
        );

  // 3. Generación dinámica de la URL del mapa sin API Key
  // Usamos el formato q=LAT,LNG y z=15 para el nivel de zoom
  const mapSrc = `https://maps.google.com/maps?q=${selectedSede.lat},${selectedSede.lng}&z=15&output=embed`;

  return (
    <section className="bg-liberty-bg text-white min-h-screen py-20 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-liberty-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Nuestras <span className="text-liberty-primary">Sedes</span>
          </h2>
          <p className="text-lg text-liberty-text-secondary border-l-2 border-liberty-primary pl-4">
            Encontrá el búnker de La Libertad Avanza más cercano a tu ciudad y sumate a la fuerza.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* COLUMNA IZQUIERDA - MAPA */}
          <div className="lg:col-span-7 relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden border border-liberty-border/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] group">
            <div className="absolute inset-0 bg-liberty-bg/20 pointer-events-none z-10 transition-colors duration-500 group-hover:bg-transparent" />
            
            {/* 4. Iframe dinámico: el src ahora apunta a mapSrc y le agregamos una key para forzar el re-render visual si es necesario (opcional) */}
            <iframe
              key={selectedSede.id}
              title={`Mapa de Sede ${selectedSede.city}`}
              src={mapSrc}
              className="w-full h-full border-0 grayscale invert opacity-80 transition-opacity duration-300"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* COLUMNA DERECHA - BUSCADOR Y LISTA */}
          <div className="lg:col-span-5 flex flex-col h-full">
            
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-liberty-text-secondary" />
              </div>
              <input
                type="text"
                placeholder="Buscar por ciudad... (Ej: Rosario)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-liberty-card border border-liberty-border/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder-liberty-text-secondary focus:outline-none focus:border-liberty-primary focus:ring-1 focus:ring-liberty-primary transition-all duration-300"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              <AnimatePresence mode="popLayout">
                {displaySedes.length > 0 ? (
                  displaySedes.map((sede) => {
                    // 5. Verificamos si esta tarjeta es la seleccionada actualmente
                    const isSelected = selectedSede.id === sede.id;

                    return (
                      <motion.div
                        key={sede.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedSede(sede)} // 6. Evento click para seleccionar
                        // 7. Clases dinámicas: Si está seleccionado, cambia el borde y el fondo
                        className={`cursor-pointer overflow-hidden flex transition-all duration-300 rounded-xl border ${
                          isSelected
                            ? "bg-liberty-primary/10 border-liberty-primary shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                            : "bg-liberty-card/50 border-liberty-border/30 hover:border-liberty-primary/50 hover:bg-liberty-card"
                        }`}
                      >
                        <div className="w-1/3 bg-black relative">
                          {sede.imageUrl ? (
                            <img
                              src={sede.imageUrl}
                              alt={`Sede ${sede.city}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                              <MapPin className={`w-8 h-8 ${isSelected ? "text-liberty-primary" : "text-liberty-text-secondary/50"}`} />
                            </div>
                          )}
                        </div>

                        <div className="w-2/3 p-5 flex flex-col justify-center">
                          <span className="text-[10px] uppercase tracking-widest text-liberty-primary font-bold mb-1 block">
                            Sede Oficial
                          </span>
                          <h3 className={`text-xl font-black uppercase tracking-tight mb-2 transition-colors ${isSelected ? "text-liberty-primary" : "text-white"}`}>
                            {sede.city}
                          </h3>
                          <div className={`flex items-start gap-2 text-sm transition-colors ${isSelected ? "text-white/90" : "text-liberty-text-secondary"}`}>
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>{sede.address}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-liberty-text-secondary"
                  >
                    No se encontraron sedes en esa ciudad.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}