import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Sparkles,
  SlidersHorizontal,
  Images,
  ExternalLink,
  Upload,
  Eye,
  Wrench,
  Instagram,
  Check,
  AlertCircle,
  Video,
} from "lucide-react";
import { api, cache, uploadUrl } from "../../lib/api";
import Paginacion from "../../components/admin/Paginacion.jsx";
import ModalConfirmar from "../../components/admin/ModalConfirmar.jsx";
import ModalDetalleResultado from "../../components/ModalDetalleResultado.jsx";

const ITEMS_POR_PAGINA = 6;

async function optimizarImagenSiEsGrande(file, maxAncho = 1920, calidad = 0.85) {
  if (!file || !file.type.startsWith("image/") || file.size < 1.5 * 1024 * 1024) {
    return file;
  }
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let ancho = img.width;
        let alto = img.height;

        if (ancho > maxAncho) {
          alto = Math.round((alto * maxAncho) / ancho);
          ancho = maxAncho;
        }

        const canvas = document.createElement("canvas");
        canvas.width = ancho;
        canvas.height = alto;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, ancho, alto);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const optimizado = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(optimizado);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          calidad
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

const FORM_VACIO = {
  titulo: "",
  descripcion: "",
  servicioId: "",
  redSocialUrl: "",
  orden: 0,
  activo: true,
  imagenAntesUrl: "",
  imagenDespuesUrl: "",
  imagenesExistentes: [],
};

export default function AdminResultados() {
  const [resultados, setResultados] = useState(() => cache.get("/admin_resultados") || []);
  const [servicios, setServicios] = useState(() => cache.get("/servicios_para_resultados") || []);
  const [cargando, setCargando] = useState(() => !cache.get("/admin_resultados"));
  const [pagina, setPagina] = useState(1);

  // Estado del formulario
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Archivos seleccionados localmente
  const [archivoAntes, setArchivoAntes] = useState(null);
  const [archivoDespues, setArchivoDespues] = useState(null);
  const [archivosGaleria, setArchivosGaleria] = useState([]); // array de Files
  const [previewsGaleria, setPreviewsGaleria] = useState([]); // array de objectUrls

  // Preview / Detalle modal
  const [previewResultado, setPreviewResultado] = useState(null);

  // Eliminación
  const [resultadoAEliminar, setResultadoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState("");

  const inputAntesRef = useRef(null);
  const inputDespuesRef = useRef(null);
  const inputGaleriaRef = useRef(null);

  // Paginación
  const totalPaginas = Math.ceil(resultados.length / ITEMS_POR_PAGINA) || 1;
  const paginaValida = Math.min(Math.max(1, pagina), totalPaginas);
  const resultadosPaginados = resultados.slice(
    (paginaValida - 1) * ITEMS_POR_PAGINA,
    paginaValida * ITEMS_POR_PAGINA
  );

  function cargarDatos() {
    if (!cache.get("/admin_resultados")) setCargando(true);

    Promise.all([
      api.get("/resultados?todos=true").catch(() => []),
      api.get("/servicios?todos=true").catch(() => []),
    ])
      .then(([resList, servList]) => {
        setResultados(resList);
        setServicios(servList);
        cache.set("/admin_resultados", resList);
        cache.set("/servicios_para_resultados", servList);
      })
      .catch((err) => {
        console.error("Error al cargar datos:", err);
      })
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function nuevo() {
    setForm(FORM_VACIO);
    setArchivoAntes(null);
    setArchivoDespues(null);
    setArchivosGaleria([]);
    setPreviewsGaleria([]);
    setEditandoId(null);
    setError("");
    setMostrarForm(true);
  }

  function editar(r) {
    setForm({
      titulo: r.titulo || "",
      descripcion: r.descripcion || "",
      servicioId: r.servicioId ? String(r.servicioId) : "",
      redSocialUrl: r.redSocialUrl || "",
      orden: r.orden ?? 0,
      activo: r.activo ?? true,
      imagenAntesUrl: r.imagenAntes || "",
      imagenDespuesUrl: r.imagenDespues || "",
      imagenesExistentes: Array.isArray(r.imagenes) ? [...r.imagenes] : [],
    });
    setArchivoAntes(null);
    setArchivoDespues(null);
    setArchivosGaleria([]);
    setPreviewsGaleria([]);
    setEditandoId(r.id);
    setError("");
    setMostrarForm(true);
  }

  // Manejo de cambio de servicio para autocompletar título si está vacío
  function handleServicioChange(e) {
    const sId = e.target.value;
    setForm((prev) => {
      const nuevo = { ...prev, servicioId: sId };
      if (!prev.titulo.trim() && sId) {
        const serv = servicios.find((s) => String(s.id) === String(sId));
        if (serv) {
          nuevo.titulo = serv.nombre;
        }
      }
      return nuevo;
    });
  }

  // Archivos Antes / Después
  function handleAntesChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoAntes(file);
    }
  }

  function handleDespuesChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoDespues(file);
    }
  }

  // Archivos de Galería múltiple
  function handleGaleriaChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Crear previews
    const newPreviews = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));

    setArchivosGaleria((prev) => [...prev, ...files]);
    setPreviewsGaleria((prev) => [...prev, ...newPreviews]);
  }

  function quitarArchivoGaleria(index) {
    setArchivosGaleria((prev) => prev.filter((_, i) => i !== index));
    setPreviewsGaleria((prev) => {
      const item = prev[index];
      if (item?.url) URL.revokeObjectURL(item.url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function quitarImagenExistente(index) {
    setForm((prev) => ({
      ...prev,
      imagenesExistentes: prev.imagenesExistentes.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.titulo.trim()) {
      setError("Debes ingresar un título para el trabajo.");
      return;
    }

    // Verificar que haya al menos una imagen
    const tieneAntes = Boolean(archivoAntes || form.imagenAntesUrl);
    const tieneDespues = Boolean(archivoDespues || form.imagenDespuesUrl);
    const tieneGaleria = archivosGaleria.length > 0 || form.imagenesExistentes.length > 0;

    if (!tieneAntes && !tieneDespues && !tieneGaleria) {
      setError("Debes subir al menos una imagen (comparador Antes/Después o Galería de fotos).");
      return;
    }

    setGuardando(true);
    try {
      const data = new FormData();
      data.append("titulo", form.titulo.trim());
      data.append("descripcion", form.descripcion.trim());
      data.append("servicioId", form.servicioId || "");
      data.append("redSocialUrl", form.redSocialUrl.trim());
      data.append("orden", form.orden);
      data.append("activo", form.activo);

      // Optimizar imágenes si son de alta resolución (ej. fotos de celulares de 10MB+)
      const antesParaSubir = archivoAntes ? await optimizarImagenSiEsGrande(archivoAntes) : null;
      const despuesParaSubir = archivoDespues ? await optimizarImagenSiEsGrande(archivoDespues) : null;
      const galeriaParaSubir = await Promise.all(
        archivosGaleria.map((f) => optimizarImagenSiEsGrande(f))
      );

      // Antes y Después
      if (antesParaSubir) {
        data.append("antes", antesParaSubir);
      } else {
        data.append("imagenAntes", form.imagenAntesUrl || "");
      }

      if (despuesParaSubir) {
        data.append("despues", despuesParaSubir);
      } else {
        data.append("imagenDespues", form.imagenDespuesUrl || "");
      }

      // Galería existente (la que no fue borrada)
      data.append("imagenesExistentes", JSON.stringify(form.imagenesExistentes));

      // Nuevos archivos de galería
      for (const file of galeriaParaSubir) {
        data.append("imagenes", file);
      }

      if (editandoId) {
        await api.put(`/resultados/${editandoId}`, data, { isForm: true, auth: true });
      } else {
        await api.post("/resultados", data, { isForm: true, auth: true });
      }

      cache.clear();
      setMostrarForm(false);
      cargarDatos();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al guardar el resultado.");
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminar() {
    if (!resultadoAEliminar) return;
    setEliminando(true);
    setErrorEliminar("");
    try {
      await api.del(`/resultados/${resultadoAEliminar.id}`, { auth: true });
      cache.clear();
      setResultadoAEliminar(null);
      cargarDatos();
    } catch (err) {
      setErrorEliminar(err.message || "Error al eliminar el trabajo.");
    } finally {
      setEliminando(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-chrome-100 flex items-center gap-2">
            <Sparkles className="text-electric-400" size={26} />
            Resultados / Trabajos
          </h1>
          <p className="mt-1 text-sm text-chrome-400">
            Gestioná las fotos de antes y después, galerías de detalles y links a videos en redes sociales.
          </p>
        </div>
        <button onClick={nuevo} className="btn-primary !px-4 !py-2.5 text-sm shrink-0">
          <Plus size={18} /> Subir nuevo resultado
        </button>
      </div>

      {/* Listado o Skeletons */}
      {cargando && resultados.length === 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card h-72 animate-pulse rounded-2xl bg-carbon-900/40 p-4" />
          ))}
        </div>
      ) : resultados.length === 0 ? (
        <div className="glass-card rounded-2xl border border-dashed border-carbon-800 p-12 text-center">
          <Sparkles className="mx-auto text-electric-400" size={36} />
          <h3 className="mt-4 font-display text-lg font-bold text-chrome-100">
            Aún no has subido resultados
          </h3>
          <p className="mt-1 text-sm text-chrome-400">
            Mostrá el antes y después de tus lavados y detailing para atraer más clientes.
          </p>
          <button onClick={nuevo} className="btn-primary mx-auto mt-5 !px-4 !py-2 text-sm">
            <Plus size={18} /> Subir primer trabajo
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                  className="glass-card group flex flex-col justify-between overflow-hidden rounded-2xl border border-carbon-800 bg-carbon-900/40 transition-all duration-300 hover:border-electric-500/40 hover:bg-carbon-900/80 hover:shadow-neon"
                >
                  {/* Imagen de Portada con Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-carbon-950">
                    {portada ? (
                      <img
                        src={uploadUrl(portada)}
                        alt={r.titulo}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-chrome-500">
                        <Images size={32} />
                      </div>
                    )}

                    {/* Overlay oscurecido en la parte superior */}
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-black/60 pointer-events-none" />

                    {/* Badges superiores */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {r.activo ? (
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 backdrop-blur-md">
                          Visible
                        </span>
                      ) : (
                        <span className="rounded-full bg-carbon-800/80 border border-carbon-700 px-2.5 py-0.5 text-[11px] font-semibold text-chrome-400 backdrop-blur-md">
                          Oculto
                        </span>
                      )}

                      {tieneAD && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-electric-500/20 border border-electric-500/40 px-2 py-0.5 text-[11px] font-bold text-electric-300 backdrop-blur-md">
                          <SlidersHorizontal size={11} /> Antes/Después
                        </span>
                      )}

                      {cantGaleria > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[11px] font-bold text-purple-300 backdrop-blur-md">
                          <Images size={11} /> +{cantGaleria} fotos
                        </span>
                      )}
                    </div>

                    {/* Botón de Red Social si tiene */}
                    {r.redSocialUrl && (
                      <a
                        href={r.redSocialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-electric-500 hover:text-black transition-colors"
                        title="Ver video en red social"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Video size={14} />
                      </a>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      {r.servicio && (
                        <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-electric-400">
                          <Wrench size={12} />
                          {r.servicio.nombre}
                        </div>
                      )}
                      <h3 className="font-display text-base font-bold text-chrome-100 line-clamp-1">
                        {r.titulo}
                      </h3>
                      {r.descripcion && (
                        <p className="mt-1 line-clamp-2 text-xs text-chrome-400">
                          {r.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="mt-4 flex items-center justify-between border-t border-carbon-800/80 pt-3">
                      <button
                        type="button"
                        onClick={() => setPreviewResultado(r)}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-electric-300 hover:bg-electric-500/10 hover:text-electric-200 transition-colors"
                      >
                        <Eye size={14} /> Vista previa
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => editar(r)}
                          className="rounded-lg p-2 text-chrome-400 hover:bg-carbon-800 hover:text-white transition-colors"
                          title="Editar resultado"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setResultadoAEliminar(r)}
                          className="rounded-lg p-2 text-chrome-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          title="Eliminar resultado"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Paginacion
            paginaActual={paginaValida}
            totalPaginas={totalPaginas}
            totalItems={resultados.length}
            itemsPorPagina={ITEMS_POR_PAGINA}
            onCambiarPagina={setPagina}
          />
        </>
      )}

      {/* Modal de Crear / Editar Trabajo */}
      {mostrarForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-sm overflow-y-auto"
          onClick={() => !guardando && setMostrarForm(false)}
        >
          <div
            className="relative my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-carbon-800 bg-carbon-950 p-5 sm:p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between border-b border-carbon-800 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="text-electric-400" size={20} />
                  {editandoId ? "Editar resultado" : "Nuevo resultado de trabajo"}
                </h2>
                <p className="mt-0.5 text-xs text-chrome-400">
                  Subí las fotos para mostrar a tus clientes la calidad de tu trabajo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !guardando && setMostrarForm(false)}
                className="rounded-lg p-1.5 text-chrome-400 hover:bg-carbon-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle size={16} className="shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* Servicio Asociado (Select) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chrome-300">
                  Servicio realizado (automático o personalizado)
                </label>
                <div className="mt-1.5 relative">
                  <select
                    value={form.servicioId}
                    onChange={handleServicioChange}
                    className="w-full rounded-xl border border-carbon-800 bg-carbon-900 px-3.5 py-2.5 text-sm text-chrome-100 focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                  >
                    <option value="">-- Sin servicio específico / Personalizado --</option>
                    {servicios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre} ({s.tipoVehiculo})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-[11px] text-chrome-500">
                  Al elegir un servicio, el título y los datos se vincularán automáticamente.
                </p>
              </div>

              {/* Título del Trabajo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chrome-300">
                  Título del trabajo <span className="text-electric-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lavado Premium + Abrillantado en Toyota Hilux"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-carbon-800 bg-carbon-900 px-3.5 py-2.5 text-sm text-chrome-100 placeholder:text-chrome-600 focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chrome-300">
                  Descripción o detalles del trabajo
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Se realizó descontaminado de pintura, corrección de barniz y sellado cerámico de 1 año."
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-carbon-800 bg-carbon-900 px-3.5 py-2.5 text-sm text-chrome-100 placeholder:text-chrome-600 focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                />
              </div>

              {/* Link a Red Social (Instagram / Facebook / TikTok) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chrome-300">
                  Link a video en Red Social (Opcional)
                </label>
                <div className="mt-1.5 relative flex items-center">
                  <span className="absolute left-3 text-chrome-500 pointer-events-none">
                    <Video size={16} />
                  </span>
                  <input
                    type="url"
                    placeholder="https://www.instagram.com/reel/... o facebook.com/..."
                    value={form.redSocialUrl}
                    onChange={(e) => setForm({ ...form, redSocialUrl: e.target.value })}
                    className="w-full rounded-xl border border-carbon-800 bg-carbon-900 pl-9 pr-3.5 py-2.5 text-sm text-chrome-100 placeholder:text-chrome-600 focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                  />
                </div>
                <p className="mt-1 text-[11px] text-chrome-500">
                  Pegá el enlace a Instagram Reels, TikTok o Facebook para que los clientes puedan ver el video del proceso.
                </p>
              </div>

              {/* SECCIÓN 1: Comparador Antes y Después */}
              <div className="rounded-xl border border-carbon-800 bg-carbon-900/40 p-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-electric-400" />
                  <h3 className="font-display text-sm font-bold text-white">
                    Comparador Antes y Después (Barra interactiva)
                  </h3>
                </div>
                <p className="mt-1 text-xs text-chrome-400">
                  Subí la foto del estado inicial y la del resultado final para generar el efecto de deslizado interactivo.
                </p>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* FOTO ANTES */}
                  <div className="rounded-lg border border-carbon-800 bg-carbon-950 p-3">
                    <span className="block text-xs font-bold uppercase text-chrome-300 mb-2">
                      Foto ANTES (Inicial)
                    </span>
                    <input
                      ref={inputAntesRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAntesChange}
                      className="hidden"
                    />

                    {archivoAntes ? (
                      <div className="relative h-28 w-full rounded-lg overflow-hidden border border-carbon-700">
                        <img
                          src={URL.createObjectURL(archivoAntes)}
                          alt="Preview antes"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setArchivoAntes(null)}
                          className="absolute top-1 right-1 rounded-md bg-black/70 p-1 text-white hover:bg-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : form.imagenAntesUrl ? (
                      <div className="relative h-28 w-full rounded-lg overflow-hidden border border-carbon-700">
                        <img
                          src={uploadUrl(form.imagenAntesUrl)}
                          alt="Antes guardada"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, imagenAntesUrl: "" })}
                          className="absolute top-1 right-1 rounded-md bg-black/70 p-1 text-white hover:bg-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => inputAntesRef.current?.click()}
                        className="flex h-28 w-full flex-col items-center justify-center rounded-lg border border-dashed border-carbon-700 bg-carbon-900/60 text-chrome-400 hover:border-electric-400 hover:text-electric-300 transition-colors"
                      >
                        <Upload size={20} />
                        <span className="mt-1 text-xs font-medium">Seleccionar foto Antes</span>
                      </button>
                    )}
                  </div>

                  {/* FOTO DESPUÉS */}
                  <div className="rounded-lg border border-carbon-800 bg-carbon-950 p-3">
                    <span className="block text-xs font-bold uppercase text-chrome-300 mb-2">
                      Foto DESPUÉS (Final)
                    </span>
                    <input
                      ref={inputDespuesRef}
                      type="file"
                      accept="image/*"
                      onChange={handleDespuesChange}
                      className="hidden"
                    />

                    {archivoDespues ? (
                      <div className="relative h-28 w-full rounded-lg overflow-hidden border border-carbon-700">
                        <img
                          src={URL.createObjectURL(archivoDespues)}
                          alt="Preview después"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setArchivoDespues(null)}
                          className="absolute top-1 right-1 rounded-md bg-black/70 p-1 text-white hover:bg-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : form.imagenDespuesUrl ? (
                      <div className="relative h-28 w-full rounded-lg overflow-hidden border border-carbon-700">
                        <img
                          src={uploadUrl(form.imagenDespuesUrl)}
                          alt="Después guardada"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, imagenDespuesUrl: "" })}
                          className="absolute top-1 right-1 rounded-md bg-black/70 p-1 text-white hover:bg-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => inputDespuesRef.current?.click()}
                        className="flex h-28 w-full flex-col items-center justify-center rounded-lg border border-dashed border-carbon-700 bg-carbon-900/60 text-chrome-400 hover:border-electric-400 hover:text-electric-300 transition-colors"
                      >
                        <Upload size={20} />
                        <span className="mt-1 text-xs font-medium">Seleccionar foto Después</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: Galería de Fotos Múltiples */}
              <div className="rounded-xl border border-carbon-800 bg-carbon-900/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Images size={16} className="text-purple-400" />
                    <h3 className="font-display text-sm font-bold text-white">
                      Galería de fotos del servicio (Múltiples fotos)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => inputGaleriaRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300 hover:bg-purple-500/20"
                  >
                    <Plus size={14} /> Agregar fotos
                  </button>
                </div>
                <p className="mt-1 text-xs text-chrome-400">
                  Podés subir varias fotos en alta resolución (exterior, interior, llantas, ópticas, motor). Se mostrarán con selector lateral estilo concesionario.
                </p>

                <input
                  ref={inputGaleriaRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGaleriaChange}
                  className="hidden"
                />

                {/* Previews de la galería */}
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {/* Existentes en el servidor */}
                  {form.imagenesExistentes.map((imgUrl, idx) => (
                    <div
                      key={`existente-${idx}`}
                      className="group relative h-20 rounded-lg overflow-hidden border border-carbon-700 bg-carbon-950"
                    >
                      <img
                        src={uploadUrl(imgUrl)}
                        alt={`Existente ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => quitarImagenExistente(idx)}
                        className="absolute top-1 right-1 rounded-md bg-black/80 p-1 text-white hover:bg-red-500 transition-colors"
                        title="Eliminar de la galería"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Nuevas por subir */}
                  {previewsGaleria.map((p, idx) => (
                    <div
                      key={`nueva-${idx}`}
                      className="group relative h-20 rounded-lg overflow-hidden border border-electric-500/50 bg-carbon-950"
                    >
                      <img
                        src={p.url}
                        alt={`Nueva ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 rounded bg-electric-500/80 px-1 py-0.2 text-[9px] font-bold text-black">
                        Nueva
                      </span>
                      <button
                        type="button"
                        onClick={() => quitarArchivoGaleria(idx)}
                        className="absolute top-1 right-1 rounded-md bg-black/80 p-1 text-white hover:bg-red-500 transition-colors"
                        title="Quitar"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Botón rápido para sumar más */}
                  <button
                    type="button"
                    onClick={() => inputGaleriaRef.current?.click()}
                    className="flex h-20 flex-col items-center justify-center rounded-lg border border-dashed border-carbon-700 bg-carbon-900/50 text-chrome-400 hover:border-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Upload size={18} />
                    <span className="mt-1 text-[11px] font-medium">+ Fotos</span>
                  </button>
                </div>
              </div>

              {/* Orden y Visibilidad */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-carbon-800 pt-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold uppercase text-chrome-300">Orden:</label>
                  <input
                    type="number"
                    value={form.orden}
                    onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
                    className="w-20 rounded-lg border border-carbon-800 bg-carbon-900 px-2.5 py-1 text-sm text-chrome-100"
                  />
                  <span className="text-[11px] text-chrome-500">(0 aparece primero)</span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-chrome-200">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    className="h-4 w-4 rounded border-carbon-700 bg-carbon-900 text-electric-500 focus:ring-electric-400"
                  />
                  Visible en la página web pública
                </label>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={guardando}
                  onClick={() => setMostrarForm(false)}
                  className="rounded-xl border border-carbon-800 px-4 py-2 text-sm font-semibold text-chrome-400 hover:bg-carbon-800 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="btn-primary !px-5 !py-2 text-sm"
                >
                  {guardando ? "Subiendo a Cloudinary..." : editandoId ? "Guardar cambios" : "Publicar resultado"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <ModalConfirmar
        abierto={Boolean(resultadoAEliminar)}
        titulo="¿Eliminar este resultado?"
        mensaje={`¿Estás seguro de que querés eliminar "${resultadoAEliminar?.titulo}"? Esta acción no se puede deshacer.`}
        cargando={eliminando}
        error={errorEliminar}
        onConfirmar={confirmarEliminar}
        onCancelar={() => {
          setResultadoAEliminar(null);
          setErrorEliminar("");
        }}
      />

      {/* Modal de Vista Previa idéntico al de la web de clientes */}
      {previewResultado && (
        <ModalDetalleResultado
          resultado={previewResultado}
          onClose={() => setPreviewResultado(null)}
        />
      )}
    </div>
  );
}
