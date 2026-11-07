import { useState, useMemo } from "react";
import Layout from "../components/Layout.jsx";
import { useServicios } from "../hooks/useDatos";
import TarjetaServicio from "../components/TarjetaServicio.jsx";
import Paginacion from "../components/Paginacion.jsx";
import { SkeletonServicios } from "../components/Skeletons.jsx";
import { Car, Bike, Sparkles, Layers } from "lucide-react";

const ITEMS_POR_PAGINA = 6;

const FILTROS = [
  { id: "TODOS", label: "Todos", icono: Layers },
  { id: "AUTO", label: "Autos", icono: Car },
  { id: "MOTO", label: "Motos", icono: Bike },
  { id: "AMBOS", label: "Autos y Motos", icono: Sparkles },
];

export default function ServiciosPage() {
  const { servicios, cargando } = useServicios();
  const [filtro, setFiltro] = useState("TODOS");
  const [pagina, setPagina] = useState(1);

  const conteos = useMemo(() => {
    return {
      TODOS: servicios.length,
      AUTO: servicios.filter((s) => s.tipoVehiculo === "AUTO").length,
      MOTO: servicios.filter((s) => s.tipoVehiculo === "MOTO").length,
      AMBOS: servicios.filter((s) => s.tipoVehiculo === "AMBOS").length,
    };
  }, [servicios]);

  const filtrados = useMemo(() => {
    if (filtro === "AUTO") return servicios.filter((s) => s.tipoVehiculo === "AUTO");
    if (filtro === "MOTO") return servicios.filter((s) => s.tipoVehiculo === "MOTO");
    if (filtro === "AMBOS") return servicios.filter((s) => s.tipoVehiculo === "AMBOS");
    return servicios;
  }, [servicios, filtro]);

  const totalPaginas = Math.ceil(filtrados.length / ITEMS_POR_PAGINA) || 1;
  const paginaValida = Math.min(Math.max(1, pagina), totalPaginas);
  const serviciosPaginados = filtrados.slice(
    (paginaValida - 1) * ITEMS_POR_PAGINA,
    paginaValida * ITEMS_POR_PAGINA
  );

  function cambiarFiltro(nuevoFiltro) {
    setFiltro(nuevoFiltro);
    setPagina(1);
  }

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center" id="seccion-servicios-titulo">
            <span className="section-eyebrow">NUESTROS SERVICIOS</span>
            <h1 className="section-title mt-3">Todos los servicios</h1>
            <p className="mt-4 text-chrome-300">
              Elegí un servicio para ver el detalle completo, dejar tu reseña o consultar por
              WhatsApp.
            </p>
          </div>

          {/* Filtros por tipo de vehículo */}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {FILTROS.map((f) => {
              const Icono = f.icono;
              const activo = filtro === f.id;
              const count = conteos[f.id];

              return (
                <button
                  key={f.id}
                  onClick={() => cambiarFiltro(f.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    activo
                      ? "border-electric-400 bg-electric-500/20 text-electric-300 shadow-neon"
                      : "border-carbon-800 bg-carbon-900/60 text-chrome-300 hover:border-electric-500/40 hover:text-white"
                  }`}
                >
                  <Icono size={16} className={activo ? "text-electric-400" : "text-chrome-400"} />
                  <span>{f.label}</span>
                  {!cargando && (
                    <span
                      className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                        activo ? "bg-electric-500/30 text-white" : "bg-carbon-800 text-chrome-400"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Listado de servicios / Skeleton / Estado vacío */}
          {cargando ? (
            <div className="mt-12">
              <SkeletonServicios cantidad={6} />
            </div>
          ) : filtrados.length === 0 ? (
            <div className="mx-auto mt-14 flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed border-chrome-400/20 p-10 text-center">
              <p className="text-chrome-400">No hay servicios disponibles en esta categoría.</p>
            </div>
          ) : (
            <>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {serviciosPaginados.map((s) => (
                  <TarjetaServicio key={s.id} servicio={s} />
                ))}
              </div>

              <Paginacion
                paginaActual={paginaValida}
                totalPaginas={totalPaginas}
                onCambiarPagina={setPagina}
                totalItems={filtrados.length}
                itemsPorPagina={ITEMS_POR_PAGINA}
              />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
