import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true, // Esto abrirá automáticamente una pestaña en tu navegador con el gráfico
      filename: "bundle-analisis.html", // Guarda el reporte en este archivo
      gzipSize: true, // Muestra el peso real que descargarán los usuarios
    })
  ],
})