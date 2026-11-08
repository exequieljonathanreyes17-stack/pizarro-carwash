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

  const handleMouseDown = () => setArrastrando(true);
  const handleMouseUp = () => setArrastrando(false);

  const handleMouseMove = (e) => {
    if (!arrastrando) return;
    calcularPosicion(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      calcularPosicion(e.touches[0].clientX);
    }
  };

  const handleClick = (e) => {
    calcularPosicion(e.clientX);
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
        <img src={unica} alt={titulo} className="h-[380px] sm:h-[480px] w-full object-cover" />
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
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative h-[340px] sm:h-[440px] md:h-[500px] w-full max-w-4xl select-none overflow-hidden rounded-2xl border border-electric-500/20 bg-carbon-950 shadow-2xl cursor-ew-resize"
      >
        {/* Imagen DESPUÉS (Base completa a la derecha) */}
        <img
          src={urlDespues}
          alt="Después del trabajo"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Badge DESPUÉS */}
        <div className="pointer-events-none absolute top-4 right-4 z-20 rounded-md bg-carbon-950/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-electric-400 backdrop-blur-md border border-electric-500/30 shadow-lg">
          DESPUÉS
        </div>

        {/* Imagen ANTES (Recortada según el sliderPos a la izquierda) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={urlAntes}
            alt="Antes del trabajo"
            className="absolute inset-0 h-full w-full object-cover pointer-events-none max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%",
            }}
            draggable={false}
          />

          {/* Badge ANTES */}
          <div className="pointer-events-none absolute top-4 left-4 z-20 rounded-md bg-carbon-950/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-chrome-300 backdrop-blur-md border border-white/20 shadow-lg">
            ANTES
          </div>
        </div>

        {/* Línea divisoria y Manija interactiva */}
        <div
          className="absolute top-0 bottom-0 z-30 flex items-center justify-center -ml-[2px]"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={() => setArrastrando(true)}
        >
          {/* Línea de separación */}
          <div className="h-full w-[3px] bg-white shadow-[0_0_12px_rgba(34,211,238,0.8)]" />

          {/* Botón central con flechas */}
          <div className="absolute flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-carbon-950/90 text-white shadow-neon backdrop-blur-md transition-transform duration-150 hover:scale-110 active:scale-95">
            <svg
              className="h-5 w-5 fill-current text-electric-300"
              viewBox="0 0 24 24"
            >
              <path d="M8.5 7l-5 5 5 5v-10zm7 0v10l5-5-5-5z" />
            </svg>
          </div>
        </div>

        {/* Indicador de ayuda en la parte inferior */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-carbon-950/75 px-3 py-1 text-[11px] font-medium text-chrome-300 backdrop-blur-md border border-white/10">
          Deslizá a los lados para comparar
        </div>
      </div>
    </div>
  );
}
