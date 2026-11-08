import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Paginacion({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
  totalItems,
  itemsPorPagina = 6,
  labelItems = "servicios",
  scrollToId = "seccion-servicios-titulo",
}) {
  if (totalPaginas <= 1) return null;

  const inicio = (paginaActual - 1) * itemsPorPagina + 1;
  const fin = Math.min(paginaActual * itemsPorPagina, totalItems);

  function irAPagina(num) {
    onCambiarPagina(num);
    const el = document.getElementById(scrollToId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 150, behavior: "smooth" });
    }
  }

  return (
    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-electric-500/10 pt-6 text-xs text-chrome-400">
      {totalItems !== undefined && (
        <p>
          Mostrando <span className="font-semibold text-chrome-100">{inicio}</span> a{" "}
          <span className="font-semibold text-chrome-100">{fin}</span> de{" "}
          <span className="font-semibold text-chrome-100">{totalItems}</span> {labelItems}
        </p>
      )}

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => irAPagina(paginaActual - 1)}
          disabled={paginaActual <= 1}
          className="flex items-center gap-1 rounded-lg border border-carbon-800 bg-carbon-900/60 px-3 py-1.5 font-semibold text-chrome-200 transition-colors hover:border-electric-500/40 hover:text-electric-400 disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => {
            const esActiva = num === paginaActual;
            return (
              <button
                key={num}
                onClick={() => irAPagina(num)}
                className={`h-8 w-8 rounded-lg font-semibold transition-all ${
                  esActiva
                    ? "bg-gradient-to-r from-electric-400 to-electric-600 text-white font-bold shadow-neon"
                    : "border border-carbon-800 bg-carbon-900/40 text-chrome-300 hover:border-electric-500/30 hover:text-white"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => irAPagina(paginaActual + 1)}
          disabled={paginaActual >= totalPaginas}
          className="flex items-center gap-1 rounded-lg border border-carbon-800 bg-carbon-900/60 px-3 py-1.5 font-semibold text-chrome-200 transition-colors hover:border-electric-500/40 hover:text-electric-400 disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
