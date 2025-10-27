// backend/routes/mercadopagoRoutes.js

import { Router } from "express";
const router = Router();
// Importamos verificarToken, pero NO lo usaremos en la ruta de pago
import { verificarToken } from "../controllers/usuariosController.js";

import pkg from '../controllers/mercadopagoController.cjs';
const { createPreferenceController, webhookController } = pkg;

// 🛑 CORRECCIÓN: ELIMINAR EL MIDDLEWARE 'verificarToken' de esta ruta.
router.post('/preference', createPreferenceController);

// Ruta para recibir notificaciones del webhook (sigue siendo pública)
router.post('/webhook', webhookController);

export default router;