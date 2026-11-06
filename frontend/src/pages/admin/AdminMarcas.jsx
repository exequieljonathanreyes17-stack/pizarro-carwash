import { useEffect, useState } from "react";
import { Plus, Trash2, X, Award } from "lucide-react";
import { api, cache, uploadUrl } from "../../lib/api";
import { SkeletonCards } from "../../components/admin/AdminSkeletons.jsx";

export default function AdminMarcas() {
  const [marcas, setMarcas] = useState(() => cache.get("/marcas") || []);
  const [cargando, setCargando] = useState(() => !cache.get("/marcas"));
  const [nombre, setNombre] = useState("");
  const [logo, setLogo] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function cargar() {
    if (!cache.get("/marcas")) setCargando(true);
    api.get("/marcas?todos=true")
      .then((data) => {
        setMarcas(data);
        cache.set("/marcas", data);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }
  useEffect(cargar, []);

  async function eliminar(id) {
    if (!confirm("¿Eliminar esta marca?")) return;
    await api.del(`/marcas/${id}`, { auth: true });
    cargar();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setGuardando(true);
    const data = new FormData();
    data.append("nombre", nombre);
    if (logo) data.append("logo", logo);
    try {
      await api.post("/marcas", data, { isForm: true, auth: true });
      setMostrarForm(false);
      setNombre("");
      setLogo(null);
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-chrome-100">Marcas</h1>
        <button onClick={() => setMostrarForm(true)} className="btn-primary !px-4 !py-2 text-sm">
          <Plus size={18} /> Nueva marca
        </button>
      </div>
      <p className="mt-2 text-sm text-chrome-400">
        Se muestran en el inicio, debajo de la sección de productos.
      </p>

      <div className="mt-6">
        {cargando && marcas.length === 0 ? (
          <SkeletonCards />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {marcas.map((m) => (
              <div key={m.id} className="glass-card flex flex-col items-center gap-2 rounded-xl p-4">
                {m.logoUrl ? (
                  <img src={uploadUrl(m.logoUrl)} alt={m.nombre} className="h-12 w-full object-contain" />
                ) : (
                  <Award className="text-chrome-400" size={28} />
                )}
                <span className="text-xs text-chrome-300">{m.nombre}</span>
                <button onClick={() => eliminar(m.id)} className="text-chrome-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {marcas.length === 0 && <p className="text-chrome-400">Todavía no cargaste marcas.</p>}
          </div>
        )}
      </div>

      {mostrarForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass-card w-full max-w-sm rounded-xl bg-carbon-950 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-chrome-100">Nueva marca</h2>
              <button onClick={() => setMostrarForm(false)} className="text-chrome-400 hover:text-chrome-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Nombre</label>
                <input required className="input-field" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Logo (opcional)</label>
                <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} className="w-full text-sm text-chrome-300" />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" disabled={guardando} className="btn-primary w-full disabled:opacity-60">
                {guardando ? "Guardando..." : "Guardar marca"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
