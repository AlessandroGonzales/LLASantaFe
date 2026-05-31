import { useState } from 'react';

// Base de datos local de propuestas (Array de objetos estándar)
const propuestasData = [
  {
    id: 1,
    alcance: 'provincial',
    categoria: 'economia',
    titulo: 'Eliminación de Ingresos Brutos',
    bajada: 'Reducción impositiva gradual para reactivar el sector productivo santafesino.',
    detalle: 'Se implementará un esquema de quita del impuesto a los ingresos brutos para pymes y productores agropecuarios en un plazo de 24 meses, financiado con el achicamiento del gasto político.'
  },
  {
    id: 2,
    alcance: 'provincial',
    categoria: 'seguridad',
    titulo: 'Modernización del Servicio Penitenciario',
    bajada: 'Construcción de penales de máxima seguridad alejados de los centros urbanos.',
    detalle: 'Inversión en tecnología de inhibición de señal absoluta y descentralización de las unidades penitenciarias actuales para cortar el vínculo operativo de las bandas organizadas.'
  },
  {
    id: 3,
    alcance: 'rosario',
    categoria: 'seguridad',
    titulo: 'Anillo de Seguridad Digital',
    bajada: 'Control absoluto de los accesos a la ciudad mediante IA y lectura de patentes.',
    detalle: 'Monitoreo en tiempo real coordinado entre fuerzas provinciales y federales, digitalizando el 100% de los ingresos por autopistas y rutas principales a Rosario.'
  },
  {
    id: 4,
    alcance: 'rosario',
    categoria: 'burocracia',
    titulo: 'Habilitaciones Comerciales Express',
    bajada: 'Apertura de comercios en 24 horas eliminando la burocracia municipal.',
    detalle: 'Trámite 100% digitalizado. El comerciante inicia su actividad bajo declaración jurada y las inspecciones se realizan a posteriori, eliminando las coimas y demoras de meses.'
  },
  {
    id: 5,
    alcance: 'santa-fe',
    categoria: 'burocracia',
    titulo: 'Digitalización Total de la Administración',
    bajada: 'Cierre de dependencias físicas obsoletas y unificación de trámites.',
    detalle: 'Optimización de los recursos de la capital provincial, migrando el 90% de los trámites vecinales a una plataforma única con validación biométrica.'
  }
];

export const SeccionPropuestas = () => {
  // Estados para controlar los filtros (inicializados como strings)
  const [alcanceFiltro, setAlcanceFiltro] = useState('todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  // Lógica de filtrado dinámico
  const propuestasFiltradas = propuestasData.filter((propuesta) => {
    const matchesAlcance = alcanceFiltro === 'todos' || propuesta.alcance === alcanceFiltro;
    const matchesCategoria = categoriaFiltro === 'todas' || propuesta.categoria === categoriaFiltro;
    return matchesAlcance && matchesCategoria;
  });

  return (
    <section className="bg-neutral-950 text-neutral-100 py-16 px-6 md:px-12 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-12 border-b border-neutral-800 pb-8">
          <span className="text-sm font-bold tracking-widest text-amber-500 uppercase">Plataforma Electoral</span>
          <h2 className="text-4xl font-extrabold tracking-tight mt-2 text-white md:text-5xl">
            Nuestras Propuestas
          </h2>
          <p className="text-neutral-400 mt-4 max-w-2xl text-lg">
            Un plan estructural, descentralizado y directo para devolverle la libertad y el orden a la provincia de Santa Fe.
          </p>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-col gap-6 mb-10 bg-neutral-900 p-6 rounded-xl border border-neutral-800">
          {/* Selector de Alcance Territorial */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-3 font-semibold">Territorio / Alcance</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todos', label: 'Ver Todo' },
                { id: 'provincial', label: 'Provincial (Macro)' },
                { id: 'rosario', label: 'Rosario' },
                { id: 'santa-fe', label: 'Santa Fe Capital' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setAlcanceFiltro(t.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md border ${
                    alcanceFiltro === t.id
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-transparent text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Ejes Temáticos */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-3 font-semibold">Ejes Temáticos</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todas', label: 'Todos los ejes' },
                { id: 'seguridad', label: 'Seguridad y Orden' },
                { id: 'economia', label: 'Economía y Producción' },
                { id: 'burocracia', label: 'Reforma del Estado' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoriaFiltro(c.id)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-full ${
                    categoriaFiltro === c.id
                      ? 'bg-amber-500 text-black'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Propuestas */}
        {propuestasFiltradas.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {propuestasFiltradas.map((item) => (
              <div 
                key={item.id} 
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between hover:border-neutral-700 transition-all duration-300"
              >
                <div>
                  {/* Etiquetas superiores de la Card */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">
                      {item.alcance === 'provincial' ? 'Provincia' : item.alcance}
                    </span>
                    <span className="text-xs text-amber-500 font-medium">
                      {item.categoria === 'seguridad' && '🛡️ Seguridad'}
                      {item.categoria === 'economia' && '📈 Economía'}
                      {item.categoria === 'burocracia' && '⚙️ Reforma'}
                    </span>
                  </div>

                  {/* Título y Descripción */}
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2">{item.titulo}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">{item.bajada}</p>
                </div>

                {/* Detalle técnico al pie de la Card */}
                <div className="mt-4 pt-4 border-t border-neutral-800/60 text-xs text-neutral-500 leading-relaxed">
                  {item.detalle}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Estado Vacío (Por si se filtra algo que no tiene contenido todavía) */
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl">
            <p className="text-neutral-500 text-lg">No se encontraron propuestas específicas para esta combinación de filtros.</p>
          </div>
        )}

      </div>
    </section>
  );
};