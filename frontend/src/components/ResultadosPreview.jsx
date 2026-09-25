import { Link } from "react-router-dom";
import { ArrowRight, ImageOff } from "lucide-react";
import { useResultados } from "../hooks/useDatos";
import { uploadUrl } from "../lib/api";

export default function ResultadosPreview() {
  const { resultados } = useResultados();
  const masReciente = [...resultados].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  return (
    <section className="relative border-t border-electric-500/10 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">RESULTADOS</span>
          <h2 className="section-title mt-3">Nuestro último trabajo</h2>
        </div>

        {!masReciente ? (
          <div className="mx-auto mt-14 flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed border-chrome-400/20 p-10 text-center">
            <ImageOff className="text-chrome-400" size={32} />
            <p className="text-chrome-400">Próximamente vas a ver acá fotos de nuestros trabajos.</p>
          </div>
        ) : (
          <>
            <div className="mx-auto mt-14 max-w-3xl">
              <div className="glass-card overflow-hidden rounded-xl">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img
                      src={uploadUrl(masReciente.imagenAntes)}
                      alt={`${masReciente.titulo} - antes`}
                      className="h-64 w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded bg-carbon-950/80 px-2 py-0.5 text-xs font-semibold uppercase text-chrome-300">
                      Antes
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src={uploadUrl(masReciente.imagenDespues)}
                      alt={`${masReciente.titulo} - después`}
                      className="h-64 w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 rounded bg-electric-600/80 px-2 py-0.5 text-xs font-semibold uppercase text-white">
                      Después
                    </span>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-display text-lg font-bold text-chrome-100">{masReciente.titulo}</h3>
                  {masReciente.descripcion && <p className="mt-1 text-sm text-chrome-300">{masReciente.descripcion}</p>}
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-center">
              <Link to="/resultados" className="btn-secondary">
                Ver todos los resultados <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
