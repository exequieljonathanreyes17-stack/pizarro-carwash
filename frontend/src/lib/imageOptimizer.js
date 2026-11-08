/**
 * Utilidad de optimización y compresión de imágenes en el cliente (Browser).
 * Reduce fotos pesadas de celulares (5MB - 15MB) a menos de 200KB - 300KB
 * preservando una excelente calidad visual para retina y pantallas 4K.
 * 
 * Beneficio:
 * - Reduce el tiempo de subida en la red hasta un 90%.
 * - Evita timeouts de red entre Vercel y Render.
 * - Disminuye el consumo de RAM en el servidor.
 */

export async function optimizarImagenParaWeb(file, { maxAncho = 1600, calidad = 0.80 } = {}) {
  if (!file) return null;

  // Si no es imagen o es SVG/GIF, no la tocamos
  if (!file.type || !file.type.startsWith("image/")) return file;
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  // Si ya es un archivo muy liviano (< 200KB), la dejamos tal cual
  if (file.size < 200 * 1024) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let ancho = img.naturalWidth || img.width;
        let alto = img.naturalHeight || img.height;

        // Si la imagen es más ancha o alta que el máximo permitido, redimensionar proporcionalmente
        if (ancho > maxAncho || alto > maxAncho) {
          if (ancho >= alto) {
            alto = Math.round((alto * maxAncho) / ancho);
            ancho = maxAncho;
          } else {
            ancho = Math.round((ancho * maxAncho) / alto);
            alto = maxAncho;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = ancho;
        canvas.height = alto;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, ancho, alto);

        // Exportar como JPEG optimizado
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const nombreLimpio = file.name.replace(/\.[^/.]+$/, ".jpg");
              const archivoOptimizado = new File([blob], nombreLimpio, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(archivoOptimizado);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          calidad
        );
      };

      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
