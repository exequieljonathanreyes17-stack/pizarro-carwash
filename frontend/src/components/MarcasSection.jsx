import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { api, uploadUrl } from "../lib/api";

export default function MarcasSection() {
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    api
      .get("/marcas")
      .then(setMarcas)
      .catch(() => setMarcas([]));
  }, []);

  if (marcas.length === 0) return null;

  return (
    <div className="mt-16 border-t border-electric-500/10 pt-10">
      <p className="text-center font-display text-xs font-semibold uppercase tracking-[0.3em] text-chrome-400">
        Trabajamos con
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
        {marcas.map((m) => (
          <div key={m.id} className="flex flex-col items-center gap-2 opacity-80 transition-opacity hover:opacity-100">
            {m.logoUrl ? (
              <img src={uploadUrl(m.logoUrl)} alt={m.nombre} className="h-10 w-auto object-contain grayscale" />
            ) : (
              <Award className="text-chrome-400" size={28} />
            )}
            <span className="text-xs text-chrome-400">{m.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
