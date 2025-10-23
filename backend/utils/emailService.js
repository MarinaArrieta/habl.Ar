import nodemailer from "nodemailer";

// Configuración del transporte de correo (debe configurarse en .env)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // Usar true para 465, false para otros puertos como 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Envía el correo de notificación de aprobación al usuario.
 * @param {string} email - Correo del destinatario.
 * @param {string} nombre - Nombre del destinatario.
 * @param {string} tipo - Rol del usuario (psicologo, voluntario, etc).
 */
export const sendApprovalEmail = async (email, nombre, tipo) => {
    const subject = `¡Tu cuenta de ${tipo} ha sido aprobada! 🎉`;
    const body = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #4CAF50;">¡Hola ${nombre}!</h2>
            <p>Tenemos grandes noticias: tu solicitud para ser ${tipo} en nuestra plataforma ha sido <strong>APROBADA</strong> por nuestro equipo.</p>
            <p>Esto significa que ya puedes iniciar sesión y comenzar a utilizar todas las herramientas que te brindamos en nuestra plataforma.</p>
            <p>Utiliza tu email y contraseña registrados para acceder:</p>
            <a href="TU_URL_DE_INICIO_SESION" style="display: inline-block; padding: 10px 20px; margin-top: 15px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
                Ir a Iniciar Sesión
            </a>
            <p>¡Bienvenido al equipo!</p>
            <p>Saludos cordiales,<br>El Equipo de Soporte de Habl.Ar</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Soporte Plataforma" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: body,
        });
        console.log(`[EMAIL] Correo de aprobación enviado a: ${email}`);
    } catch (error) {
        console.error("[EMAIL ERROR] No se pudo enviar el correo:", error);
        // IMPORTANTE: Manejar el error sin detener la ejecución
    }
};

export default transporter;