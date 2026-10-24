import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages sirve el proyecto en /ai-savings-calculator/; en local, en la raíz.
  base: process.env.GITHUB_PAGES === 'true' ? '/ai-savings-calculator/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    // Recharts ocupa ~500 kB sin comprimir (~165 kB gzip); jsPDF ya se carga bajo demanda.
    chunkSizeWarningLimit: 700,
  },
})
