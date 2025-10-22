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
    getPsicologosListController, 
} from "../controllers/usuariosController.js";

const router = Router();

const adminAuth = (req, res, next) => {
    if (req.user && req.user.tipo === 'admin') {
        next();
    } else {
        res.status(403).json({ error: "Acceso denegado. Se requiere ser Administrador." });
    }
};

router.get("/psicologos", getPsicologosListController);

router.post(
    "/register-public",
    upload.fields([
        { name: "foto_titulo", maxCount: 1 },
        { name: "certificado", maxCount: 1 },
        { name: "foto_perfil", maxCount: 1 },
    ]),
    registerPublicController
);

// Login
router.post("/login", loginController);

// Ruta para que un ADMIN registre a otro ADMIN
router.post(
    "/register-admin",
    verificarToken,
    adminAuth,
    registerAdminController
);

// Obtener todos los usuarios (Solo Admin)
router.get("/", verificarToken, adminAuth, getUsuariosController);

// Obtener, Actualizar, Eliminar (Rutas para el perfil propio o gestionadas por Admin)
router.get("/:id", verificarToken, getUsuarioController);
router.put("/:id", verificarToken, updateUsuarioController);
router.delete("/:id", verificarToken, deleteUsuarioController);


export default router;