const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", "..", ".env") });
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function extraerPublicIdDeCloudinary(url) {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) return null;
  try {
    const uploadIdx = url.indexOf("/upload/");
    if (uploadIdx === -1) return null;
    const pathAfterUpload = url.substring(uploadIdx + 8);
    const parts = pathAfterUpload.split("/");
    const cleanParts = [];
    let passedPrefix = false;
    for (const part of parts) {
      if (!passedPrefix) {
        if (/^v\d+$/.test(part)) {
          passedPrefix = true;
          continue;
        } else if (part.includes(",") || part.startsWith("c_") || part.startsWith("w_") || part.startsWith("h_")) {
          continue;
        } else {
          passedPrefix = true;
          cleanParts.push(part);
        }
      } else {
        cleanParts.push(part);
      }
    }
    const full = cleanParts.join("/");
    const lastDot = full.lastIndexOf(".");
    return lastDot !== -1 ? full.substring(0, lastDot) : full;
  } catch (err) {
    console.error("[Cloudinary] Error parseando public_id:", err);
    return null;
  }
}

async function eliminarDeCloudinary(url) {
  const publicId = extraerPublicIdDeCloudinary(url);
  if (!publicId) return null;
  try {
    console.log(`[Cloudinary] Eliminando asset de Cloudinary: ${publicId}`);
    const res = await cloudinary.uploader.destroy(publicId);
    console.log(`[Cloudinary] Resultado eliminación ${publicId}:`, res?.result || res);
    return res;
  } catch (err) {
    console.error(`[Cloudinary] Error eliminando ${publicId}:`, err.message);
    return null;
  }
}

async function eliminarMultiplesDeCloudinary(urls) {
  if (!Array.isArray(urls) || urls.length === 0) return;
  const promesas = urls.filter(Boolean).map((u) => eliminarDeCloudinary(u));
  await Promise.all(promesas);
}

cloudinary.extraerPublicIdDeCloudinary = extraerPublicIdDeCloudinary;
cloudinary.eliminarDeCloudinary = eliminarDeCloudinary;
cloudinary.eliminarMultiplesDeCloudinary = eliminarMultiplesDeCloudinary;

module.exports = cloudinary;
