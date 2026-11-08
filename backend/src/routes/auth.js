const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios." });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || "cambia-esta-clave",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: err.message || "Error interno en el servidor de autenticación" });
  }
});

// GET /api/auth/me (protegido)
router.get("/me", requireAuth, async (req, res) => {
  res.json({ ok: true, usuario: req.usuario });
});

// GET /api/auth/perfil (protegido) - obtiene los datos del admin logueado
router.get("/perfil", requireAuth, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: { id: true, nombre: true, email: true, rol: true, createdAt: true },
    });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

// PUT /api/auth/perfil (protegido) - actualiza nombre, email y/o contraseña segura
router.put("/perfil", requireAuth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { nombre, email, passwordActual, passwordNueva } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const data = {};

    // 1. Actualizar Nombre si se envía
    if (nombre && nombre.trim() !== usuario.nombre) {
      data.nombre = nombre.trim();
    }

    // 2. Actualizar Email si cambió
    if (email && email.trim().toLowerCase() !== usuario.email.toLowerCase()) {
      const emailLimpio = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailLimpio)) {
        return res.status(400).json({ error: "El correo electrónico no tiene un formato válido." });
      }

      const existeEmail = await prisma.usuario.findFirst({
        where: {
          email: emailLimpio,
          NOT: { id: usuarioId },
        },
      });
      if (existeEmail) {
        return res.status(400).json({ error: "Este correo electrónico ya está registrado por otro usuario." });
      }

      data.email = emailLimpio;
    }

    // 3. Actualizar Contraseña si se solicitó
    if (passwordNueva) {
      if (!passwordActual) {
        return res.status(400).json({ error: "Debes ingresar tu contraseña actual para cambiarla." });
      }

      const esValida = await bcrypt.compare(passwordActual, usuario.password);
      if (!esValida) {
        return res.status(400).json({ error: "La contraseña actual es incorrecta." });
      }

      // Validación de contraseña segura
      if (passwordNueva.length < 8) {
        return res.status(400).json({ error: "La nueva contraseña debe tener al menos 8 caracteres." });
      }
      if (!/[A-Za-z]/.test(passwordNueva) || !/[0-9]/.test(passwordNueva)) {
        return res.status(400).json({
          error: "La nueva contraseña debe incluir al menos una letra y al menos un número para ser segura.",
        });
      }

      data.password = await bcrypt.hash(passwordNueva, 10);
    }

    // Si no hubo ningún cambio
    if (Object.keys(data).length === 0) {
      return res.json({
        ok: true,
        mensaje: "No se realizaron cambios.",
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data,
    });

    // Generar nuevo token con los datos actualizados
    const nuevoToken = jwt.sign(
      { id: usuarioActualizado.id, email: usuarioActualizado.email, rol: usuarioActualizado.rol },
      process.env.JWT_SECRET || "cambia-esta-clave",
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      mensaje: "Tus datos se actualizaron correctamente.",
      token: nuevoToken,
      usuario: {
        id: usuarioActualizado.id,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
      },
    });
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    res.status(500).json({ error: err.message || "Error al actualizar perfil de usuario" });
  }
});

module.exports = router;
