import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost',
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    target: 'es2018'
  }
})