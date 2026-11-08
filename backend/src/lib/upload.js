const multer = require("multer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", "..", ".env") });
require("dotenv").config();
const cloudinary = require("./cloudinary");

// Filtro de extensiones permitidas
const fileFilter = (req, file, cb) => {
  const permitidos = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".avif"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (permitidos.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen no permitido (solo JPG, PNG, WEBP, SVG, AVIF)"));
  }
};

// Almacenamiento 100% en memoria para streaming directo a Cloudinary
// No guarda archivos en disco local, evitando llenar el servidor.
const baseUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Hasta 10MB
  fileFilter,
});

// Función para subir buffer directamente a Cloudinary
function subirBufferACloudinary(buffer, nombreOriginal = "imagen") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "pizarro-carwash",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary Stream Error]:", error);
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// Middleware procesador que sube a Cloudinary
async function procesarArchivoCloudinary(file) {
  if (!file || !file.buffer) return file;
  console.log(`[Upload] Subiendo archivo "${file.originalname}" (${file.buffer.length} bytes) a Cloudinary...`);
  const res = await subirBufferACloudinary(file.buffer, file.originalname);
  console.log(`[Upload] Subida exitosa a Cloudinary -> ${res.secure_url}`);
  file.secure_url = res.secure_url;
  file.path = res.secure_url;
  file.url = res.secure_url;
  file.filename = res.public_id;
  return file;
}

const upload = {
  single(campo) {
    const middleware = baseUpload.single(campo);

    return (req, res, next) => {
      middleware(req, res, async (err) => {
        if (err) return next(err);
        if (req.file) {
          try {
            await procesarArchivoCloudinary(req.file);
          } catch (uploadErr) {
            console.error("[Upload] Error al subir imagen a Cloudinary:", uploadErr);
            return next(
              new Error(`Error al subir la imagen a Cloudinary: ${uploadErr.message || "Fallo en la nube"}`)
            );
          }
        }
        next();
      });
    };
  },

  fields(campos) {
    const middleware = baseUpload.fields(campos);

    return (req, res, next) => {
      middleware(req, res, async (err) => {
        if (err) return next(err);
        if (req.files) {
          try {
            for (const campo of Object.keys(req.files)) {
              const arrayArchivos = req.files[campo];
              if (Array.isArray(arrayArchivos)) {
                for (const f of arrayArchivos) {
                  await procesarArchivoCloudinary(f);
                }
              }
            }
          } catch (uploadErr) {
            console.error("[Upload] Error al subir imágenes a Cloudinary:", uploadErr);
            return next(
              new Error(`Error al subir las imágenes a Cloudinary: ${uploadErr.message || "Fallo en la nube"}`)
            );
          }
        }
        next();
      });
    };
  },
};

function obtenerUrlImagen(file, fallback = null) {
  if (!file) return fallback || null;
  if (file.secure_url) return file.secure_url;
  if (file.path && file.path.startsWith("http")) return file.path;
  if (file.filename && file.filename.startsWith("http")) return file.filename;
  return fallback || null;
}

upload.obtenerUrlImagen = obtenerUrlImagen;

module.exports = upload;
