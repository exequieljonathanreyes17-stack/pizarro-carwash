import { PackageSearch } from "lucide-react";
import { uploadUrl } from "../lib/api";

export default function TarjetaProducto({ producto }) {
  return (
    <div className="glass-card flex flex-col overflow-hidden rounded-xl transition-all duration-300 hover:border-electric-400/60 hover:shadow-neon">
      <div className="flex h-40 items-center justify-center bg-carbon-900">
        {producto.imagenUrl ? (
          <img
            src={uploadUrl(producto.imagenUrl)}
            alt={producto.nombre}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <PackageSearch className="text-chrome-400/50" size={40} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-carbon-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-chrome-400">
            {producto.categoria}
          </span>
          {producto.destacado && (
            <span className="rounded-full bg-electric-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-electric-400">
              Destacado
            </span>
          )}
        </div>
        <h3 className="mt-2 font-display text-base font-bold text-chrome-100">{producto.nombre}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-xs text-chrome-300">{producto.descripcion}</p>
      </div>
    </div>
  );
}
