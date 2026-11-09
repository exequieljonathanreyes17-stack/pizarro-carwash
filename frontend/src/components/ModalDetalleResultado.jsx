import { useState, useEffect } from "react";
import {
  X,
  SlidersHorizontal,
  Images,
  ExternalLink,
  Wrench,
  Instagram,
  Video,
} from "lucide-react";
import ComparadorAntesDespues from "./ComparadorAntesDespues.jsx";
import GaleriaResultado from "./GaleriaResultado.jsx";
import { linkWhatsApp } from "../lib/whatsapp";
import IconoWhatsApp from "./IconoWhatsApp.jsx";
import { uploadUrl } from "../lib/api";

export default function ModalDetalleResultado({ resultado, onClose }) {
  if (!resultado) return null;

  const tieneAntesDespues = Boolean(resultado.imagenAntes && resultado.imagenDespues);
  const imagenesGaleria = Array.isArray(resultado.imagenes) ? resultado.imagenes : [];
  const tieneGaleria = imagenesGaleria.length > 0;

  // Si tiene ambos modos, permitir alternar con pestañas. Inicializa en el que esté disponible.
  const [tabActivo, setTabActivo] = useState(tieneAntesDespues ? "comparador" : "galeria");

  // Pre-cargar de forma inmediata y en alta prioridad las imágenes de comparación
  useEffect(() => {
    if (resultado.imagenAntes) {
      const img1 = new Image();
      if ("fetchPriority" in img1) img1.fetchPriority = "high";
      img1.src = uploadUrl(resultado.imagenAntes);
    }
    if (resultado.imagenDespues) {
      const img2 = new Image();
      if ("fetchPriority" in img2) img2.fetchPriority = "high";
      img2.src = uploadUrl(resultado.imagenDespues);
    }
  }, [resultado.imagenAntes, resultado.imagenDespues]);

  // Cerrar con Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const esInstagram = resultado.redSocialUrl && resultado.redSocialUrl.includes("instagram");
  const esFacebook = resultado.redSocialUrl && resultado.redSocialUrl.includes("facebook");
  const esTikTok = resultado.redSocialUrl && resultado.redSocialUrl.includes("tiktok");

  const mensajeWs = `Hola Pizarro Carwash! Vi el resultado "${resultado.titulo}" en la web y me interesa consultar por un turno para un trabajo similar.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-electric-500/20 bg-carbon-950 p-4 sm:p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="flex items-start justify-between gap-4 border-b border-carbon-800 pb-4">
          <div>
            {/* Badge del Servicio Asociado */}
            {resultado.servicio && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-electric-500/30 bg-electric-500/10 px-3 py-0.5 text-xs font-semibold text-electric-300">
                <Wrench size={13} className="text-electric-400" />
                {resultado.servicio.nombre}
              </span>
            )}
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              {resultado.titulo}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-carbon-800 bg-carbon-900/60 text-chrome-400 hover:border-carbon-700 hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Pestañas si tiene ambos: Comparador Antes/Después y Galería */}
        {tieneAntesDespues && tieneGaleria && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setTabActivo("comparador")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                tabActivo === "comparador"
                  ? "border border-electric-400 bg-electric-500/20 text-electric-300 shadow-neon"
                  : "border border-carbon-800 bg-carbon-900/60 text-chrome-400 hover:text-white"
              }`}
            >
              <SlidersHorizontal size={16} /> Comparador Antes y Después
            </button>

            <button
              type="button"
              onClick={() => setTabActivo("galeria")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                tabActivo === "galeria"
                  ? "border border-electric-400 bg-electric-500/20 text-electric-300 shadow-neon"
                  : "border border-carbon-800 bg-carbon-900/60 text-chrome-400 hover:text-white"
              }`}
            >
              <Images size={16} /> Galería de Fotos ({imagenesGaleria.length})
            </button>
          </div>
        )}

        {/* Contenido Visual Principal */}
        <div className="mt-5">
          {tabActivo === "comparador" && tieneAntesDespues ? (
            <ComparadorAntesDespues
              antes={resultado.imagenAntes}
              despues={resultado.imagenDespues}
              titulo="Detalles que se notan"
            />
          ) : tieneGaleria ? (
            <GaleriaResultado imagenes={imagenesGaleria} titulo={resultado.titulo} />
          ) : tieneAntesDespues ? (
            <ComparadorAntesDespues
              antes={resultado.imagenAntes}
              despues={resultado.imagenDespues}
              titulo="Detalles que se notan"
            />
          ) : null}
        </div>

        {/* Descripción del resultado */}
        {resultado.descripcion && (
          <div className="mt-6 rounded-xl border border-carbon-800/80 bg-carbon-900/40 p-4 text-sm leading-relaxed text-chrome-200">
            {resultado.descripcion}
          </div>
        )}

        {/* Acciones del pie: Link a Redes Sociales y WhatsApp */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-carbon-800 pt-5">
          {/* Botón a Red Social (Instagram / Facebook / Video) */}
          {resultado.redSocialUrl ? (
            <a
              href={resultado.redSocialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-carbon-800 bg-carbon-900 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:border-pink-500/50 hover:bg-carbon-800 hover:text-pink-300"
            >
              {esInstagram ? (
                <Instagram size={17} className="text-pink-400" />
              ) : esFacebook ? (
                <ExternalLink size={17} className="text-blue-400" />
              ) : (
                <Video size={17} className="text-electric-400" />
              )}
              <span>Ver video del trabajo en {esInstagram ? "Instagram" : esFacebook ? "Facebook" : "redes"}</span>
            </a>
          ) : (
            <span className="text-xs text-chrome-400">Pizarro Carwash Detailing</span>
          )}

          {/* Botón WhatsApp */}
          <a
            href={linkWhatsApp(mensajeWs)}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full sm:w-auto text-xs py-2.5 px-5"
          >
            <IconoWhatsApp size={17} /> Consultar por este trabajo
          </a>
        </div>
      </div>
    </div>
  );
}
