const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const upload = require("../lib/upload");
const cloudinary = require("../lib/cloudinary");
const { obtenerUrlImagen } = upload;

const router = express.Router();

// GET /api/productos (público) - lista productos activos
router.get("/", async (req, res) => {
  const soloActivos = req.query.todos !== "true";
  const productos = await prisma.producto.findMany({
    where: soloActivos ? { activo: true } : undefined,
    orderBy: [{ destacado: "desc" }, { createdAt: "desc" }],
  });
  res.json(productos);
});

// GET /api/productos/:id
router.get("/:id", async (req, res) => {
  const producto = await prisma.producto.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(producto);
});

// POST /api/productos (protegido) - crea producto, admite imagen
router.post("/", requireAuth, upload.single("imagen"), async (req, res) => {
  const { nombre, descripcion, precio, categoria, destacado, activo } = req.body;

  if (!nombre || !descripcion || !precio || !categoria) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  const imagenUrl = obtenerUrlImagen(req.file, req.body.imagenUrl);

  const producto = await prisma.producto.create({
    data: {
      nombre,
      descripcion,
      precio: Number(precio),
      categoria,
      imagenUrl,
      destacado: destacado === "true" || destacado === true,
      activo: activo === undefined ? true : activo === "true" || activo === true,
    },
  });

  res.status(201).json(producto);
});

// PUT /api/productos/:id (protegido)
router.put("/:id", requireAuth, upload.single("imagen"), async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, descripcion, precio, categoria, destacado, activo, imagenUrl } = req.body;

  const productoPrevio = await prisma.producto.findUnique({ where: { id } });
  if (!productoPrevio) return res.status(404).json({ error: "Producto no encontrado" });

  const data = {};
  if (nombre !== undefined) data.nombre = nombre;
  if (descripcion !== undefined) data.descripcion = descripcion;
  if (precio !== undefined) data.precio = Number(precio);
  if (categoria !== undefined) data.categoria = categoria;
  if (destacado !== undefined) data.destacado = destacado === "true" || destacado === true;
  if (activo !== undefined) data.activo = activo === "true" || activo === true;
  if (req.file) data.imagenUrl = obtenerUrlImagen(req.file);
  else if (imagenUrl !== undefined) data.imagenUrl = imagenUrl;

  try {
    const producto = await prisma.producto.update({ where: { id }, data });
    if (data.imagenUrl && productoPrevio.imagenUrl && productoPrevio.imagenUrl !== data.imagenUrl) {
      cloudinary.eliminarDeCloudinary(productoPrevio.imagenUrl).catch(() => {});
    }
    res.json(producto);
  } catch (err) {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// DELETE /api/productos/:id (protegido)
router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    await prisma.producto.delete({ where: { id } });
    if (producto.imagenUrl) {
      cloudinary.eliminarDeCloudinary(producto.imagenUrl).catch(() => {});
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(err.code === "P2025" ? 404 : 500).json({
      error: err.code === "P2025" ? "Producto no encontrado" : "Error al eliminar el producto",
    });
  }
});

module.exports = router;
