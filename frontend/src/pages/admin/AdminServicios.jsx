import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Clock, Sparkles, Check, Wrench } from "lucide-react";
import { api, cache, uploadUrl } from "../../lib/api";
import { SkeletonServicios } from "../../components/admin/AdminSkeletons.jsx";
import Paginacion from "../../components/admin/Paginacion.jsx";
import ModalConfirmar from "../../components/admin/ModalConfirmar.jsx";

const ITEMS_POR_PAGINA = 6;

const VACIO = {
  nombre: "",
  descripcion: "",
  incluye: "",
  duracion: "",
  tipoVehiculo: "AMBOS",
  precioDesde: "",
  icono: "sparkles",
  orden: 0,
  activo: true,
  masVendido: false,
};

const ICONOS_DISPONIBLES = ["droplets", "sparkles", "car-front", "sofa", "star", "lightbulb"];

export default function AdminServicios() {
  const [servicios, setServicios] = useState(() => cache.get("/servicios") || []);
  const [cargando, setCargando] = useState(() => !cache.get("/servicios"));
  const [pagina, setPagina] = useState(1);
  const [form, setForm] = useState(VACIO);
  const [imagen, setImagen] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState("");

  const totalPaginas = Math.ceil(servicios.length / ITEMS_POR_PAGINA) || 1;
  const paginaValida = Math.min(Math.max(1, pagina), totalPaginas);
  const serviciosPaginados = servicios.slice(
    (paginaValida - 1) * ITEMS_POR_PAGINA,
    paginaValida * ITEMS_POR_PAGINA
  );

  function cargar() {
    if (!cache.get("/servicios")) setCargando(true);
    api.get("/servicios?todos=true")
      .then((data) => {
        setServicios(data);
        cache.set("/servicios", data);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }
  useEffect(cargar, []);

  function nuevo() {
    setForm(VACIO);
    setImagen(null);
    setEditandoId(null);
    setMostrarForm(true);
  }

  function editar(s) {
    setForm({
      nombre: s.nombre,
      descripcion: s.descripcion,
      incluye: s.incluye || "",
      duracion: s.duracion || "",
      tipoVehiculo: s.tipoVehiculo,
      precioDesde: s.precioDesde || "",
      icono: s.icono || "sparkles",
      orden: s.orden,
      activo: s.activo,
      masVendido: s.masVendido,
    });
    setImagen(null);
    setEditandoId(s.id);
    setMostrarForm(true);
  }

  async function confirmarEliminar() {
    if (!servicioAEliminar) return;
    setEliminando(true);
    setErrorEliminar("");
    try {
      await api.del(`/servicios/${servicioAEliminar.id}`, { auth: true });
      setServicios((prev) => prev.filter((s) => s.id !== servicioAEliminar.id));
      setServicioAEliminar(null);
      cargar();
    } catch (err) {
      setErrorEliminar(err.message || "Error al eliminar servicio");
    } finally {
      setEliminando(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setGuardando(true);

    const data = new FormData();
    data.append("nombre", form.nombre);
    data.append("descripcion", form.descripcion);
    data.append("incluye", form.incluye);
    data.append("duracion", form.duracion);
    data.append("tipoVehiculo", form.tipoVehiculo);
    data.append("precioDesde", form.precioDesde);
    data.append("icono", form.icono);
    data.append("orden", form.orden);
    data.append("activo", form.activo);
    data.append("masVendido", form.masVendido);
    if (imagen) data.append("imagen", imagen);

    try {
      if (editandoId) {
        await api.put(`/servicios/${editandoId}`, data, { isForm: true, auth: true });
      } else {
        await api.post("/servicios", data, { isForm: true, auth: true });
      }
      setMostrarForm(false);
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
        <h1 className="font-display text-2xl font-bold text-chrome-100">Servicios</h1>
        <button onClick={nuevo} className="btn-primary !px-4 !py-2 text-sm">
          <Plus size={18} /> Nuevo servicio
        </button>
      </div>

      <div className="mt-6">
        {cargando && servicios.length === 0 ? (
          <SkeletonServicios />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {serviciosPaginados.map((s) => (
                <div
                  key={s.id}
                  className="glass-card group flex flex-col justify-between rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5 transition-all duration-300 hover:border-electric-500/40 hover:bg-carbon-900/80 hover:shadow-[0_0_25px_rgba(34,211,238,0.08)]"
                >
                  <div>
                    <div className="flex gap-4">
                      {/* Miniatura visual */}
                      <div className="relative h-20 w-20 flex-none overflow-hidden rounded-xl border border-carbon-800 bg-carbon-950/80">
                        {s.imagenUrl ? (
                          <img
                            src={uploadUrl(s.imagenUrl)}
                            alt={s.nombre}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-electric-400/80">
                            <Wrench size={26} />
                          </div>
                        )}
                      </div>

                      {/* Info del servicio */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          {s.masVendido && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                              <Sparkles size={10} />
                              Más vendido
                            </span>
                          )}
                          <span className="inline-flex items-center rounded-full border border-electric-500/20 bg-electric-500/10 px-2 py-0.5 text-[10px] font-semibold text-electric-300">
                            {s.tipoVehiculo}
                          </span>
                          {s.duracion && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-carbon-700 bg-carbon-800/80 px-2 py-0.5 text-[10px] text-chrome-300">
                              <Clock size={10} className="text-electric-400" />
                              {s.duracion}
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-base font-bold text-chrome-100 truncate group-hover:text-electric-300 transition-colors">
                          {s.nombre}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs text-chrome-300 leading-relaxed">
                          {s.descripcion}
                        </p>
                      </div>
                    </div>

                    {/* Qué incluye (si tiene ítems) */}
                    {s.incluye && (
                      <div className="mt-3.5 border-t border-carbon-800/60 pt-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          {s.incluye
                            .split("\n")
                            .filter((item) => item.trim())
                            .slice(0, 3)
                            .map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-md bg-carbon-950/70 border border-carbon-800 px-2 py-0.5 text-[11px] text-chrome-300"
                              >
                                <Check size={10} className="text-electric-400 shrink-0" />
                                <span className="truncate max-w-[130px]">{item.trim()}</span>
                              </span>
                            ))}
                          {s.incluye.split("\n").filter((i) => i.trim()).length > 3 && (
                            <span className="rounded-md bg-carbon-950/70 border border-carbon-800 px-1.5 py-0.5 text-[10px] text-chrome-400">
                              +{s.incluye.split("\n").filter((i) => i.trim()).length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pie de la tarjeta: Precio y Acciones */}
                  <div className="mt-4 flex items-center justify-between border-t border-carbon-800/70 pt-3">
                    <div>
                      {s.precioDesde ? (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-chrome-400 tracking-wider">Desde</span>
                          <p className="font-display text-lg font-bold text-electric-400">
                            ${Number(s.precioDesde).toLocaleString("es-AR")}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-chrome-400 italic">Consultar precio</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => editar(s)}
                        title="Editar servicio"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-carbon-700 bg-carbon-800/60 text-chrome-300 transition-all hover:border-electric-500/50 hover:bg-electric-500/10 hover:text-electric-400 active:scale-95"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setErrorEliminar("");
                          setServicioAEliminar(s);
                        }}
                        title="Eliminar servicio"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-carbon-700 bg-carbon-800/60 text-chrome-300 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {servicios.length === 0 && (
                <p className="text-chrome-400">Todavía no cargaste servicios.</p>
              )}
            </div>

            <Paginacion
              paginaActual={paginaValida}
              totalPaginas={totalPaginas}
              onCambiarPagina={setPagina}
              totalItems={servicios.length}
              itemsPorPagina={ITEMS_POR_PAGINA}
            />
          </>
        )}
      </div>

      {mostrarForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass-card w-full max-w-lg rounded-xl bg-carbon-950 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-chrome-100">
                {editandoId ? "Editar servicio" : "Nuevo servicio"}
              </h2>
              <button onClick={() => setMostrarForm(false)} className="text-chrome-400 hover:text-chrome-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Nombre</label>
                <input
                  required
                  className="input-field"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Descripción</label>
                <textarea
                  required
                  rows={3}
                  className="input-field resize-none"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Qué incluye (un ítem por línea)</label>
                <textarea
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Lavado exterior&#10;Aspirado profundo..."
                  value={form.incluye}
                  onChange={(e) => setForm({ ...form, incluye: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Vehículo</label>
                  <select
                    className="input-field"
                    value={form.tipoVehiculo}
                    onChange={(e) => setForm({ ...form, tipoVehiculo: e.target.value })}
                  >
                    <option value="AMBOS">Autos y motos</option>
                    <option value="AUTO">Solo autos</option>
                    <option value="MOTO">Solo motos</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">
                    Precio desde (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={form.precioDesde}
                    onChange={(e) => setForm({ ...form, precioDesde: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Duración estimada</label>
                  <input
                    className="input-field"
                    placeholder="Ej: 30 a 45 minutos"
                    value={form.duracion}
                    onChange={(e) => setForm({ ...form, duracion: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Ícono</label>
                  <select
                    className="input-field"
                    value={form.icono}
                    onChange={(e) => setForm({ ...form, icono: e.target.value })}
                  >
                    {ICONOS_DISPONIBLES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Orden</label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.orden}
                    onChange={(e) => setForm({ ...form, orden: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Imagen (opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagen(e.target.files[0])}
                  className="w-full text-sm text-chrome-300"
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-chrome-300">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  />
                  Visible en la web
                </label>
                <label className="flex items-center gap-2 text-sm text-chrome-300">
                  <input
                    type="checkbox"
                    checked={form.masVendido}
                    onChange={(e) => setForm({ ...form, masVendido: e.target.checked })}
                  />
                  Marcar como más vendido
                </label>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" disabled={guardando} className="btn-primary w-full disabled:opacity-60">
                {guardando ? "Guardando..." : "Guardar servicio"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <ModalConfirmar
        abierto={!!servicioAEliminar}
        onCerrar={() => {
          setServicioAEliminar(null);
          setErrorEliminar("");
        }}
        onConfirmar={confirmarEliminar}
        titulo="¿Eliminar servicio?"
        mensaje="¿Estás seguro de que deseas eliminar este servicio? Ya no aparecerá en la web pública ni en el panel."
        nombreItem={servicioAEliminar?.nombre}
        cargando={eliminando}
        error={errorEliminar}
      />
    </div>
  );
}
