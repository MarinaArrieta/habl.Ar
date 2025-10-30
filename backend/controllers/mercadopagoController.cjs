// backend/controllers/mercadopagoController.cjs

// --- MÓDULOS CJS ---
const mercadopago = require("mercadopago");
require("dotenv/config");

// --- MÓDULO ESM (connection.js) ---
let pool;
(async () => {
  try {
    const connectionModule = await import("../db/connection.js");
    pool = connectionModule.default || connectionModule;
    console.log("✅ Conexión a la DB (Pool) cargada en mercadopagoController.cjs");
  } catch (error) {
    console.error("❌ Error cargando el Pool de la base de datos:", error);
    process.exit(1);
  }
})();

// ==========================================================
// CONFIGURACIÓN DE MERCADO PAGO
// ==========================================================
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

// ==========================================================
// CONSTANTES Y URLs SEGURAS
// ==========================================================
const MEMBER_FEE_AMOUNT = 5000;
const MEMBER_FEE_TITLE = "Membresía de Psicólogo";

// Validamos y limpiamos las URLs
const FRONTEND_URL =
  (process.env.FRONTEND_URL?.startsWith("http")
    ? process.env.FRONTEND_URL
    : `https://${process.env.FRONTEND_URL || "habl-ar.vercel.app"}`) || "";

const BACKEND_URL =
  (process.env.BACKEND_URL?.startsWith("http")
    ? process.env.BACKEND_URL
    : `https://${process.env.BACKEND_URL || "habl-ar.onrender.com"}`) || "";

if (!process.env.MP_ACCESS_TOKEN) {
  console.warn("⚠️ MP_ACCESS_TOKEN no definido en las variables de entorno.");
}

console.log(`🌐 FRONTEND_URL: ${FRONTEND_URL}`);
console.log(`🌐 BACKEND_URL: ${BACKEND_URL}`);

// ==========================================================
// CREATE PREFERENCE CONTROLLER
// ==========================================================
const createPreferenceController = async (req, res) => {
  try {
    const { userId, userEmail } = req.body;

    if (!userId || !userEmail) {
      console.error("Faltan datos en req.body:", req.body);
      return res
        .status(400)
        .json({ error: "Faltan datos del usuario (userId, userEmail)." });
    }

    const preference = {
      items: [
        {
          title: MEMBER_FEE_TITLE,
          unit_price: MEMBER_FEE_AMOUNT,
          quantity: 1,
          currency_id: "ARS",
        },
      ],
      payer: { email: userEmail },
      back_urls: {
        success: `${FRONTEND_URL}/`,
        failure: `${FRONTEND_URL}/`,
        pending: `${FRONTEND_URL}/`,
      },
      auto_return: "approved",
      external_reference: userId.toString(),
      notification_url: `${BACKEND_URL}/api/mercadopago/webhook`,
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      preferenceId: response.body.id,
      initPoint: response.body.init_point,
    });
  } catch (error) {
    console.error("❌ Error al crear la preferencia de MP:", error);
    res.status(500).json({ error: "Error interno al iniciar el proceso de pago" });
  }
};

// ==========================================================
// WEBHOOK CONTROLLER
// ==========================================================
const webhookController = async (req, res) => {
  try {
    const { query } = req;

    if (!pool) {
      console.error("❌ DB Pool no disponible. MP reintentará.");
      return res.sendStatus(503);
    }

    if (query.topic === "payment") {
      const paymentId = query.id;

      if (!paymentId) return res.sendStatus(400);

      const paymentDetail = await mercadopago.payment.findById(paymentId);

      const data = paymentDetail.body;
      const userId = data.external_reference;
      const status = data.status;

      console.log(`[MP Webhook] Pago ID: ${paymentId}, Usuario ID: ${userId}, Estado: ${status}`);

      if (status === "approved") {
        const [result] = await pool.query(
          "UPDATE usuarios SET membresia_activa = TRUE, fecha_membresia = NOW() WHERE id = ?",
          [userId]
        );

        if (result.affectedRows > 0) {
          console.log(`✅ Membresía activada con éxito para Usuario ID: ${userId}`);
        } else {
          console.error(`⚠️ No se pudo actualizar el usuario ID: ${userId}.`);
        }
      } else {
        console.log(`❌ Pago no aprobado para Usuario ID ${userId}. Estado: ${status}`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en el Webhook de Mercado Pago:", error);
    res.sendStatus(200);
  }
};

// ==========================================================
// EXPORTACIÓN FINAL
// ==========================================================
module.exports = {
  createPreferenceController,
  webhookController,
};
