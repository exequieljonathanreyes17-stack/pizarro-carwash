import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { api } from "../../lib/api";
import Estrellas from "../../components/Estrellas.jsx";

export default function AdminResenas() {
  const [resenas, setResenas] = useState([]);

  function cargar() {
    api.get("/resenas", true).then(setResenas).catch(() => {});
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

      <div className="mt-6 space-y-3">
        {resenas.map((r) => (
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
    </div>
  );
}
