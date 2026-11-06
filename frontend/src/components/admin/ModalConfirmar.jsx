import { AlertTriangle, Trash2, X } from "lucide-react";

export default function ModalConfirmar({
  abierto,
  onCerrar,
  onConfirmar,
  titulo = "¿Estás seguro?",
  mensaje = "Esta acción no se puede deshacer.",
  nombreItem = "",
  textoBoton = "Eliminar",
  cargando = false,
}) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
      <div
        className="glass-card relative w-full max-w-md rounded-2xl border border-red-500/30 bg-carbon-950 p-6 shadow-2xl shadow-red-950/20"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onCerrar}
          disabled={cargando}
          className="absolute right-4 top-4 text-chrome-400 transition-colors hover:text-chrome-100 disabled:opacity-50"
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Trash2 size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-chrome-100">
              {titulo}
            </h3>
            <p className="mt-2 text-sm text-chrome-300 leading-relaxed">
              {mensaje}
            </p>
            {nombreItem && (
              <p className="mt-2 inline-block rounded-md bg-carbon-900 border border-carbon-800 px-2.5 py-1 text-xs font-semibold text-electric-400">
                "{nombreItem}"
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-carbon-800/80">
          <button
            type="button"
            onClick={onCerrar}
            disabled={cargando}
            className="rounded-lg border border-carbon-700 bg-carbon-900/60 px-4 py-2 text-sm font-semibold text-chrome-300 transition-colors hover:bg-carbon-800 hover:text-white disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={cargando}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 hover:shadow-red-500/50 active:scale-95 disabled:opacity-50"
          >
            {cargando ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>{textoBoton}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
