import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: Without base './', Vite outputs absolute paths like /assets/...
  // which break when Electron loads the built index.html via file://
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
