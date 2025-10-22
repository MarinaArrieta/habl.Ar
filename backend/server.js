/* import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import tecnicasRoutes from "./routes/tecnicas.js";
import usuarios from "./routes/usuarios.js";
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
app.use('/api/usuarios', usuarios);
app.use("/calificaciones", calificacionesRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
}); */

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import tecnicasRoutes from "./routes/tecnicas.js";
import usuarios from "./routes/usuarios.js";
import calificacionesRoutes from "./routes/calificaciones.js";
// 1. Importar el loginController directamente desde el controlador
import { loginController } from "./controllers/usuariosController.js"; 

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

// 2. Definir la ruta específica para Login
// Esta línea maneja la petición POST a /api/login, que es lo que espera el frontend.
app.post("/api/login", loginController);

// Rutas existentes
app.use("/tecnicas", tecnicasRoutes);
app.use('/api/usuarios', usuarios);
app.use("/calificaciones", calificacionesRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
