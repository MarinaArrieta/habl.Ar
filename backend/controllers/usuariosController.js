import pool from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendApprovalEmail } from "../utils/emailService.js";

// ==========================================================
// REGISTRO PÚBLICO (Incluye: comun, psicologo, voluntario)
// ==========================================================
export const registerPublicController = async (req, res) => {
    try {
        console.log("-----------------------------------------");
        console.log("REQ.BODY:", req.body);
        console.log("REQ.FILES:", req.files);
        console.log("-----------------------------------------");
        const {
            nombre,
            apellido,
            email,
            contrasena,
            tipo = "comun",
            // Campos de Psicólogo
            matricula = "",
            universidad = "",
            titulo = "",
            // Campos de Voluntario
            fecha_nacimiento = null,
            clave_aprobacion = null,
        } = req.body;

        // Obtener nombres de archivo, si existen (solo para psicólogo)
        const foto_titulo = req.files?.foto_titulo ? req.files.foto_titulo[0].filename : "";
        const certificado = req.files?.certificado ? req.files.certificado[0].filename : "";
        const fotoUrl = req.files?.foto_perfil ? req.files.foto_perfil[0].filename : null;

        let cursoAprobadoDB = false;
        let estadoAprobacion = (tipo === 'psicologo' || tipo === 'voluntario') ? 'pendiente' : 'aprobado';


        // --- Validación de Voluntario ---
        if (tipo === "voluntario") {
            if (!fecha_nacimiento) {
                return res.status(400).json({ error: "La fecha de nacimiento es obligatoria para voluntarios" });
            }

            // Validación de Mayoría de Edad
            const dob = new Date(fecha_nacimiento);
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

            if (dob > eighteenYearsAgo) {
                return res.status(400).json({ error: "Debes ser mayor de 18 años para ser voluntario" });
            }

            // Validación de Clave de Aprobación
            if (!clave_aprobacion || clave_aprobacion.length !== 4) {
                return res.status(400).json({ error: "Debes haber aprobado el curso y proporcionar la Clave de Aprobación para registrarte." });
            }

            cursoAprobadoDB = true;
        }
        // ---------------------------------

        // Validación de campos OBLIGATORIOS (Básicos)
        if (!nombre || !apellido || !email || !contrasena) {
            return res.status(400).json({ error: "Todos los campos obligatorios" });
        }

        // Validación para PSICÓLOGOS
        if (tipo === "psicologo" && (!matricula || !universidad || !titulo || !foto_titulo || !certificado)) {
            return res.status(400).json({ error: "Completa todos los campos para psicólogos." });
        }

        const [existing] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (existing.length > 0) return res.status(400).json({ error: "Email ya registrado" });

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const [result] = await pool.query(
            `INSERT INTO usuarios (nombre, apellido, email, contrasena, tipo, matricula, universidad, titulo, foto_titulo, certificado, fecha_nacimiento, curso_aprobado, estado_aprobacion, fotoUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                apellido,
                email,
                hashedPassword,
                tipo,
                matricula,
                universidad,
                titulo,
                foto_titulo,
                certificado,
                fecha_nacimiento,
                cursoAprobadoDB,
                estadoAprobacion,
                fotoUrl,
            ]
        );

        res.status(201).json({ id: result.insertId, nombre, apellido, email, tipo });
    } catch (err) {
        console.error("Error al registrar usuario:", err);
        res.status(500).json({ error: "Error interno al registrar el usuario" });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        const [rows] = await pool.query(
            "SELECT id, nombre, apellido, email, contrasena, tipo, estado_aprobacion FROM usuarios WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "Email o contraseña incorrectos" });
        }

        const usuario = rows[0];

        // 1. PRIMERO: Calcular y verificar la contraseña
        const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Email o contraseña incorrectos" });
        }

        // 2. SEGUNDO: Aplicar la validación de aprobación
        if (usuario.tipo === 'psicologo' && usuario.estado_aprobacion !== 'aprobado') {
            return res.status(403).json({ error: "Tu cuenta de psicólogo está pendiente de aprobación por un administrador." });
        }


        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        delete usuario.contrasena;

        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                tipo: usuario.tipo,
            },
        });

    } catch (err) {
        console.error("Error al iniciar sesión:", err);
        res.status(500).json({ error: "Error interno al iniciar sesión" });
    }
};

// ==========================================================
// MIDDLEWARE DE AUTENTICACIÓN (VERIFICAR TOKEN)
// ==========================================================
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Acceso denegado. Se requiere autenticación.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado.' });
        }
        req.user = decoded; // Corregido a req.user
        next();
    });
};

// ==========================================================
// OBTENER TODOS LOS USUARIOS (PARA ADMINISTRACIÓN)
// ==========================================================
export const getUsuariosController = async (req, res) => {
    try {
        // Validación de permiso: Solo administradores pueden ver esta lista
        if (req.user.tipo !== 'admin') {
            return res.status(403).json({ error: "Acceso denegado. Solo administradores." });
        }

        // Obtener todos los usuarios, excluyendo la contraseña
        const [rows] = await pool.query(
            "SELECT id, nombre, apellido, email, tipo, estado_aprobacion FROM usuarios ORDER BY id DESC"
        );

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener lista de usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener usuarios." });
    }
};
// ==========================================================
// REGISTRAR NUEVO ADMIN (Solo Admin a Admin)
// ==========================================================
export const registerAdminController = async (req, res) => {
    try {
        // La validación de permiso de admin (req.user.tipo !== 'admin')
        // ya se realiza antes, en los middlewares de la ruta.

        // Extraemos los datos del formulario del frontend
        const {
            nombre,
            apellido,
            email,
            password: contrasena, // Renombramos 'password' a 'contrasena' para la DB
        } = req.body;

        // --- 1. Validación de campos obligatorios ---
        if (!nombre || !email || !contrasena) {
            return res.status(400).json({ error: "Faltan campos obligatorios: nombre, email y contraseña." });
        }

        // --- 2. Verificar que el email no esté registrado ---
        const [existing] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "El email ya está registrado." });
        }

        // --- 3. Hashear contraseña y registrar ---
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const tipo = 'admin';

        const [result] = await pool.query(
            // Se inserta solo lo esencial para un Admin, forzando el tipo
            `INSERT INTO usuarios (nombre, apellido, email, contrasena, tipo) VALUES (?, ?, ?, ?, ?)`,
            [
                nombre,
                apellido,
                email,
                hashedPassword,
                tipo,
            ]
        );

        res.status(201).json({ 
            message: `Nuevo administrador ${nombre} registrado con éxito.`,
            id: result.insertId,
            email: email,
            tipo: tipo,
        });

    } catch (error) {
        console.error("Error al registrar nuevo administrador:", error);
        res.status(500).json({ error: "Error interno al registrar el administrador." });
    }
};

// ==========================================================
// OBTENER UN SOLO USUARIO POR ID (Usado en VolunterProfile)
// ==========================================================
export const getUsuarioController = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.id.toString() !== id && req.user.tipo !== 'admin') {
            return res.status(403).json({ error: "No tienes permiso para ver este perfil." });
        }

        const [rows] = await pool.query(
            "SELECT id, nombre, apellido, email, tipo, matricula, universidad, titulo, foto_titulo, certificado, fecha_nacimiento, curso_aprobado, fotoUrl FROM usuarios WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error("Error al obtener usuario:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ==========================================================
// ACTUALIZAR USUARIO (Usado en VolunterProfile)
// ==========================================================
export const updateUsuarioController = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            apellido,
            email,
            contrasena,
            matricula,
            universidad,
            titulo,
        } = req.body;

        // Obtener el nombre de archivo de la foto (si se subió, Multer lo pone en req.file)
        const fotoUrl = req.file ? req.file.filename : null;
        console.log("📸 Archivo recibido:", req.file);

        if (req.user.id.toString() !== id && req.user.tipo !== 'admin') {
            return res.status(403).json({ error: "No tienes permiso para modificar este perfil." });
        }

        const updates = [];
        const values = [];

        if (nombre) { updates.push("nombre = ?"); values.push(nombre); }
        if (apellido) { updates.push("apellido = ?"); values.push(apellido); }
        if (email) { updates.push("email = ?"); values.push(email); }

        // Agregar campos de psicólogo y foto si están presentes
        if (matricula) { updates.push("matricula = ?"); values.push(matricula); }
        if (universidad) { updates.push("universidad = ?"); values.push(universidad); }
        if (titulo) { updates.push("titulo = ?"); values.push(titulo); }
        if (fotoUrl) { updates.push("fotoUrl = ?"); values.push(fotoUrl); } // <-- Foto

        if (contrasena) {
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            updates.push("contrasena = ?");
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron datos para actualizar." });
        }

        const query = `UPDATE usuarios SET ${updates.join(", ")} WHERE id = ?`;
        values.push(id);

        await pool.query(query, values);

        // Obtener los datos actualizados para devolverlos al frontend (para actualizar el contexto/estado)
        const [updatedUserRows] = await pool.query(
            "SELECT nombre, apellido, fotoUrl FROM usuarios WHERE id = ?",
            [id]
        );

        const updatedUser = updatedUserRows[0];

        // Devolver un objeto con la información que el frontend necesita
        res.json({
            message: "Usuario actualizado con éxito",
            data: {
                nombre: updatedUser.nombre,
                apellido: updatedUser.apellido,
                fotoUrl: updatedUser.fotoUrl, // Nombre del archivo guardado
            }
        });

    } catch (err) {
        console.error("Error al actualizar usuario:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "El email ya está registrado." });
        }
        res.status(500).json({ error: "Error interno al actualizar el usuario" });
    }
};

// ==========================================================
// ELIMINAR USUARIO (Usado en VolunterProfile)
// ==========================================================
export const deleteUsuarioController = async (req, res) => {
    try {
        const { id } = req.params;


        const ADMIN_PROTEGIDO_EMAIL = "admin@ejemplo.com";
        // 1. Obtener el usuario a eliminar para verificar su email
        const [userToDeleteRows] = await pool.query("SELECT email FROM usuarios WHERE id = ?", [id]);
        if (userToDeleteRows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        // 2. Comprobación de seguridad: Evitar eliminar al admin principal
        if (userToDeleteRows[0].email === ADMIN_PROTEGIDO_EMAIL) {
            return res.status(403).json({ error: "Acceso denegado. No se puede eliminar al administrador principal." });
        }

        

        if (req.user.id.toString() !== id && req.user.tipo !== 'admin') {
            return res.status(403).json({ error: "No tienes permiso para eliminar esta cuenta." });
        }

        const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario eliminado con éxito" });

    } catch (err) {
        console.error("Error al eliminar usuario:", err);
        res.status(500).json({ error: "Error interno al eliminar el usuario" });
    }
};

// ==========================================================
// APROBACIÓN DE PSICÓLOGO (Solo Admin)
// ==========================================================
export const aprobarPsicologoController = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Verificar permiso: Solo Administradores
        if (req.user.tipo !== 'admin') {
            return res.status(403).json({ error: "Acceso denegado. Solo administradores." });
        }

        // 2. Obtener el usuario y verificar rol/estado actual
        const [rows] = await pool.query("SELECT id, email, nombre, tipo, estado_aprobacion FROM usuarios WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        const usuario = rows[0];

        if (usuario.tipo !== 'psicologo') {
            return res.status(400).json({ error: "Solo se pueden aprobar cuentas de tipo 'psicologo'." });
        }

        if (usuario.estado_aprobacion === 'aprobado') {
            return res.status(400).json({ error: "El psicólogo ya está aprobado." });
        }

        // 3. Actualizar estado en la base de datos
        const [result] = await pool.query(
            "UPDATE usuarios SET estado_aprobacion = 'aprobado' WHERE id = ?",
            [id]
        );

        if (result.affectedRows > 0) {
            // 4. Enviar correo de notificación (No esperamos a que termine, para no demorar la respuesta)
            sendApprovalEmail(usuario.email, usuario.nombre, usuario.tipo);

            res.json({ message: `Psicólogo ID ${id} aprobado con éxito.` });
        } else {
            res.status(500).json({ error: "No se pudo actualizar el estado del psicólogo." });
        }

    } catch (error) {
        console.error("Error al aprobar psicólogo:", error);
        res.status(500).json({ error: "Error interno al aprobar el psicólogo." });
    }
};

export const getPsicologosListController = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
        id,
        nombre,
        apellido,
        matricula,
        email,
        titulo,
        foto_titulo,
        certificado,
        fotoUrl
        FROM
        usuarios
        WHERE
        tipo = 'psicologo'
        AND
        estado_aprobacion = 'aprobado'`
        );

        // La magia: Mapear para construir la URL completa de la foto de perfil
        const psicologosConUrl = rows.map(psicologo => {
            const baseUrl = `http://localhost:${process.env.PORT || 3000}/uploads/`;
            return {
                ...psicologo,
                // Si fotoUrl existe, crea la URL completa; de lo contrario, es null
                fotoUrl: psicologo.fotoUrl ? `${baseUrl}${psicologo.fotoUrl}` : null,
            };
        });

        res.json(psicologosConUrl);
    } catch (error) {
        console.error("Error al obtener la lista de psicólogos:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener la lista de psicólogos." });
    }
};