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

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
});

const MEMBER_FEE_AMOUNT = 1000;
const MEMBER_FEE_TITLE = "Membresía Anual de Psicólogo/Voluntario";

// ==========================================================
// CREATE PREFERENCE CONTROLLER
// ==========================================================
const createPreferenceController = async (req, res) => {
    try {
        // 🛑 CORRECCIÓN: Obtener los datos del usuario del cuerpo (req.body),
        // ya que la ruta no está protegida y req.user no existe.
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
                success: `${process.env.FRONTEND_URL}/pago/success`,
                failure: `${process.env.FRONTEND_URL}/pago/failure`,
                pending: `${process.env.FRONTEND_URL}/pago/pending`,
            },
            auto_return: "approved",
            // Usamos userId como referencia externa para el webhook
            external_reference: userId.toString(),
            notification_url: `${process.env.BACKEND_URL}/api/mercadopago/webhook`,
        };

        const response = await mercadopago.preferences.create(preference);

        res.json({
            preferenceId: response.body.id,
            initPoint: response.body.init_point,
        });

    } catch (error) {
        // Asegúrate de que este console.error está registrando el error completo
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

        if (query.topic === 'payment') {
            const paymentId = query.id;

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

        res.sendStatus(200);

    } catch (error) {
        console.error("Error en el Webhook de Mercado Pago:", error);
        // Devolvemos 200 OK a MP incluso si hay error para evitar reintentos infinitos
        res.sendStatus(200);
    }
};

// EXPORTACIÓN FINAL CJS
module.exports = {
    createPreferenceController,
    webhookController
};