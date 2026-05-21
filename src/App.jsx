import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-6 selection:bg-teal-500 selection:text-slate-950">
      
      {/* Contenedor Principal */}
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        
        {/* Encabezado */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Vite + Tailwind v4
          </h1>
          <p className="text-sm text-slate-400">
            Entorno de desarrollo configurado correctamente
          </p>
        </div>

        {/* Indicador de Estado */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Estilos Listos
        </div>

        <hr className="border-slate-850" />

        {/* Sección Interactiva (Contador) */}
        <div className="space-y-4">
          <p className="text-slate-300 font-mono text-lg">
            Valor actual: <span className="text-teal-400 font-bold">{count}</span>
          </p>
          
          <button
            onClick={() => setCount(count + 1)}
            className="w-full py-3 px-4 rounded-xl font-medium text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Incrementar Contador
          </button>
        </div>

      </div>

      {/* Footer sutil */}
      <p className="mt-8 text-xs text-slate-600 font-mono">
        LLASantaFe • {new Date().getFullYear()}
      </p>

    </div>
  )
}

export default App