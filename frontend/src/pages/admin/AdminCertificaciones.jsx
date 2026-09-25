import { useEffect, useState } from "react";
import { Plus, Trash2, X, Award } from "lucide-react";
import { api, uploadUrl } from "../../lib/api";

const VACIO = { nombreEmpleado: "", titulo: "", institucion: "", descripcion: "" };

export default function AdminCertificaciones() {
  const [certificaciones, setCertificaciones] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [imagen, setImagen] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function cargar() {
    api.get("/certificaciones?todos=true").then(setCertificaciones).catch(() => {});
  }
  useEffect(cargar, []);

  async function eliminar(id) {
    if (!confirm("¿Eliminar esta certificación?")) return;
    await api.del(`/certificaciones/${id}`, { auth: true });
    cargar();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setGuardando(true);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (imagen) data.append("imagen", imagen);

    try {
      await api.post("/certificaciones", data, { isForm: true, auth: true });
      setMostrarForm(false);
      setForm(VACIO);
      setImagen(null);
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
        <h1 className="font-display text-2xl font-bold text-chrome-100">Certificaciones</h1>
        <button onClick={() => setMostrarForm(true)} className="btn-primary !px-4 !py-2 text-sm">
          <Plus size={18} /> Nueva certificación
        </button>
      </div>
      <p className="mt-2 text-sm text-chrome-400">
        Mostrá acá las capacitaciones y certificados de pulido/detailing de tu equipo.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {certificaciones.map((c) => (
          <div key={c.id} className="glass-card flex gap-4 rounded-xl p-4">
            <div className="flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-lg bg-electric-500/10 text-electric-400">
              {c.imagenUrl ? (
                <img src={uploadUrl(c.imagenUrl)} alt={c.titulo} className="h-full w-full object-cover" />
              ) : (
                <Award size={24} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-chrome-100">{c.titulo}</h3>
              <p className="text-xs text-chrome-400">{c.nombreEmpleado}</p>
              {c.institucion && <p className="text-xs text-chrome-400">{c.institucion}</p>}
            </div>
            <button onClick={() => eliminar(c.id)} className="text-chrome-300 hover:text-red-400">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {certificaciones.length === 0 && <p className="text-chrome-400">Todavía no cargaste certificaciones.</p>}
      </div>

      {mostrarForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass-card w-full max-w-lg rounded-xl bg-carbon-950 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-chrome-100">Nueva certificación</h2>
              <button onClick={() => setMostrarForm(false)} className="text-chrome-400 hover:text-chrome-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">
                  Nombre del empleado
                </label>
                <input
                  required
                  className="input-field"
                  value={form.nombreEmpleado}
                  onChange={(e) => setForm({ ...form, nombreEmpleado: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">
                  Título de la capacitación
                </label>
                <input
                  required
                  className="input-field"
                  placeholder="Ej: Capacitación en Pulido y Detailing"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">
                  Institución (opcional)
                </label>
                <input
                  className="input-field"
                  value={form.institucion}
                  onChange={(e) => setForm({ ...form, institucion: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">
                  Descripción (opcional)
                </label>
                <textarea
                  rows={2}
                  className="input-field resize-none"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">
                  Foto del certificado (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagen(e.target.files[0])}
                  className="w-full text-sm text-chrome-300"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" disabled={guardando} className="btn-primary w-full disabled:opacity-60">
                {guardando ? "Guardando..." : "Guardar certificación"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
