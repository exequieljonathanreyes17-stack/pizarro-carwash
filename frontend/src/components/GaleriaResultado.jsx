import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { uploadUrl } from "../lib/api";

export default function GaleriaResultado({ imagenes = [], titulo = "", className = "" }) {
  const [indiceActivo, setIndiceActivo] = useState(0);

  if (!imagenes || imagenes.length === 0) return null;

  const MAX_MINIATURAS = 7;
  const tieneMas = imagenes.length > MAX_MINIATURAS;
  const miniaturasVisibles = imagenes.slice(0, MAX_MINIATURAS);
  const extraCount = imagenes.length - MAX_MINIATURAS;

  const imagenPrincipal = uploadUrl(imagenes[indiceActivo] || imagenes[0]);

  function anterior() {
    setIndiceActivo((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  }

  function siguiente() {
    setIndiceActivo((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Contenedor tipo vitrina: Miniaturas a la izquierda + Foto principal a la derecha (como en la referencia) */}
      <div className="flex flex-col-reverse md:flex-row gap-3 sm:gap-4 items-start">
        
        {/* Columna / Tira de Miniaturas */}
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[480px] w-full md:w-24 shrink-0 pb-2 md:pb-0 scrollbar-thin">
          {miniaturasVisibles.map((img, i) => {
            const esActivo = i === indiceActivo;
            const esUltimoConMas = tieneMas && i === MAX_MINIATURAS - 1;

            return (
              <button
                key={i}
                type="button"
                onClick={() => setIndiceActivo(i)}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 md:h-20 md:w-full shrink-0 overflow-hidden rounded-lg border bg-carbon-900 transition-all duration-150 ${
                  esActivo
                    ? "border-electric-400 ring-2 ring-electric-400 shadow-neon"
                    : "border-carbon-800 opacity-75 hover:opacity-100 hover:border-chrome-400"
                }`}
              >
                <img
                  src={uploadUrl(img)}
                  alt={`Miniatura ${i + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Si es el último visible y hay más fotos, mostrar badge "+N" */}
                {esUltimoConMas && extraCount > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-carbon-950/80 font-display text-sm font-bold text-electric-400">
                    +{extraCount + 1}
                  </div>
                )}
              </button>
            );
          })}

          {/* Si se seleccionó una foto que está más allá de las primeras 7, mostrar indicador */}
          {indiceActivo >= MAX_MINIATURAS && (
            <div className="rounded border border-electric-400 bg-electric-500/20 p-1 text-center text-[10px] font-bold text-electric-300">
              Foto {indiceActivo + 1} de {imagenes.length}
            </div>
          )}
        </div>

        {/* Foto Principal Ampliada */}
        <div className="relative group flex-1 h-[340px] sm:h-[440px] md:h-[480px] w-full overflow-hidden rounded-2xl border border-carbon-800 bg-carbon-950/80 shadow-2xl flex items-center justify-center">
          <img
            src={imagenPrincipal}
            alt={titulo || "Resultado del trabajo"}
            className="h-full w-full object-contain md:object-cover transition-transform duration-300"
          />

          {/* Flecha Anterior */}
          {imagenes.length > 1 && (
            <button
              onClick={anterior}
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-carbon-950/70 text-white border border-white/10 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-carbon-900 hover:scale-110"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Flecha Siguiente */}
          {imagenes.length > 1 && (
            <button
              onClick={siguiente}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-carbon-950/70 text-white border border-white/10 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-carbon-900 hover:scale-110"
              aria-label="Foto siguiente"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Contador de fotos inferior */}
          <div className="absolute bottom-3 right-3 rounded-full bg-carbon-950/80 px-3 py-1 text-xs font-semibold text-chrome-300 border border-white/10 backdrop-blur-md flex items-center gap-1.5">
            <ImageIcon size={14} className="text-electric-400" />
            <span>
              {indiceActivo + 1} / {imagenes.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
