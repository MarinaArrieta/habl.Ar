import { Router } from "express";
import pool from "../db/connection.js";

const router = Router();

// GET todas las técnicas
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM calificaciones");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al traer las técnicas" });
  }
});

// GET técnica por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM calificaciones WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Técnica no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al traer la técnica" });
  }
});

// POST crear nueva técnica
router.post("/", async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO calificaciones (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion]
    );
    res.status(201).json({ id: result.insertId, nombre, descripcion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la técnica" });
  }
});

// PUT actualizar técnica
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    await pool.query(
      "UPDATE calificaciones SET nombre = ?, descripcion = ? WHERE id = ?",
      [nombre, descripcion, id]
    );
    res.json({ id, nombre, descripcion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la técnica" });
  }
});

// DELETE eliminar técnica
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM calificaciones WHERE id = ?", [id]);
    res.json({ message: "Técnica eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la técnica" });
  }
});

export default router;
