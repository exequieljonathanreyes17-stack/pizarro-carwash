import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { api, cache, uploadUrl } from "../../lib/api";
import { SkeletonProductos } from "../../components/admin/AdminSkeletons.jsx";
import Paginacion from "../../components/admin/Paginacion.jsx";
import ModalConfirmar from "../../components/admin/ModalConfirmar.jsx";

const ITEMS_POR_PAGINA = 6;

const VACIO = { nombre: "", descripcion: "", precio: "", categoria: "Auto", destacado: false, activo: true };

export default function AdminProductos() {
  const [productos, setProductos] = useState(() => cache.get("/productos") || []);
  const [cargando, setCargando] = useState(() => !cache.get("/productos"));
  const [pagina, setPagina] = useState(1);
  const [form, setForm] = useState(VACIO);
  const [imagen, setImagen] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const totalPaginas = Math.ceil(productos.length / ITEMS_POR_PAGINA) || 1;
  const paginaValida = Math.min(Math.max(1, pagina), totalPaginas);
  const productosPaginados = productos.slice(
    (paginaValida - 1) * ITEMS_POR_PAGINA,
    paginaValida * ITEMS_POR_PAGINA
  );

  function cargar() {
    if (!cache.get("/productos")) setCargando(true);
    api.get("/productos?todos=true")
      .then((data) => {
        setProductos(data);
        cache.set("/productos", data);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }

  useEffect(cargar, []);

  function nuevoProducto() {
    setForm(VACIO);
    setImagen(null);
    setEditandoId(null);
    setMostrarForm(true);
  }

  function editarProducto(p) {
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      categoria: p.categoria,
      destacado: p.destacado,
      activo: p.activo,
    });
    setImagen(null);
    setEditandoId(p.id);
    setMostrarForm(true);
  }

  async function confirmarEliminarProducto() {
    if (!productoAEliminar) return;
    setEliminando(true);
    try {
      await api.del(`/productos/${productoAEliminar.id}`, { auth: true });
      cargar();
      setProductoAEliminar(null);
    } catch (err) {
      setError(err.message || "Error al eliminar producto");
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
    data.append("precio", form.precio);
    data.append("categoria", form.categoria);
    data.append("destacado", form.destacado);
    data.append("activo", form.activo);
    if (imagen) data.append("imagen", imagen);

    try {
      if (editandoId) {
        await api.put(`/productos/${editandoId}`, data, { isForm: true, auth: true });
      } else {
        await api.post("/productos", data, { isForm: true, auth: true });
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
        <h1 className="font-display text-2xl font-bold text-chrome-100">Productos</h1>
        <button onClick={nuevoProducto} className="btn-primary !px-4 !py-2 text-sm">
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-electric-500/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-carbon-900/80 text-xs uppercase tracking-wide text-chrome-400">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          {cargando && productos.length === 0 ? (
            <SkeletonProductos />
          ) : (
            <tbody>
              {productosPaginados.map((p) => (
                <tr key={p.id} className="border-t border-electric-500/10">
                  <td className="flex items-center gap-3 px-4 py-3">
                    {p.imagenUrl && (
                      <img src={uploadUrl(p.imagenUrl)} alt={p.nombre} className="h-10 w-10 rounded object-cover" />
                    )}
                    <span className="font-semibold text-chrome-100">{p.nombre}</span>
                    {p.destacado && (
                      <span className="rounded-full bg-electric-500/15 px-2 py-0.5 text-[10px] text-electric-400">
                        Destacado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-chrome-300">{p.categoria}</td>
                  <td className="px-4 py-3 text-chrome-300">${Number(p.precio).toLocaleString("es-AR")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${p.activo ? "text-electric-400" : "text-chrome-400"}`}>
                      {p.activo ? "Activo" : "Oculto"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => editarProducto(p)} className="mr-3 text-chrome-300 hover:text-electric-400">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setProductoAEliminar(p)} className="text-chrome-300 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-chrome-400">
                    Todavía no cargaste productos.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      <Paginacion
        paginaActual={paginaValida}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPagina}
        totalItems={productos.length}
        itemsPorPagina={ITEMS_POR_PAGINA}
      />

      {mostrarForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass-card w-full max-w-lg rounded-xl bg-carbon-950 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-chrome-100">
                {editandoId ? "Editar producto" : "Nuevo producto"}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Precio</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Categoría</label>
                  <select
                    required
                    className="input-field"
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  >
                    <option value="Auto">Auto</option>
                    <option value="Moto">Moto</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Auto y moto">Auto y moto</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Imagen</label>
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
                    checked={form.destacado}
                    onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                  />
                  Destacado
                </label>
                <label className="flex items-center gap-2 text-sm text-chrome-300">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  />
                  Visible en la web
                </label>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" disabled={guardando} className="btn-primary w-full disabled:opacity-60">
                {guardando ? "Guardando..." : "Guardar producto"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar producto */}
      <ModalConfirmar
        abierto={!!productoAEliminar}
        onCerrar={() => setProductoAEliminar(null)}
        onConfirmar={confirmarEliminarProducto}
        titulo="¿Eliminar producto?"
        mensaje="¿Estás seguro de que deseas eliminar este producto? Se borrará de la lista."
        nombreItem={productoAEliminar?.nombre}
        cargando={eliminando}
      />
    </div>
  );
}
