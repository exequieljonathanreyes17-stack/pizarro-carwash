import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Award, Upload } from "lucide-react";
import { api, cache, uploadUrl } from "../../lib/api";
import { optimizarImagenParaWeb } from "../../lib/imageOptimizer";
import { SkeletonCards } from "../../components/admin/AdminSkeletons.jsx";
import ModalConfirmar from "../../components/admin/ModalConfirmar.jsx";

const VACIO = {
  nombreEmpleado: "",
  titulo: "",
  institucion: "",
  descripcion: "",
  orden: 0,
  activo: true,
  imagenUrl: "",
};

export default function AdminCertificaciones() {
  const [certificaciones, setCertificaciones] = useState(() => cache.get("/certificaciones") || []);
  const [cargando, setCargando] = useState(() => !cache.get("/certificaciones"));
  const [form, setForm] = useState(VACIO);
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [certificacionAEliminar, setCertificacionAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState("");

  function cargar() {
    if (!cache.get("/certificaciones")) setCargando(true);
    api.get("/certificaciones?todos=true")
      .then((data) => {
        setCertificaciones(data);
        cache.set("/certificaciones", data);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }
  useEffect(cargar, []);

  function nueva() {
    setForm(VACIO);
    setImagen(null);
    setPreviewImagen(null);
    setEditandoId(null);
    setError("");
    setMostrarForm(true);
  }

  function editar(c) {
    setForm({
      nombreEmpleado: c.nombreEmpleado || "",
      titulo: c.titulo || "",
      institucion: c.institucion || "",
      descripcion: c.descripcion || "",
      orden: c.orden ?? 0,
      activo: c.activo ?? true,
      imagenUrl: c.imagenUrl || "",
    });
    setImagen(null);
    setPreviewImagen(c.imagenUrl ? uploadUrl(c.imagenUrl) : null);
    setEditandoId(c.id);
    setError("");
    setMostrarForm(true);
  }

  async function confirmarEliminar() {
    if (!certificacionAEliminar) return;
    setEliminando(true);
    setErrorEliminar("");
    try {
      await api.del(`/certificaciones/${certificacionAEliminar.id}`, { auth: true });
      setCertificaciones((prev) => prev.filter((c) => c.id !== certificacionAEliminar.id));
      setCertificacionAEliminar(null);
      cargar();
    } catch (err) {
      setErrorEliminar(err.message || "Error al eliminar certificación");
    } finally {
      setEliminando(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setGuardando(true);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        data.append(k, v);
      }
    });
    if (imagen) {
      const imgOpt = await optimizarImagenParaWeb(imagen);
      data.append("imagen", imgOpt);
    }

    try {
      if (editandoId) {
        await api.put(`/certificaciones/${editandoId}`, data, { isForm: true, auth: true });
      } else {
        await api.post("/certificaciones", data, { isForm: true, auth: true });
      }
      setMostrarForm(false);
      setForm(VACIO);
      setImagen(null);
      setPreviewImagen(null);
      setEditandoId(null);
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
        <button onClick={nueva} className="btn-primary !px-4 !py-2 text-sm">
          <Plus size={18} /> Nueva certificación
        </button>
      </div>
      <p className="mt-2 text-sm text-chrome-400">
        Mostrá acá las capacitaciones y certificados de pulido/detailing de tu equipo.
      </p>

      <div className="mt-6">
        {cargando && certificaciones.length === 0 ? (
          <SkeletonCards />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {certificaciones.map((c) => (
              <div key={c.id} className="glass-card flex items-center justify-between gap-4 rounded-xl p-4">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-lg bg-electric-500/10 text-electric-400 border border-electric-500/20">
                    {c.imagenUrl ? (
                      <img src={uploadUrl(c.imagenUrl)} alt={c.titulo} className="h-full w-full object-cover" />
                    ) : (
                      <Award size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-chrome-100 truncate">{c.titulo}</h3>
                    <p className="text-xs text-electric-400 font-medium truncate">{c.nombreEmpleado}</p>
                    {c.institucion && <p className="text-xs text-chrome-400 truncate">{c.institucion}</p>}
                    {!c.activo && (
                      <span className="mt-1 inline-block rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                        Oculto
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-none">
                  <button
                    onClick={() => editar(c)}
                    className="rounded-lg p-2 text-chrome-400 hover:bg-carbon-800 hover:text-electric-400 transition-colors"
                    title="Editar certificación"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setErrorEliminar("");
                      setCertificacionAEliminar(c);
                    }}
                    className="rounded-lg p-2 text-chrome-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    title="Eliminar certificación"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {certificaciones.length === 0 && <p className="text-chrome-400">Todavía no cargaste certificaciones.</p>}
          </div>
        )}
      </div>

      {mostrarForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg rounded-xl bg-carbon-950 p-6 border border-carbon-800 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-carbon-800 pb-3">
              <h2 className="font-display text-lg font-bold text-chrome-100 flex items-center gap-2">
                <Award className="text-electric-400" size={20} />
                {editandoId ? "Editar certificación" : "Nueva certificación"}
              </h2>
              <button
                onClick={() => setMostrarForm(false)}
                className="rounded-lg p-1 text-chrome-400 hover:bg-carbon-800 hover:text-chrome-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">
                  Nombre del empleado / profesional *
                </label>
                <input
                  required
                  className="input-field"
                  placeholder="Ej: Facundo Pizarro"
                  value={form.nombreEmpleado}
                  onChange={(e) => setForm({ ...form, nombreEmpleado: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">
                  Título de la capacitación / certificado *
                </label>
                <input
                  required
                  className="input-field"
                  placeholder="Ej: Especialista en Pulido y Sellado Cerámico"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">
                  Institución o Academia (opcional)
                </label>
                <input
                  className="input-field"
                  placeholder="Ej: Academia Nacional de Detailing"
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
                  placeholder="Breve detalle sobre las técnicas aprendidas..."
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>

              {/* Foto del certificado con previsualización */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">
                  Foto del certificado (opcional)
                </label>
                
                {previewImagen && (
                  <div className="mb-2 flex items-center gap-3 rounded-lg border border-carbon-800 bg-carbon-900/60 p-2">
                    <img
                      src={previewImagen}
                      alt="Certificado"
                      className="h-14 w-14 rounded object-cover border border-carbon-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-chrome-200 truncate">Foto actual del certificado</p>
                      <p className="text-[11px] text-chrome-500">Podés seleccionar un archivo abajo para cambiarla</p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files[0];
                    setImagen(f || null);
                    if (f) {
                      setPreviewImagen(URL.createObjectURL(f));
                    }
                  }}
                  className="w-full text-sm text-chrome-300 file:mr-3 file:rounded-lg file:border-0 file:bg-carbon-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-chrome-200 hover:file:bg-carbon-700"
                />
              </div>

              {/* Orden y Visibilidad */}
              <div className="flex items-center justify-between border-t border-carbon-800 pt-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold uppercase text-chrome-400">Orden:</label>
                  <input
                    type="number"
                    value={form.orden}
                    onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
                    className="w-16 rounded-lg border border-carbon-800 bg-carbon-900 px-2 py-1 text-sm text-chrome-100"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-chrome-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    className="rounded border-carbon-700 bg-carbon-900 text-electric-500 focus:ring-0"
                  />
                  Visible en la web
                </label>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" disabled={guardando} className="btn-primary w-full disabled:opacity-60">
                {guardando ? "Guardando..." : editandoId ? "Actualizar certificación" : "Guardar certificación"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar certificación */}
      <ModalConfirmar
        abierto={!!certificacionAEliminar}
        onCerrar={() => {
          setCertificacionAEliminar(null);
          setErrorEliminar("");
        }}
        onConfirmar={confirmarEliminar}
        titulo="¿Eliminar certificación?"
        mensaje="¿Estás seguro de que deseas eliminar este certificado? Ya no aparecerá en la web pública."
        nombreItem={certificacionAEliminar?.titulo}
        cargando={eliminando}
        error={errorEliminar}
      />
    </div>
  );
}
