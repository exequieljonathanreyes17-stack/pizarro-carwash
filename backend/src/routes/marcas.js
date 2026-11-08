const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const upload = require("../lib/upload");
const { obtenerUrlImagen } = upload;

const router = express.Router();

router.get("/", async (req, res) => {
  const soloActivos = req.query.todos !== "true";
  const marcas = await prisma.marca.findMany({
    where: soloActivos ? { activo: true } : undefined,
    orderBy: { orden: "asc" },
  });
  res.json(marcas);
});

router.post("/", requireAuth, upload.single("logo"), async (req, res) => {
  const { nombre, orden, activo, logoUrl } = req.body;
  if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio." });

  const url = obtenerUrlImagen(req.file, logoUrl);

  const marca = await prisma.marca.create({
    data: {
      nombre,
      logoUrl: url,
      orden: orden ? Number(orden) : 0,
      activo: activo === undefined ? true : activo === "true" || activo === true,
    },
  });
  res.status(201).json(marca);
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.marca.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error al eliminar marca:", err);
    res.status(err.code === "P2025" ? 404 : 500).json({
      error: err.code === "P2025" ? "Marca no encontrada" : "Error al eliminar la marca",
    });
  }
});

module.exports = router;
