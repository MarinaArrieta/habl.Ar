/* import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importamos 'path' para resolver rutas absolutas

// Configuración de Vite para solucionar el error de "Invalid hook call" 
// forzando un alias al módulo de React principal.

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 1. Forzamos el alias para que TODAS las dependencias usen la misma copia de React
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
});
/* ```
eof

---

## ✅ Último Paso de Instalación

Para que `import path from 'path';` y `path.resolve` funcionen correctamente en Vite, necesitas instalar el paquete que proporciona estas definiciones:

Asegúrate de ejecutar este comando **dentro de tu carpeta `frontend`**:

``` 
bash
npm install @types/node --save-dev*/
