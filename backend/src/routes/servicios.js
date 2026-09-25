const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const upload = require("../lib/upload");

const router = express.Router();

function conPromedio(servicio) {
  const aprobadas = (servicio.resenas || []).filter((r) => r.aprobada);
  const total = aprobadas.length;
  const promedio = total > 0 ? aprobadas.reduce((acc, r) => acc + r.calificacion, 0) / total : 0;
  const { resenas, ...resto } = servicio;
  return { ...resto, ratingPromedio: Number(promedio.toFixed(1)), totalResenas: total };
}

// GET /api/servicios (público) - incluye promedio de estrellas calculado
router.get("/", async (req, res) => {
  const soloActivos = req.query.todos !== "true";
  const servicios = await prisma.servicio.findMany({
    where: soloActivos ? { activo: true } : undefined,
    include: { resenas: { where: { aprobada: true }, select: { calificacion: true } } },
    orderBy: { orden: "asc" },
  });
  res.json(servicios.map(conPromedio));
});

// GET /api/servicios/:id (público)
router.get("/:id", async (req, res) => {
  const servicio = await prisma.servicio.findUnique({
    where: { id: Number(req.params.id) },
    include: { resenas: { where: { aprobada: true } } },
  });
  if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" });
  res.json(conPromedio(servicio));
});

// GET /api/servicios/:id/resenas (público) - listado completo de reseñas aprobadas
router.get("/:id/resenas", async (req, res) => {
  
  const servicioId = Number(req.params.id);

  if (isNaN(servicioId)) {
    return res.status(400).json({ error: "El ID del servicio debe ser un número válido." });
  }
  
  const resenas = await prisma.resena.findMany({
    where: { servicioId: Number(req.params.id), aprobada: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(resenas);
});

// POST /api/servicios/:id/resenas (público) - un cliente deja su reseña
router.post("/:id/resenas", async (req, res) => {
  const servicioId = Number(req.params.id);
  const { nombreCliente, calificacion, comentario } = req.body;

  if (!nombreCliente || !calificacion || !comentario) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }
  const nota = Number(calificacion);
  if (nota < 1 || nota > 5) {
    return res.status(400).json({ error: "La calificación debe ser de 1 a 5." });
  }

  const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } });
  if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" });

  const resena = await prisma.resena.create({
    data: { servicioId, nombreCliente, calificacion: nota, comentario },
  });
  res.status(201).json(resena);
});

router.post("/", requireAuth, upload.single("imagen"), async (req, res) => {
  const { nombre, descripcion, tipoVehiculo, precioDesde, icono, orden, activo, masVendido, incluye, duracion } = req.body;
  if (!nombre || !descripcion) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }
  const imagenUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imagenUrl || null;

  const servicio = await prisma.servicio.create({
    data: {
      nombre,
      descripcion,
      tipoVehiculo: tipoVehiculo || "AMBOS",
      precioDesde: precioDesde ? Number(precioDesde) : null,
      icono: icono || null,
      incluye: incluye || null,
      duracion: duracion || null,
      imagenUrl,
      orden: orden ? Number(orden) : 0,
      masVendido: masVendido === "true" || masVendido === true,
      activo: activo === undefined ? true : activo === "true" || activo === true,
    },
  });
  res.status(201).json(servicio);
});

router.put("/:id", requireAuth, upload.single("imagen"), async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, descripcion, tipoVehiculo, precioDesde, icono, orden, activo, imagenUrl, masVendido, incluye, duracion } = req.body;

  const data = {};
  if (nombre !== undefined) data.nombre = nombre;
  if (descripcion !== undefined) data.descripcion = descripcion;
  if (tipoVehiculo !== undefined) data.tipoVehiculo = tipoVehiculo;
  if (precioDesde !== undefined) data.precioDesde = precioDesde ? Number(precioDesde) : null;
  if (icono !== undefined) data.icono = icono;
  if (incluye !== undefined) data.incluye = incluye;
  if (duracion !== undefined) data.duracion = duracion;
  if (orden !== undefined) data.orden = Number(orden);
  if (activo !== undefined) data.activo = activo === "true" || activo === true;
  if (masVendido !== undefined) data.masVendido = masVendido === "true" || masVendido === true;
  if (req.file) data.imagenUrl = `/uploads/${req.file.filename}`;
  else if (imagenUrl !== undefined) data.imagenUrl = imagenUrl;

  try {
    const servicio = await prisma.servicio.update({ where: { id }, data });
    res.json(servicio);
  } catch (err) {
    res.status(404).json({ error: "Servicio no encontrado" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.servicio.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (err) {
    res.status(404).json({ error: "Servicio no encontrado" });
  }
});

module.exports = router;
