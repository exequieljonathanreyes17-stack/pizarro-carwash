const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const productosRoutes = require("./routes/productos");
const serviciosRoutes = require("./routes/servicios");
const certificacionesRoutes = require("./routes/certificaciones");
const resultadosRoutes = require("./routes/resultados");
const marcasRoutes = require("./routes/marcas");
const resenasRoutes = require("./routes/resenas");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Cabeceras HTTP de alto rendimiento y caché CDN Edge (Vercel / Cloudflare)
app.use((req, res, next) => {
  res.setHeader("Connection", "keep-alive");

  const esAdminOPrivado =
    Boolean(req.headers.authorization) ||
    req.query.todos === "true" ||
    req.path.startsWith("/api/auth");

  // Peticiones públicas GET: el CDN de Vercel las entrega en ~15ms con s-maxage
  // max-age=0 en navegador para que nunca congele datos viejos en el navegador del usuario
  if (req.method === "GET" && !esAdminOPrivado) {
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=120, stale-while-revalidate=300");
  } else {
    // Peticiones del panel de administración o mutaciones: NUNCA almacenar en caché
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true, servicio: "Pizarro Carwash API" }));

app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/certificaciones", certificacionesRoutes);
app.use("/api/resultados", resultadosRoutes);
app.use("/api/marcas", marcasRoutes);
app.use("/api/resenas", resenasRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Error interno del servidor" });
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Pizarro Carwash API corriendo en http://localhost:${PORT}`);
});
server.timeout = 180000; // 3 minutos
server.keepAliveTimeout = 65000;
