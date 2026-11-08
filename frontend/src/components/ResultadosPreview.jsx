import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ImageOff,
  SlidersHorizontal,
  Images,
  Wrench,
  Video,
  Sparkles,
} from "lucide-react";
import { useResultados } from "../hooks/useDatos";
import { uploadUrl } from "../lib/api";
import ModalDetalleResultado from "./ModalDetalleResultado.jsx";

export default function ResultadosPreview() {
  const { resultados, cargando } = useResultados();
  const [resultadoSeleccionado, setResultadoSeleccionado] = useState(null);

  // Mostrar los primeros 3 resultados
  const primeros3 = resultados.slice(0, 3);

  return (
    <section className="relative border-t border-electric-500/10 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">RESULTADOS REALES</span>
          <h2 className="section-title mt-3">Transformaciones que hablan por sí solas</h2>
          <p className="mt-3 text-sm text-chrome-300">
            Mirá los resultados logrados en los vehículos de nuestros clientes. Deslizá para ver el antes y después o recorré la galería de fotos.
          </p>
        </div>

        {cargando ? (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card overflow-hidden rounded-2xl animate-pulse">
                <div className="h-56 w-full bg-carbon-800/60" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-1/3 rounded bg-carbon-800" />
                  <div className="h-6 w-3/4 rounded bg-carbon-800" />
                  <div className="h-4 w-full rounded bg-carbon-800/50" />
                </div>
              </div>
            ))}
          </div>
        ) : primeros3.length === 0 ? (
          <div className="mx-auto mt-14 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-chrome-400/20 p-10 text-center">
            <ImageOff className="text-chrome-400" size={32} />
            <p className="text-chrome-400">Próximamente vas a ver acá fotos de nuestros trabajos.</p>
          </div>
        ) : (
          <>
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {primeros3.map((r) => {
                const tieneAD = Boolean(r.imagenAntes && r.imagenDespues);
                const cantGaleria = Array.isArray(r.imagenes) ? r.imagenes.length : 0;
                const portada =
                  r.imagenDespues ||
                  r.imagenAntes ||
                  (cantGaleria > 0 ? r.imagenes[0] : null);

                return (
                  <div
                    key={r.id}
                    onClick={() => setResultadoSeleccionado(r)}
                    className="glass-card group flex flex-col justify-between overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:border-electric-400/60 hover:shadow-neon hover:-translate-y-1"
                  >
                    {/* Contenedor de la Portada */}
                    <div className="relative h-56 w-full overflow-hidden bg-carbon-950">
                      {portada ? (
                        <img
                          src={uploadUrl(portada)}
                          alt={r.titulo}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-chrome-500">
                          <Images size={36} />
                        </div>
                      )}

                      {/* Gradiente oscuro superior */}
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-black/60 pointer-events-none" />

                      {/* Badges de características */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {tieneAD && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-electric-500/20 border border-electric-500/40 px-2.5 py-0.5 text-xs font-bold text-electric-300 backdrop-blur-md">
                            <SlidersHorizontal size={12} /> Antes / Después
                          </span>
                        )}
                        {cantGaleria > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 text-xs font-bold text-purple-300 backdrop-blur-md">
                            <Images size={12} /> +{cantGaleria} fotos
                          </span>
                        )}
                      </div>

                      {/* Badge de video si tiene enlace */}
                      {r.redSocialUrl && (
                        <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md">
                          <Video size={14} />
                        </span>
                      )}

                      {/* Indicador de acción al pie de la foto */}
                      <div className="absolute bottom-2.5 right-3 rounded-lg bg-carbon-950/80 px-2.5 py-1 text-[11px] font-semibold text-electric-300 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        Click para ver detalle &rarr;
                      </div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        {r.servicio && (
                          <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-electric-400">
                            <Wrench size={13} />
                            {r.servicio.nombre}
                          </span>
                        )}
                        <h3 className="font-display text-lg font-bold text-chrome-100 group-hover:text-electric-300 transition-colors">
                          {r.titulo}
                        </h3>
                        {r.descripcion && (
                          <p className="mt-1.5 line-clamp-2 text-xs text-chrome-300">
                            {r.descripcion}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-carbon-800/80 pt-3 text-xs font-semibold text-chrome-400 group-hover:text-electric-300 transition-colors">
                        <span>Ver resultado completo</span>
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botón para ver todos los resultados */}
            <div className="mt-12 flex justify-center">
              <Link to="/resultados" className="btn-secondary">
                Ver todos los resultados <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Modal interactivo al hacer click en cualquier resultado */}
      {resultadoSeleccionado && (
        <ModalDetalleResultado
          resultado={resultadoSeleccionado}
          onClose={() => setResultadoSeleccionado(null)}
        />
      )}
    </section>
  );
}
