/* import { Router } from "express";
import pool from "../db/connection.js";
import { verificarToken } from "../controllers/usuariosController.js";

const router = Router();

// Función auxiliar para convertir el SLUG (de la URL) al nombre exacto de la DB (columna 'tipo').
// ⚠️ IMPORTANTE: Esta lista debe coincidir exactamente con los valores que tienes en la columna 'tipo' de tu tabla.
const slugToTypeName = (slug) => {
    const map = {
        'respiracion-consciente': 'Respiración Consciente',
        'relajacion-muscular-progresiva-rmp': 'Relajación Muscular Progresiva (RMP)',
        'meditacion-y-mindfulness': 'Meditación y Mindfulness',
        // Asegúrate de agregar todas las categorías que uses en tu base de datos aquí:
        // 'otro-slug-de-ejemplo': 'Otro Nombre Exacto de Categoría',
    };
    // Devuelve el nombre de la DB o un string vacío si no se encuentra
    return map[slug] || ''; 
};

// ----------------------------------------------------
// ✅ NUEVA RUTA DE FILTRADO: GET técnicas filtradas por el slug
// Endpoint: /tecnicas/tipo/:slug
// ----------------------------------------------------
router.get("/tipo/:slug", async (req, res) => {
    const { slug } = req.params;
    
    // 1. Convertir el slug al nombre exacto de la categoría en la DB
    const tipoName = slugToTypeName(slug);

    if (!tipoName) {
        // Si el slug no se mapea a un tipo conocido, devolvemos un 404
        return res.status(404).json({ ok: false, msg: 'Categoría no encontrada.' });
    }

    // 2. Consulta SQL con la cláusula WHERE usando el nombre exacto
    const sql = "SELECT * FROM tecnicas WHERE tipo = ?";

    try {
        const [rows] = await pool.query(sql, [tipoName]); // Aplicando el filtro SQL
        
        // Respuesta consistente con la expectativa del frontend: { ok: true, data: [...] }
        res.json({ ok: true, data: rows }); 
    } catch (error) {
        console.error("Error al obtener técnicas por tipo:", error);
        res.status(500).json({ ok: false, msg: 'Error interno del servidor al consultar técnicas.', error: error.message });
    }
});


// ----------------------------------------------------
// RUTAS EXISTENTES
// ----------------------------------------------------

// GET todas las técnicas — cualquier usuario logueado puede ver
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM tecnicas");
        // Ajusto la respuesta para que sea consistente con el nuevo endpoint
        res.json({ ok: true, data: rows }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Error al traer las técnicas" });
    }
});

// POST crear nueva técnica — solo admin
router.post("/", verificarToken, async (req, res) => {
    if (req.user.tipo !== "admin") {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    const { titulo, tipo, descripcion, url_multimedia } = req.body;

    try {
        const [result] = await pool.query(
            "INSERT INTO tecnicas (titulo, tipo, descripcion, url_multimedia) VALUES (?, ?, ?, ?)",
            [titulo, tipo, descripcion, url_multimedia]
        );

        res
            .status(201)
            .json({ pk: result.insertId, titulo, tipo, descripcion, url_multimedia });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear la técnica" });
    }
});

// PUT actualizar técnica — solo admin
router.put("/:id", verificarToken, async (req, res) => {
    if (req.user.tipo !== "admin")
        return res.status(403).json({ error: "Acceso denegado" });

    const { id } = req.params;
    const { titulo, tipo, descripcion, url_multimedia } = req.body;

    try {
        const [result] = await pool.query(
            "UPDATE tecnicas SET titulo = ?, tipo = ?, descripcion = ?, url_multimedia = ? WHERE pk = ?",
            [titulo, tipo, descripcion, url_multimedia, id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Técnica no encontrada" });

        res.json({ pk: id, titulo, tipo, descripcion, url_multimedia });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al actualizar la técnica" });
    }
});

// DELETE técnica — solo admin
router.delete("/:id", verificarToken, async (req, res) => {
    if (req.user.tipo !== "admin")
        return res.status(403).json({ error: "Acceso denegado" });

    const { id } = req.params;

    try {
        const [result] = await pool.query("DELETE FROM tecnicas WHERE id = ?", [
            id,
        ]);
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Técnica no encontrada" });

        res.json({ message: "Técnica eliminada correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al eliminar la técnica" });
    }
});

export default router; */

import { Router } from "express";
import pool from "../db/connection.js";
import { verificarToken } from "../controllers/usuariosController.js";

const router = Router();

// Función auxiliar para convertir el SLUG (de la URL) al nombre exacto de la DB (columna 'tipo').
const slugToTypeName = (slug) => {
    const map = {
        'respiracion-consciente': 'Respiración Consciente',
        'relajacion-muscular-progresiva-rmp': 'Relajación Muscular Progresiva (RMP)',
        'meditacion-y-mindfulness': 'Meditación y Mindfulness',
        // Asegúrate de agregar todas las categorías que uses en tu base de datos aquí:
    };
    // Devuelve el nombre de la DB o un string vacío si no se encuentra
    return map[slug] || '';
};

// ----------------------------------------------------
// RUTA DE FILTRADO: GET técnicas filtradas por el slug
// ----------------------------------------------------
router.get("/tipo/:slug", async (req, res) => {
    const { slug } = req.params;

    const tipoName = slugToTypeName(slug);

    if (!tipoName) {
        return res.status(404).json({ ok: false, msg: 'Categoría no encontrada.' });
    }

    const sql = "SELECT * FROM tecnicas WHERE tipo = ?";

    try {
        const [rows] = await pool.query(sql, [tipoName]);
        res.json({ ok: true, data: rows });
    } catch (error) {
        console.error("Error al obtener técnicas por tipo:", error);
        res.status(500).json({ ok: false, msg: 'Error interno del servidor al consultar técnicas.', error: error.message });
    }
});


// ----------------------------------------------------
// RUTAS CRUD
// ----------------------------------------------------

// GET todas las técnicas
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM tecnicas");
        res.json({ ok: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Error al traer las técnicas" });
    }
});

// POST crear nueva técnica — solo admin
router.post("/", verificarToken, async (req, res) => {
    if (!req.user || req.user.tipo !== "admin") {
        return res.status(403).json({ error: "Acceso denegado: Solo administradores" });
    }

    const { titulo, tipo, descripcion, url_multimedia } = req.body;

    try {
        const [result] = await pool.query(
            "INSERT INTO tecnicas (titulo, tipo, descripcion, url_multimedia) VALUES (?, ?, ?, ?)",
            [titulo, tipo, descripcion, url_multimedia]
        );

        // Usamos el ID insertado
        res
            .status(201)
            .json({ ok: true, id: result.insertId, titulo, tipo, descripcion, url_multimedia });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Error al crear la técnica" });
    }
});

// PUT actualizar técnica — solo admin
router.put("/:id", verificarToken, async (req, res) => {
    if (!req.user || req.user.tipo !== "admin")
        return res.status(403).json({ error: "Acceso denegado: Solo administradores" });

    const { id } = req.params;
    const { titulo, tipo, descripcion, url_multimedia } = req.body;

    try {
        // Asumiendo que la columna de búsqueda es 'id'
        const [result] = await pool.query(
            "UPDATE tecnicas SET titulo = ?, tipo = ?, descripcion = ?, url_multimedia = ? WHERE id = ?",
            [titulo, tipo, descripcion, url_multimedia, id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Técnica no encontrada" });

        res.json({ ok: true, id: id, titulo, tipo, descripcion, url_multimedia });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Error al actualizar la técnica" });
    }
});

// DELETE técnica — solo admin
router.delete("/:id", verificarToken, async (req, res) => {
    if (!req.user || req.user.tipo !== "admin")
        return res.status(403).json({ error: "Acceso denegado: Solo administradores" });

    const { id } = req.params;

    try {
        // ✅ CORREGIDO: Usando 'id' como clave primaria
        const [result] = await pool.query("DELETE FROM tecnicas WHERE id = ?", [
            id,
        ]);
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Técnica no encontrada" });

        res.json({ ok: true, message: "Técnica eliminada correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Error al eliminar la técnica" });
    }
});

export default router;
