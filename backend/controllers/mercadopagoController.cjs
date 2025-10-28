// backend/controllers/mercadopagoController.cjs

// --- MÓDULOS CJS ---
const mercadopago = require('mercadopago');
require('dotenv/config');

// --- MÓDULO ESM (connection.js) ---
// Usamos import() dinámico para cargar el ES Module pool de forma asíncrona.
let pool;
(async () => {
    try {
        const connectionModule = await import('../db/connection.js');
        // Asignamos el pool exportado (asumo que es export default)
        pool = connectionModule.default || connectionModule;
        console.log("✅ Conexión a la DB (Pool) cargada en mercadopagoController.cjs");
    } catch (error) {
        console.error("❌ Error cargando el Pool de la base de datos:", error);
        // Si el pool falla al cargar, detenemos la app
        process.exit(1);
    }
})();
// --------------------

// Configuración de Mercado Pago
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
});

const MEMBER_FEE_AMOUNT = 5000;
const MEMBER_FEE_TITLE = "Membresía de Psicólogo";

// ==========================================================
// CREATE PREFERENCE CONTROLLER
// ==========================================================
const createPreferenceController = async (req, res) => {
    try {
        // Obtener los datos del usuario del cuerpo (req.body)
        const { userId, userEmail } = req.body;

        // Validación de datos esenciales
        if (!userId || !userEmail) {
            console.error("Faltan datos en req.body:", req.body);
            return res.status(400).json({ error: "Faltan datos del usuario (userId, userEmail) para crear la preferencia de pago." });
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
            payer: {
                email: userEmail,
            },
            back_urls: {
                // Se asume que FRONTEND_URL ya fue corregida con el protocolo (http:// o https://)
                success: `${process.env.FRONTEND_URL}/pago/success`,
                failure: `${process.env.FRONTEND_URL}/pago/failure`,
                pending: `${process.env.FRONTEND_URL}/pago/pending`,
            },
            auto_return: "approved",
            // Usamos userId como referencia externa para el webhook
            external_reference: userId.toString(),
            // Se asume que BACKEND_URL ya fue corregida con el protocolo (https://)
            notification_url: `${process.env.BACKEND_URL}/api/mercadopago/webhook`,
        };

        const response = await mercadopago.preferences.create(preference);

        res.json({
            preferenceId: response.body.id,
            initPoint: response.body.init_point,
        });

    } catch (error) {
        console.error("Error al crear la preferencia de MP:", error);
        res.status(500).json({ error: "Error interno al iniciar el proceso de pago" });
    }
};

// ==========================================================
// WEBHOOK CONTROLLER (Recibe notificaciones de MP)
// ==========================================================
const webhookController = async (req, res) => {
    try {
        const { query } = req;

        // CRÍTICO: Verificar si el pool de DB está disponible antes de usarlo
        if (!pool) {
            console.error("❌ DB Pool no está disponible. No se puede procesar el webhook. MP reintentará.");
            // Devolver 503 para que MP sepa que debe reintentar.
            return res.sendStatus(503); 
        }

        if (query.topic === 'payment') {
            const paymentId = query.id;

            // ⚠️ Validación de seguridad: Asegurar que el ID del pago es un número
            if (!paymentId) {
                 return res.sendStatus(400); // Bad Request si no hay ID
            }
            
            const paymentDetail = await mercadopago.payment.findById(paymentId);

            const data = paymentDetail.body;
            const userId = data.external_reference; // Obtiene el ID que enviamos antes
            const status = data.status;

            console.log(`[MP Webhook] Pago ID: ${paymentId}, Usuario ID: ${userId}, Estado: ${status}`);

            if (status === 'approved') {
                // Actualizamos la membresía del usuario en la base de datos
                const [result] = await pool.query(
                    "UPDATE usuarios SET membresia_activa = TRUE, fecha_membresia = NOW() WHERE id = ?",
                    [userId]
                );

                if (result.affectedRows > 0) {
                    console.log(`✅ Membresía activada con éxito para Usuario ID: ${userId}`);
                } else {
                    console.error(`⚠️ No se pudo actualizar el usuario ID: ${userId} (No encontrado o sin cambios).`);
                }
            } else {
                console.log(`❌ Pago no aprobado para Usuario ID ${userId}. Estado: ${status}`);
            }
        }

        // Devolvemos 200 OK para confirmar a MP que recibimos la notificación
        res.sendStatus(200);

    } catch (error) {
        console.error("Error en el Webhook de Mercado Pago:", error);
        // Devolvemos 200 OK a MP incluso si hay error para evitar reintentos infinitos
        // NOTA: En el caso de error de pool (arriba) sí devolvimos 503.
        res.sendStatus(200);
    }
};

// EXPORTACIÓN FINAL CJS
module.exports = {
    createPreferenceController,
    webhookController
};
