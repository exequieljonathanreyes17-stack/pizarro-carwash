const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const upload = require("../lib/upload");
const { obtenerUrlImagen } = upload;

const router = express.Router();

router.get("/", async (req, res) => {
  const soloActivos = req.query.todos !== "true";
  const resultados = await prisma.resultado.findMany({
    where: soloActivos ? { activo: true } : undefined,
    orderBy: { orden: "asc" },
  });
  res.json(resultados);
});

router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "antes", maxCount: 1 },
    { name: "despues", maxCount: 1 },
  ]),
  async (req, res) => {
    const { titulo, descripcion, orden, activo, imagenAntes, imagenDespues } = req.body;
    if (!titulo) return res.status(400).json({ error: "El título es obligatorio." });

    const antesUrl = obtenerUrlImagen(req.files?.antes?.[0], imagenAntes);
    const despuesUrl = obtenerUrlImagen(req.files?.despues?.[0], imagenDespues);

    if (!antesUrl || !despuesUrl) {
      return res.status(400).json({ error: "Se necesitan imagen de antes y después." });
    }

    const resultado = await prisma.resultado.create({
      data: {
        titulo,
        descripcion: descripcion || null,
        imagenAntes: antesUrl,
        imagenDespues: despuesUrl,
        orden: orden ? Number(orden) : 0,
        activo: activo === undefined ? true : activo === "true" || activo === true,
      },
    });
    res.status(201).json(resultado);
  }
);

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.resultado.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (err) {
    res.status(404).json({ error: "Resultado no encontrado" });
  }
});

module.exports = router;
