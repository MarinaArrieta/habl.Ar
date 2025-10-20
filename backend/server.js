/* import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import tecnicasRoutes from "./routes/tecnicas.js";
import usuariosRoutes from "./routes/usuarios.js";  
import calificacionesRoutes from "./routes/calificaciones.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/tecnicas", tecnicasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/calificaciones", calificacionesRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
 */

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import tecnicasRoutes from "./routes/tecnicas.js";
import usuariosRoutes from "./routes/usuarios.js";  
import calificacionesRoutes from "./routes/calificaciones.js";

dotenv.config();

const app = express();

// Tomar el puerto desde el .env o usar 3000 por defecto
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Servir la carpeta uploads de forma estática
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Rutas existentes
app.use("/tecnicas", tecnicasRoutes);

// ❌ ELIMINAMOS esta línea: app.use("/usuarios", usuariosRoutes);
// Si la dejamos, el frontend tendría que llamar a /usuarios/psicologos,
// pero está llamando a /api/psicologos.

// ✅ CORRECCIÓN: Mapeamos el enrutador de usuarios (que incluye /psicologos)
// para que se acceda a través del prefijo /api.
app.use("/api", usuariosRoutes);

app.use("/calificaciones", calificacionesRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});