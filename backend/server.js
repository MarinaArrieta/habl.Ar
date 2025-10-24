import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import tecnicasRoutes from "./routes/tecnicas.js";
import usuarios from "./routes/usuarios.js";
import calificacionesRoutes from "./routes/calificaciones.js";
import { loginController } from "./controllers/usuariosController.js"; 

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

//app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use('/uploads', express.static('uploads'));
app.post("/api/login", loginController);
app.use("/tecnicas", tecnicasRoutes);
app.use('/api/usuarios', usuarios);
app.use("/calificaciones", calificacionesRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
