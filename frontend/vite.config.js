import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  build: {
    rollupOptions: {
      external: ['axios'],
      output: {
        globals: {
          axios: 'axios'
        }
      }
    }
  },
  // ==========================================================
  // 💡 AÑADIDO: CONFIGURACIÓN DE PROXY PARA REDIRIGIR /API A BACKEND (PUERTO 3000)
  // ==========================================================
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // El puerto de tu servidor Express
        changeOrigin: true,
        secure: false, // Usar 'false' si tu backend no usa HTTPS
      },
    }
  }
  // ==========================================================
});