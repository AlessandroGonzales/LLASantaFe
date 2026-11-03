import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { deploymentPolicyPlugin } from './scripts/deployment-policy.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    build: {
      rolldownOptions: {
        output: {
          // Agrupa la carga inicial; cada sección conserva sus imports diferidos.
          codeSplitting: {
            groups: [{ name: 'initial', tags: ['$initial'] }],
          },
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      deploymentPolicyPlugin({ apiBaseUrl: env.VITE_API_BASE_URL, preview: process.env.VERCEL_ENV === 'preview' }),
      ...(process.env.ANALYZE === '1' ? [visualizer({
        open: false,
        filename: ".artifacts/bundle-analisis.html",
        gzipSize: true,
      })] : [])
    ],
  }
})
