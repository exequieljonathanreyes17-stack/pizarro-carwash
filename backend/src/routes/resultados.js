const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const upload = require("../lib/upload");
const { obtenerUrlImagen } = upload;

const router = express.Router();

function normalizarResultado(r) {
  let imagenesArray = [];
  if (r.imagenes) {
    if (Array.isArray(r.imagenes)) {
      imagenesArray = r.imagenes;
    } else if (typeof r.imagenes === "string") {
      try {
        imagenesArray = JSON.parse(r.imagenes);
      } catch {
        imagenesArray = r.imagenes.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
  }

  return {
    ...r,
    imagenes: imagenesArray,
  };
}

// GET /api/resultados (público) - lista resultados
router.get("/", async (req, res) => {
  try {
    const soloActivos = req.query.todos !== "true";
    const resultados = await prisma.resultado.findMany({
      where: soloActivos ? { activo: true } : undefined,
      include: {
        servicio: {
          select: { id: true, nombre: true, tipoVehiculo: true },
        },
      },
      orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
    });
    res.json(resultados.map(normalizarResultado));
  } catch (err) {
    console.error("Error al obtener resultados:", err);
    res.status(500).json({ error: "Error al obtener resultados" });
  }
});

// GET /api/resultados/:id
router.get("/:id", async (req, res) => {
  try {
    const resultado = await prisma.resultado.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        servicio: {
          select: { id: true, nombre: true, tipoVehiculo: true },
        },
      },
    });
    if (!resultado) return res.status(404).json({ error: "Resultado no encontrado" });
    res.json(normalizarResultado(resultado));
  } catch (err) {
    res.status(500).json({ error: "Error al obtener resultado" });
  }
});

// POST /api/resultados (protegido) - crea un resultado
router.post(
  "/",
  requireAuth,
  upload.fields([
    { name: "antes", maxCount: 1 },
    { name: "despues", maxCount: 1 },
    { name: "imagenes", maxCount: 15 },
  ]),
  async (req, res) => {
    try {
      const {
        titulo,
        descripcion,
        servicioId,
        redSocialUrl,
        orden,
        activo,
        imagenAntes,
        imagenDespues,
        imagenesExistentes,
      } = req.body;

      if (!titulo && !servicioId) {
        return res.status(400).json({ error: "Debe ingresar un título o seleccionar un servicio." });
      }

      // Si no hay título pero hay servicio, podemos buscar el servicio para el título
      let tituloFinal = titulo;
      if (!tituloFinal && servicioId) {
        const s = await prisma.servicio.findUnique({ where: { id: Number(servicioId) } });
        tituloFinal = s ? s.nombre : "Trabajo Realizado";
      }

      const antesUrl = obtenerUrlImagen(req.files?.antes?.[0], imagenAntes);
      const despuesUrl = obtenerUrlImagen(req.files?.despues?.[0], imagenDespues);

      // Galería de imágenes múltiples
      let imagenesUrls = [];
      if (imagenesExistentes) {
        try {
          const parsed = JSON.parse(imagenesExistentes);
          if (Array.isArray(parsed)) imagenesUrls = parsed;
        } catch {
          // ignorar error de parseo
        }
      }

      if (req.files?.imagenes && Array.isArray(req.files.imagenes)) {
        const nuevasUrls = req.files.imagenes
          .map((f) => obtenerUrlImagen(f))
          .filter(Boolean);
        imagenesUrls = [...imagenesUrls, ...nuevasUrls];
      }

      // Debe haber al menos una imagen (sea antes/después o en la galería)
      if (!antesUrl && !despuesUrl && imagenesUrls.length === 0) {
        return res.status(400).json({
          error: "Debe subir al menos una imagen del trabajo (Antes/Después o en la galería).",
        });
      }

      const resultado = await prisma.resultado.create({
        data: {
          titulo: tituloFinal,
          descripcion: descripcion || null,
          servicioId: servicioId ? Number(servicioId) : null,
          redSocialUrl: redSocialUrl ? redSocialUrl.trim() : null,
          imagenAntes: antesUrl || null,
          imagenDespues: despuesUrl || null,
          imagenes: imagenesUrls.length > 0 ? JSON.stringify(imagenesUrls) : null,
          orden: orden ? Number(orden) : 0,
          activo: activo === undefined ? true : activo === "true" || activo === true,
        },
        include: {
          servicio: {
            select: { id: true, nombre: true, tipoVehiculo: true },
          },
        },
      });

      res.status(201).json(normalizarResultado(resultado));
    } catch (err) {
      console.error("Error al crear resultado:", err);
      res.status(500).json({ error: err.message || "Error al crear el resultado" });
    }
  }
);

// PUT /api/resultados/:id (protegido) - edita un resultado
router.put(
  "/:id",
  requireAuth,
  upload.fields([
    { name: "antes", maxCount: 1 },
    { name: "despues", maxCount: 1 },
    { name: "imagenes", maxCount: 15 },
  ]),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const {
        titulo,
        descripcion,
        servicioId,
        redSocialUrl,
        orden,
        activo,
        imagenAntes,
        imagenDespues,
        imagenesExistentes,
      } = req.body;

      const data = {};
      if (titulo !== undefined) data.titulo = titulo;
      if (descripcion !== undefined) data.descripcion = descripcion;
      if (servicioId !== undefined) {
        data.servicioId = servicioId ? Number(servicioId) : null;
      }
      if (redSocialUrl !== undefined) {
        data.redSocialUrl = redSocialUrl ? redSocialUrl.trim() : null;
      }
      if (orden !== undefined) data.orden = Number(orden);
      if (activo !== undefined) data.activo = activo === "true" || activo === true;

      // Actualizar imagen antes si se sube archivo o se envía url
      if (req.files?.antes?.[0]) {
        data.imagenAntes = obtenerUrlImagen(req.files.antes[0]);
      } else if (imagenAntes !== undefined) {
        data.imagenAntes = imagenAntes || null;
      }

      // Actualizar imagen después si se sube archivo o se envía url
      if (req.files?.despues?.[0]) {
        data.imagenDespues = obtenerUrlImagen(req.files.despues[0]);
      } else if (imagenDespues !== undefined) {
        data.imagenDespues = imagenDespues || null;
      }

      // Galería múltiple: conservar existentes + agregar nuevas subidas
      let imagenesUrls = [];
      if (imagenesExistentes !== undefined) {
        try {
          const parsed = typeof imagenesExistentes === "string" ? JSON.parse(imagenesExistentes) : imagenesExistentes;
          if (Array.isArray(parsed)) imagenesUrls = parsed;
        } catch {
          // fallback
        }
      }

      if (req.files?.imagenes && Array.isArray(req.files.imagenes)) {
        const nuevasUrls = req.files.imagenes
          .map((f) => obtenerUrlImagen(f))
          .filter(Boolean);
        imagenesUrls = [...imagenesUrls, ...nuevasUrls];
      }

      if (imagenesExistentes !== undefined || (req.files?.imagenes && req.files.imagenes.length > 0)) {
        data.imagenes = imagenesUrls.length > 0 ? JSON.stringify(imagenesUrls) : null;
      }

      const actualizado = await prisma.resultado.update({
        where: { id },
        data,
        include: {
          servicio: {
            select: { id: true, nombre: true, tipoVehiculo: true },
          },
        },
      });

      res.json(normalizarResultado(actualizado));
    } catch (err) {
      console.error("Error al actualizar resultado:", err);
      res.status(err.code === "P2025" ? 404 : 500).json({
        error: err.code === "P2025" ? "Resultado no encontrado" : err.message || "Error al actualizar resultado",
      });
    }
  }
);

// DELETE /api/resultados/:id (protegido)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.resultado.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error al eliminar resultado:", err);
    res.status(err.code === "P2025" ? 404 : 500).json({
      error: err.code === "P2025" ? "Resultado no encontrado" : "Error al eliminar el resultado",
    });
  }
});

module.exports = router;
