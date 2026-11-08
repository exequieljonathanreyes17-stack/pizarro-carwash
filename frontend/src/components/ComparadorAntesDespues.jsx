import { useState, useRef, useCallback } from "react";
import { uploadUrl } from "../lib/api";

export default function ComparadorAntesDespues({
  antes,
  despues,
  titulo = "Detalles que se notan",
  className = "",
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [arrastrando, setArrastrando] = useState(false);
  const containerRef = useRef(null);

  const calcularPosicion = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const porcentaje = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(porcentaje);
  }, []);

  const handlePointerDown = (e) => {
    setArrastrando(true);
    calcularPosicion(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!arrastrando) return;
    calcularPosicion(e.clientX);
  };

  const handlePointerUp = (e) => {
    setArrastrando(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const urlAntes = uploadUrl(antes);
  const urlDespues = uploadUrl(despues);

  if (!urlAntes && !urlDespues) return null;

  // Si solo hay una imagen disponible, mostrar esa directamente
  if (!urlAntes || !urlDespues) {
    const unica = urlDespues || urlAntes;
    return (
      <div className={`overflow-hidden rounded-2xl border border-carbon-800 bg-carbon-950 ${className}`}>
        {titulo && (
          <div className="py-3 text-center">
            <h3 className="font-display text-lg font-bold text-white">{titulo}</h3>
          </div>
        )}
        <img
          src={unica}
          alt={titulo}
          className="h-[380px] sm:h-[480px] w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {titulo && (
        <h3 className="mb-4 font-display text-xl sm:text-2xl font-bold tracking-tight text-white text-center">
          {titulo}
        </h3>
      )}

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative h-[360px] sm:h-[460px] md:h-[520px] w-full max-w-4xl select-none overflow-hidden rounded-2xl border border-carbon-800/80 bg-carbon-950 shadow-2xl cursor-ew-resize touch-none"
      >
        {/* Imagen DESPUÉS (Fondo completo base de borde a borde) */}
        <img
          src={urlDespues}
          alt="Después del trabajo"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
          draggable={false}
          loading="lazy"
          decoding="async"
        />

        {/* Badge DESPUÉS (estilo fiel a la imagen de referencia) */}
        <div className="pointer-events-none absolute top-3.5 right-3.5 z-20 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10 shadow-md">
          DESPUÉS
        </div>

        {/* Imagen ANTES (Misma posición exacta y tamaño con clip-path nítido) */}
        <img
          src={urlAntes}
          alt="Antes del trabajo"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
          style={{
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
          }}
          draggable={false}
          loading="lazy"
          decoding="async"
        />

        {/* Badge ANTES */}
        <div className="pointer-events-none absolute top-3.5 left-3.5 z-20 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10 shadow-md">
          ANTES
        </div>

        {/* Línea divisoria central con flechas gemelas ◄ ► (como en la segunda imagen) */}
        <div
          className="absolute top-0 bottom-0 z-30 flex items-center justify-center -translate-x-1/2 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Línea divisoria blanca */}
          <div className="h-full w-[2px] bg-white drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]" />

          {/* Flechas integradas directamente sobre la línea */}
          <div className="absolute flex items-center justify-center gap-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            <svg
              className="h-4 w-4 fill-white -mr-1.5"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7v14z" />
            </svg>
            <svg
              className="h-4 w-4 fill-white -ml-1.5"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7V5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
