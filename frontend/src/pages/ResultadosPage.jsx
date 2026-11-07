import { useState } from "react";
import { X, ImageOff } from "lucide-react";
import Layout from "../components/Layout.jsx";
import { SkeletonResultados } from "../components/Skeletons.jsx";
import { useResultados } from "../hooks/useDatos";
import { uploadUrl } from "../lib/api";

export default function ResultadosPage() {
  const { resultados, cargando } = useResultados();
  const [seleccionado, setSeleccionado] = useState(null);

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">RESULTADOS</span>
            <h1 className="section-title mt-3">Antes y después de nuestros trabajos</h1>
          </div>

          {cargando ? (
            <div className="mt-14">
              <SkeletonResultados cantidad={6} />
            </div>
          ) : resultados.length === 0 ? (
            <div className="mx-auto mt-14 flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed border-chrome-400/20 p-10 text-center">
              <ImageOff className="text-chrome-400" size={32} />
              <p className="text-chrome-400">Próximamente vas a ver acá fotos de nuestros trabajos.</p>
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {resultados.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSeleccionado(r)}
                  className="glass-card overflow-hidden rounded-xl text-left transition-all hover:border-electric-400/60 hover:shadow-neon"
                >
                  <div className="grid grid-cols-2">
                    <img src={uploadUrl(r.imagenAntes)} alt={`${r.titulo} - antes`} className="h-40 w-full object-cover" />
                    <img src={uploadUrl(r.imagenDespues)} alt={`${r.titulo} - después`} className="h-40 w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-chrome-100">{r.titulo}</h3>
                    {r.descripcion && <p className="mt-1 line-clamp-2 text-xs text-chrome-300">{r.descripcion}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {seleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSeleccionado(null)}
        >
          <div
            className="glass-card w-full max-w-3xl overflow-hidden rounded-xl bg-carbon-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-electric-500/10 p-4">
              <h3 className="font-display text-lg font-bold text-chrome-100">{seleccionado.titulo}</h3>
              <button onClick={() => setSeleccionado(null)} className="text-chrome-400 hover:text-chrome-100">
                <X size={22} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative">
                <img src={uploadUrl(seleccionado.imagenAntes)} alt="Antes" className="h-72 w-full object-cover" />
                <span className="absolute bottom-2 left-2 rounded bg-carbon-950/80 px-2 py-0.5 text-xs font-semibold uppercase text-chrome-300">
                  Antes
                </span>
              </div>
              <div className="relative">
                <img src={uploadUrl(seleccionado.imagenDespues)} alt="Después" className="h-72 w-full object-cover" />
                <span className="absolute bottom-2 left-2 rounded bg-electric-600/80 px-2 py-0.5 text-xs font-semibold uppercase text-white">
                  Después
                </span>
              </div>
            </div>
            {seleccionado.descripcion && (
              <p className="p-4 text-sm text-chrome-300">{seleccionado.descripcion}</p>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
