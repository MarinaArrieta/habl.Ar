import { Router } from "express";
import upload from "../utils/upload.js";
import {
  registerPublicController,
  registerAdminController,
  loginController,
  getUsuariosController,
  getUsuarioController,
  updateUsuarioController,
  deleteUsuarioController,
  verificarToken,
} from "../controllers/usuariosController.js";

const router = Router();

// Middleware de Autorización (solo Admin)
// Este middleware chequea si el usuario verificado por el token es un admin.
const adminAuth = (req, res, next) => {
    if (req.user && req.user.tipo === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Acceso denegado. Se requiere ser Administrador." });
    }
};

// Rutas Públicas
// Registro público (usuarios comunes, psicólogos, voluntarios)
router.post(
  "/register-public",
  upload.fields([
    { name: "foto_titulo", maxCount: 1 },
    { name: "certificado", maxCount: 1 },
  ]),
  registerPublicController // 🚨 Usamos el nombre corregido
);

// Login
router.post("/login", loginController);


// Rutas Protegidas
// Ruta para que un ADMIN registre a otro ADMIN
router.post(
    "/register-admin", 
    verificarToken, 
    adminAuth, 
    registerAdminController
);

// Obtener todos los usuarios
router.get("/", verificarToken, adminAuth, getUsuariosController); 

// Obtener, Actualizar, Eliminar
router.get("/:id", verificarToken, getUsuarioController);
router.put("/:id", verificarToken, updateUsuarioController);
router.delete("/:id", verificarToken, deleteUsuarioController);


export default router;