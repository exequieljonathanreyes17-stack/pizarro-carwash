const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/resenas (protegido) - todas, para moderar desde el admin
router.get("/", requireAuth, async (req, res) => {
  const resenas = await prisma.resena.findMany({
    include: { servicio: { select: { nombre: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(resenas);
});

// DELETE /api/resenas/:id (protegido)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.resena.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error al eliminar reseña:", err);
    res.status(err.code === "P2025" ? 404 : 500).json({
      error: err.code === "P2025" ? "Reseña no encontrada" : "Error al eliminar la reseña",
    });
  }
});

module.exports = router;
