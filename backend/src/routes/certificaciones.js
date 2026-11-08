const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const upload = require("../lib/upload");
const { obtenerUrlImagen } = upload;
const { eliminarDeCloudinary } = require("../lib/cloudinary");

const router = express.Router();

router.get("/", async (req, res) => {
  const soloActivos = req.query.todos !== "true";
  const certificaciones = await prisma.certificacion.findMany({
    where: soloActivos ? { activo: true } : undefined,
    orderBy: { orden: "asc" },
  });
  res.json(certificaciones);
});

router.post("/", requireAuth, upload.single("imagen"), async (req, res) => {
  const { nombreEmpleado, titulo, institucion, fecha, descripcion, orden, activo } = req.body;
  if (!nombreEmpleado || !titulo) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }
  const imagenUrl = obtenerUrlImagen(req.file, req.body.imagenUrl);

  const certificacion = await prisma.certificacion.create({
    data: {
      nombreEmpleado,
      titulo,
      institucion: institucion || null,
      fecha: fecha ? new Date(fecha) : null,
      descripcion: descripcion || null,
      imagenUrl,
      orden: orden ? Number(orden) : 0,
      activo: activo === undefined ? true : activo === "true" || activo === true,
    },
  });
  res.status(201).json(certificacion);
});

router.put("/:id", requireAuth, upload.single("imagen"), async (req, res) => {
  const id = Number(req.params.id);
  const { nombreEmpleado, titulo, institucion, fecha, descripcion, orden, activo, imagenUrl } = req.body;

  const data = {};
  if (nombreEmpleado !== undefined) data.nombreEmpleado = nombreEmpleado;
  if (titulo !== undefined) data.titulo = titulo;
  if (institucion !== undefined) data.institucion = institucion;
  if (fecha !== undefined) data.fecha = fecha ? new Date(fecha) : null;
  if (descripcion !== undefined) data.descripcion = descripcion;
  if (orden !== undefined) data.orden = Number(orden);
  if (activo !== undefined) data.activo = activo === "true" || activo === true;
  if (req.file) {
    data.imagenUrl = obtenerUrlImagen(req.file);
    try {
      const anterior = await prisma.certificacion.findUnique({ where: { id } });
      if (anterior?.imagenUrl && anterior.imagenUrl !== data.imagenUrl) {
        eliminarDeCloudinary(anterior.imagenUrl).catch(() => {});
      }
    } catch (e) {}
  } else if (imagenUrl !== undefined) {
    data.imagenUrl = imagenUrl;
  }

  try {
    const certificacion = await prisma.certificacion.update({ where: { id }, data });
    res.json(certificacion);
  } catch (err) {
    res.status(404).json({ error: "Certificación no encontrada" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const anterior = await prisma.certificacion.findUnique({ where: { id } });
    if (anterior?.imagenUrl) {
      await eliminarDeCloudinary(anterior.imagenUrl).catch(() => {});
    }
    await prisma.certificacion.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error al eliminar certificación:", err);
    res.status(err.code === "P2025" ? 404 : 500).json({
      error: err.code === "P2025" ? "Certificación no encontrada" : "Error al eliminar la certificación",
    });
  }
});

module.exports = router;
