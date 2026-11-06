import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { api, cache } from "../../lib/api";
import Estrellas from "../../components/Estrellas.jsx";
import { SkeletonResenas } from "../../components/admin/AdminSkeletons.jsx";
import Paginacion from "../../components/admin/Paginacion.jsx";

const ITEMS_POR_PAGINA = 6;

export default function AdminResenas() {
  const [resenas, setResenas] = useState(() => cache.get("/resenas") || []);
  const [cargando, setCargando] = useState(() => !cache.get("/resenas"));
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.ceil(resenas.length / ITEMS_POR_PAGINA) || 1;
  const paginaValida = Math.min(Math.max(1, pagina), totalPaginas);
  const resenasPaginadas = resenas.slice(
    (paginaValida - 1) * ITEMS_POR_PAGINA,
    paginaValida * ITEMS_POR_PAGINA
  );

  function cargar() {
    if (!cache.get("/resenas")) setCargando(true);
    api.get("/resenas", true)
      .then((data) => {
        setResenas(data);
        cache.set("/resenas", data);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }
  useEffect(cargar, []);

  async function eliminar(id) {
    if (!confirm("¿Eliminar esta reseña?")) return;
    await api.del(`/resenas/${id}`, { auth: true });
    cargar();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-chrome-100">Reseñas</h1>
      <p className="mt-1 text-sm text-chrome-400">
        Reseñas dejadas por clientes en cada servicio. Podés eliminar las que no correspondan.
      </p>

      {cargando && resenas.length === 0 ? (
        <SkeletonResenas />
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {resenasPaginadas.map((r) => (
              <div key={r.id} className="glass-card rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-electric-400">
                      {r.servicio?.nombre}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-semibold text-chrome-100">{r.nombreCliente}</span>
                      <Estrellas valor={r.calificacion} tamano={14} />
                    </div>
                    <p className="mt-2 text-sm text-chrome-300">{r.comentario}</p>
                    <p className="mt-2 text-[11px] text-chrome-400">
                      {new Date(r.createdAt).toLocaleString("es-AR")}
                    </p>
                  </div>
                  <button onClick={() => eliminar(r.id)} className="text-chrome-300 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {resenas.length === 0 && <p className="text-chrome-400">Todavía no hay reseñas.</p>}
          </div>

          <Paginacion
            paginaActual={paginaValida}
            totalPaginas={totalPaginas}
            onCambiarPagina={setPagina}
            totalItems={resenas.length}
            itemsPorPagina={ITEMS_POR_PAGINA}
          />
        </>
      )}
    </div>
  );
}
