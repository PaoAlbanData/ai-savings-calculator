import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Recharts ocupa ~500 kB sin comprimir (~165 kB gzip); jsPDF ya se carga bajo demanda.
    chunkSizeWarningLimit: 700,
  },
})
