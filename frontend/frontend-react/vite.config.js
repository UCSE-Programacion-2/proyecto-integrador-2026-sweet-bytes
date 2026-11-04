import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Plugin de React para Vite (habilita JSX y hot reload)
  plugins: [react()],
  
  // Configuración del servidor de desarrollo
  server: {
    // Puerto donde se ejecutará el servidor de desarrollo
    port: 5173,
    
    // Abre automáticamente el navegador al iniciar
    open: false
  },
  
  // Configuración de build para producción
  build: {
    // Carpeta donde se generarán los archivos de producción
    outDir: 'dist',
    
    // Genera archivos source map para debugging en producción
    sourcemap: true,
  },
});
