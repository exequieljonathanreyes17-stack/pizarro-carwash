import { useState, useRef, useCallback, useEffect } from "react";
import { uploadUrl } from "../lib/api";

export default function ComparadorAntesDespues({
  antes,
  despues,
  titulo = "Detalles que se notan",
  className = "",
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [arrastrando, setArrastrando] = useState(false);
  const [cargadaAntes, setCargadaAntes] = useState(false);
  const [cargadaDespues, setCargadaDespues] = useState(false);
  const [errorAntes, setErrorAntes] = useState(false);
  const [errorDespues, setErrorDespues] = useState(false);

  const containerRef = useRef(null);
  const imgAntesRef = useRef(null);
  const imgDespuesRef = useRef(null);

  const urlAntes = uploadUrl(antes);
  const urlDespues = uploadUrl(despues);

  // Sincronización y comprobación de caché de navegador
  useEffect(() => {
    setCargadaAntes(false);
    setCargadaDespues(false);
    setErrorAntes(false);
    setErrorDespues(false);

    if (imgAntesRef.current?.complete && imgAntesRef.current?.naturalWidth > 0) {
      setCargadaAntes(true);
    }
    if (imgDespuesRef.current?.complete && imgDespuesRef.current?.naturalWidth > 0) {
      setCargadaDespues(true);
    }
  }, [urlAntes, urlDespues]);

  const ambasCargadas =
    (cargadaAntes || errorAntes) && (cargadaDespues || errorDespues);

  const calcularPosicion = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const porcentaje = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(porcentaje);
  }, []);

  const handlePointerDown = (e) => {
    if (!ambasCargadas) return;
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
          loading="eager"
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
        className={`relative h-[360px] sm:h-[460px] md:h-[520px] w-full max-w-4xl select-none overflow-hidden rounded-2xl border border-carbon-800/80 bg-carbon-950 shadow-2xl touch-none ${
          ambasCargadas ? "cursor-ew-resize" : "cursor-default"
        }`}
      >
        {/* Placeholder / Spinner de carga sincronizada mientras se descargan ambas imágenes */}
        {!ambasCargadas && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-carbon-950">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-14 w-14 animate-ping rounded-full bg-electric-500/15" />
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-electric-500/20 border-t-electric-400" />
            </div>
            <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-chrome-400 animate-pulse">
              Cargando comparación...
            </p>
          </div>
        )}

        {/* Imagen DESPUÉS (Fondo completo base de borde a borde) */}
        <img
          ref={imgDespuesRef}
          src={urlDespues}
          alt="Después del trabajo"
          onLoad={() => setCargadaDespues(true)}
          onError={() => setErrorDespues(true)}
          className={`absolute inset-0 h-full w-full object-cover pointer-events-none select-none transition-opacity duration-300 ${
            ambasCargadas ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />

        {/* Badge DESPUÉS */}
        <div
          className={`pointer-events-none absolute top-3.5 right-3.5 z-20 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10 shadow-md transition-opacity duration-300 ${
            ambasCargadas ? "opacity-100" : "opacity-0"
          }`}
        >
          DESPUÉS
        </div>

        {/* Imagen ANTES (Misma posición exacta y tamaño con clip-path nítido) */}
        <img
          ref={imgAntesRef}
          src={urlAntes}
          alt="Antes del trabajo"
          onLoad={() => setCargadaAntes(true)}
          onError={() => setErrorAntes(true)}
          className={`absolute inset-0 h-full w-full object-cover pointer-events-none select-none transition-opacity duration-300 ${
            ambasCargadas ? "opacity-100" : "opacity-0"
          }`}
          style={{
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
          }}
          draggable={false}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />

        {/* Badge ANTES */}
        <div
          className={`pointer-events-none absolute top-3.5 left-3.5 z-20 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10 shadow-md transition-opacity duration-300 ${
            ambasCargadas ? "opacity-100" : "opacity-0"
          }`}
        >
          ANTES
        </div>

        {/* Línea divisoria central con flechas gemelas ◄ ► */}
        <div
          className={`absolute top-0 bottom-0 z-30 flex items-center justify-center -translate-x-1/2 pointer-events-none transition-opacity duration-300 ${
            ambasCargadas ? "opacity-100" : "opacity-0"
          }`}
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
