import { useState, useEffect } from "react";
import {
  ImageOff,
  SlidersHorizontal,
  Images,
  Wrench,
  Video,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Layout from "../components/Layout.jsx";
import { SkeletonResultados } from "../components/Skeletons.jsx";
import { useResultados } from "../hooks/useDatos";
import { uploadUrl } from "../lib/api";
import ModalDetalleResultado from "../components/ModalDetalleResultado.jsx";
import Paginacion from "../components/Paginacion.jsx";

const ITEMS_POR_PAGINA = 6;

export default function ResultadosPage() {
  const { resultados, cargando } = useResultados();
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtroServicio, setFiltroServicio] = useState("TODOS");
  const [pagina, setPagina] = useState(1);

  // Obtener lista única de servicios presentes en los resultados
  const serviciosPresentes = Array.from(
    new Set(
      resultados
        .filter((r) => r.servicio?.nombre)
        .map((r) => r.servicio.nombre)
    )
  );

  function cambiarFiltro(nuevoFiltro) {
    setFiltroServicio(nuevoFiltro);
    setPagina(1);
  }

  // Filtrado
  const resultadosFiltrados =
    filtroServicio === "TODOS"
      ? resultados
      : resultados.filter((r) => r.servicio?.nombre === filtroServicio);

  const totalPaginas = Math.ceil(resultadosFiltrados.length / ITEMS_POR_PAGINA) || 1;
  const paginaValida = Math.min(Math.max(1, pagina), totalPaginas);
  const resultadosPaginados = resultadosFiltrados.slice(
    (paginaValida - 1) * ITEMS_POR_PAGINA,
    paginaValida * ITEMS_POR_PAGINA
  );

  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {/* Encabezado */}
          <div className="mx-auto max-w-2xl text-center" id="seccion-resultados-titulo">
            <span className="section-eyebrow">GALERÍA DE TRABAJOS</span>
            <h1 className="section-title mt-3">Resultados reales y comprobados</h1>
            <p className="mt-3 text-sm text-chrome-300">
              Conocé en detalle las transformaciones logradas en nuestro taller. Hacé click en cualquier trabajo para interactuar con el comparador de antes y después o recorrer las fotos del proceso.
            </p>
          </div>

          {/* Filtros rápidos por servicio si hay más de 1 */}
          {serviciosPresentes.length > 1 && !cargando && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => cambiarFiltro("TODOS")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  filtroServicio === "TODOS"
                    ? "bg-electric-500 text-carbon-950 font-bold shadow-neon"
                    : "border border-carbon-800 bg-carbon-900/60 text-chrome-300 hover:border-carbon-700 hover:text-white"
                }`}
              >
                Todos los trabajos ({resultados.length})
              </button>

              {serviciosPresentes.map((nombreServicio) => {
                const cant = resultados.filter((r) => r.servicio?.nombre === nombreServicio).length;
                return (
                  <button
                    key={nombreServicio}
                    type="button"
                    onClick={() => cambiarFiltro(nombreServicio)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      filtroServicio === nombreServicio
                        ? "bg-electric-500 text-carbon-950 font-bold shadow-neon"
                        : "border border-carbon-800 bg-carbon-900/60 text-chrome-300 hover:border-carbon-700 hover:text-white"
                    }`}
                  >
                    {nombreServicio} ({cant})
                  </button>
                );
              })}
            </div>
          )}

          {/* Listado de resultados */}
          {cargando ? (
            <div className="mt-14">
              <SkeletonResultados cantidad={6} />
            </div>
          ) : resultadosFiltrados.length === 0 ? (
            <div className="mx-auto mt-14 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-chrome-400/20 p-10 text-center">
              <ImageOff className="text-chrome-400" size={36} />
              <p className="text-chrome-400 font-medium">
                {filtroServicio === "TODOS"
                  ? "Próximamente vas a ver acá fotos de nuestros trabajos."
                  : `No hay resultados cargados para el servicio "${filtroServicio}".`}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {resultadosPaginados.map((r) => {
                  const tieneAD = Boolean(r.imagenAntes && r.imagenDespues);
                  const cantGaleria = Array.isArray(r.imagenes) ? r.imagenes.length : 0;
                  const portada =
                    r.imagenDespues ||
                    r.imagenAntes ||
                    (cantGaleria > 0 ? r.imagenes[0] : null);

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSeleccionado(r)}
                      onPointerEnter={() => {
                        if (r.imagenAntes) {
                          const img = new Image();
                          img.src = uploadUrl(r.imagenAntes);
                        }
                        if (r.imagenDespues) {
                          const img = new Image();
                          img.src = uploadUrl(r.imagenDespues);
                        }
                      }}
                      className="glass-card group flex flex-col justify-between overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:border-electric-400/60 hover:shadow-neon hover:-translate-y-1"
                    >
                      {/* Visualización de Portada / Comparación */}
                      <div className="relative h-60 w-full overflow-hidden bg-carbon-950">
                        {tieneAD ? (
                          /* Split vista previa Antes / Después */
                          <div className="grid h-full w-full grid-cols-2">
                            <div className="relative h-full w-full overflow-hidden border-r border-carbon-900">
                              <img
                                src={uploadUrl(r.imagenAntes)}
                                alt={`${r.titulo} - antes`}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                              />
                              <span className="absolute bottom-2 left-2 rounded bg-carbon-950/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-chrome-300">
                                Antes
                              </span>
                            </div>
                            <div className="relative h-full w-full overflow-hidden">
                              <img
                                src={uploadUrl(r.imagenDespues)}
                                alt={`${r.titulo} - después`}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                              />
                              <span className="absolute bottom-2 right-2 rounded bg-electric-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                                Después
                              </span>
                            </div>
                          </div>
                        ) : portada ? (
                          <img
                            src={uploadUrl(portada)}
                            alt={r.titulo}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-chrome-500">
                            <Images size={36} />
                          </div>
                        )}

                        {/* Gradiente sutil */}
                        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/90 via-transparent to-black/50 pointer-events-none" />

                        {/* Badges superiores */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {tieneAD && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-electric-500/25 border border-electric-500/40 px-2.5 py-0.5 text-xs font-bold text-electric-300 backdrop-blur-md">
                              <SlidersHorizontal size={12} /> Antes / Después
                            </span>
                          )}
                          {cantGaleria > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/25 border border-purple-500/40 px-2.5 py-0.5 text-xs font-bold text-purple-300 backdrop-blur-md">
                              <Images size={12} /> +{cantGaleria} fotos
                            </span>
                          )}
                        </div>

                        {/* Badge de video social */}
                        {r.redSocialUrl && (
                          <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md">
                            <Video size={14} />
                          </span>
                        )}

                        {/* Prompt para ver interactivo */}
                        <div className="absolute bottom-2.5 right-3 rounded-lg bg-carbon-950/80 px-2.5 py-1 text-[11px] font-semibold text-electric-300 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                          Ver interactivo &rarr;
                        </div>
                      </div>

                      {/* Cuerpo de la tarjeta */}
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
                            <p className="mt-1.5 line-clamp-2 text-xs text-chrome-300 leading-relaxed">
                              {r.descripcion}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-carbon-800/80 pt-3 text-xs font-semibold text-chrome-400 group-hover:text-electric-300 transition-colors">
                          <span>Ver detalle y fotos</span>
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Paginación de 6 en 6 */}
              <Paginacion
                paginaActual={paginaValida}
                totalPaginas={totalPaginas}
                onCambiarPagina={setPagina}
                totalItems={resultadosFiltrados.length}
                itemsPorPagina={ITEMS_POR_PAGINA}
                labelItems="trabajos"
                scrollToId="seccion-resultados-titulo"
              />
            </>
          )}
        </div>
      </section>

      {/* Modal con comparador antes/después y galería con selector de fotos */}
      {seleccionado && (
        <ModalDetalleResultado
          resultado={seleccionado}
          onClose={() => setSeleccionado(null)}
        />
      )}
    </Layout>
  );
}
