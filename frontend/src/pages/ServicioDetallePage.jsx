import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MessageCircle,
  Clock,
  ArrowLeft,
  Send,
  Star,
  CheckCircle2,
  ShieldCheck,
  Car,
  Bike,
  Sparkles,
  Check,
  Award,
  Layers,
  CalendarCheck,
  User,
} from "lucide-react";
import Layout from "../components/Layout.jsx";
import AutoEjemplo from "../components/AutoEjemplo.jsx";
import Estrellas from "../components/Estrellas.jsx";
import { useServicios } from "../hooks/useDatos";
import { slugify } from "../lib/slug";
import { obtenerContenidoServicio } from "../data/serviciosContenido";
import { linkWhatsApp, mensajeConsultaServicio } from "../lib/whatsapp";
import { api, uploadUrl } from "../lib/api";

const CALIFICACION_LABELS = {
  5: "Excelente (5/5)",
  4: "Muy bueno (4/5)",
  3: "Bueno (3/5)",
  2: "Regular (2/5)",
  1: "Malo (1/5)",
};

export default function ServicioDetallePage() {
  const { slug } = useParams();
  const { servicios, cargando } = useServicios();
  const servicio = servicios.find((s) => slugify(s.nombre) === slug);

  const [resenas, setResenas] = useState([]);
  const [form, setForm] = useState({ nombreCliente: "", calificacion: 5, comentario: "" });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!servicio) return;
    api
      .get(`/servicios/${servicio.id}/resenas`)
      .then(setResenas)
      .catch(() => setResenas([]));
  }, [servicio?.id]);

  const contenido = useMemo(() => {
    if (!servicio) return null;
    return obtenerContenidoServicio(servicio.nombre);
  }, [servicio]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const nueva = await api.post(`/servicios/${servicio.id}/resenas`, form);
      setResenas((r) => [nueva, ...r]);
      setForm({ nombreCliente: "", calificacion: 5, comentario: "" });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 4500);
    } catch (err) {
      setError(err.message || "No pudimos enviar tu reseña. Probá de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (!servicio) {
    if (cargando) {
      return (
        <Layout>
          <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-32 text-center">
            <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-electric-500/20" />
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-electric-400 border-t-transparent shadow-neon" />
            </div>
            <p className="font-display text-lg font-semibold text-chrome-100">Cargando servicio...</p>
            <p className="mt-1 text-sm text-chrome-400">Preparando los detalles y especificaciones.</p>
          </div>
        </Layout>
      );
    }
    return (
      <Layout>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
          <div className="rounded-2xl border border-carbon-800 bg-carbon-900/60 p-8 shadow-xl backdrop-blur-sm sm:p-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-carbon-800 text-chrome-400">
              <Car size={28} />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Servicio no encontrado</h2>
            <p className="mt-2 text-sm text-chrome-300">
              El servicio que estás buscando no existe o fue modificado recientemente.
            </p>
            <Link to="/servicios" className="btn-primary mt-6 inline-flex">
              <ArrowLeft size={18} /> Volver a todos los servicios
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Lista de items incluidos
  const itemsIncluidos = servicio.incluye
    ? servicio.incluye.split("\n").filter(Boolean)
    : contenido?.incluye || [];

  const duracionTexto = servicio.duracion || contenido?.duracion || "A convenir según el vehículo";

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          
          {/* Barra superior de Navegación / Breadcrumbs */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-carbon-800/80 pb-4">
            <Link
              to="/servicios"
              className="group inline-flex items-center gap-2 rounded-xl border border-carbon-800 bg-carbon-900/70 px-4 py-2 text-xs font-semibold text-chrome-300 backdrop-blur-sm transition-all duration-200 hover:border-electric-500/50 hover:bg-carbon-800 hover:text-white"
            >
              <ArrowLeft size={15} className="text-electric-400 transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Volver a Servicios</span>
            </Link>

            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs text-chrome-400">
              <Link to="/" className="hover:text-electric-400 transition-colors">Inicio</Link>
              <span>/</span>
              <Link to="/servicios" className="hover:text-electric-400 transition-colors">Servicios</Link>
              <span>/</span>
              <span className="font-semibold text-electric-300 truncate max-w-[220px]">{servicio.nombre}</span>
            </nav>
          </div>

          {/* Grid Principal: Información y Showcase */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* Columna Izquierda (7 columnas en desktop): Datos, Título, Descripción y Fichas */}
            <div className="lg:col-span-7 flex flex-col">
              
              {/* Badges de Estado y Categoría */}
              <div className="flex flex-wrap items-center gap-2.5">
                {servicio.masVendido && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-electric-400/50 bg-gradient-to-r from-electric-500/20 via-electric-400/25 to-electric-600/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-electric-300 shadow-neon">
                    <Sparkles size={13} className="text-electric-300 animate-pulse" />
                    Más elegido
                  </span>
                )}

                {servicio.tipoVehiculo && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-carbon-800 bg-carbon-900/80 px-3 py-1 text-xs font-semibold text-chrome-200">
                    {servicio.tipoVehiculo === "AUTO" && <Car size={14} className="text-electric-400" />}
                    {servicio.tipoVehiculo === "MOTO" && <Bike size={14} className="text-electric-400" />}
                    {servicio.tipoVehiculo === "AMBOS" && <Layers size={14} className="text-electric-400" />}
                    <span>
                      {servicio.tipoVehiculo === "AUTO"
                        ? "Apto Autos"
                        : servicio.tipoVehiculo === "MOTO"
                        ? "Apto Motos"
                        : "Autos y Motos"}
                    </span>
                  </span>
                )}
              </div>

              {/* Título Principal */}
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {servicio.nombre}
              </h1>

              {/* Calificación y Reseñas */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg border border-carbon-800 bg-carbon-900/60 px-3 py-1.5">
                  <Estrellas valor={servicio.ratingPromedio || 5} tamano={15} />
                  <span className="text-xs font-bold text-electric-400">
                    {servicio.ratingPromedio ? Number(servicio.ratingPromedio).toFixed(1) : "5.0"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("seccion-resenas");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs font-medium text-chrome-400 underline-offset-4 hover:text-electric-400 hover:underline transition-colors"
                >
                  {servicio.totalResenas > 0
                    ? `Ver ${servicio.totalResenas} reseña${servicio.totalResenas === 1 ? "" : "s"}`
                    : "Sé el primero en calificar"}
                </button>
              </div>

              {/* Descripción */}
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-chrome-200 font-normal">
                {servicio.descripcion}
              </p>

              {/* Fichas rápidas de especificaciones del servicio */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="rounded-xl border border-carbon-800 bg-carbon-900/50 p-4 transition-colors hover:border-carbon-700">
                  <div className="flex items-center gap-2.5 text-electric-400">
                    <Clock size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider text-chrome-400">Duración</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">{duracionTexto}</p>
                </div>

                <div className="rounded-xl border border-carbon-800 bg-carbon-900/50 p-4 transition-colors hover:border-carbon-700">
                  <div className="flex items-center gap-2.5 text-electric-400">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider text-chrome-400">Garantía</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">Cuidado sin rayones</p>
                </div>

                <div className="rounded-xl border border-carbon-800 bg-carbon-900/50 p-4 transition-colors hover:border-carbon-700">
                  <div className="flex items-center gap-2.5 text-electric-400">
                    <Award size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider text-chrome-400">Calidad</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">Insumos Premium</p>
                </div>
              </div>

              {/* Resumen de Inversión y Botón de WhatsApp para Mobile/Tablet */}
              <div className="mt-8 block lg:hidden rounded-2xl border border-electric-500/20 bg-carbon-900/80 p-5 backdrop-blur-md">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-chrome-400">Inversión</span>
                    {servicio.precioDesde ? (
                      <p className="font-display text-2xl font-bold text-electric-400">
                        <span className="text-sm font-normal text-chrome-300">Desde </span>
                        ${Number(servicio.precioDesde).toLocaleString("es-AR")}
                      </p>
                    ) : (
                      <p className="font-display text-xl font-bold text-electric-400">A convenir / Consultar</p>
                    )}
                  </div>
                  <span className="rounded-full bg-electric-500/10 px-2.5 py-1 text-xs font-medium text-electric-400">
                    Turnos programados
                  </span>
                </div>

                <a
                  href={linkWhatsApp(mensajeConsultaServicio(servicio))}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-4 w-full text-center"
                >
                  <MessageCircle size={18} /> Consultar por WhatsApp
                </a>
              </div>
            </div>

            {/* Columna Derecha (5 columnas en desktop): Showcase Visual + Tarjeta de Acción */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative overflow-hidden rounded-2xl border border-electric-500/25 bg-gradient-to-b from-carbon-900/95 to-carbon-950/95 p-5 shadow-2xl backdrop-blur-xl">
                
                {/* Resplandor decorativo de fondo */}
                <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-electric-500/15 blur-3xl" />
                
                {/* Contenedor de la Imagen con ajuste profesional */}
                <div className="relative flex min-h-[260px] sm:min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border border-carbon-800 bg-carbon-950/80">
                  {servicio.imagenUrl ? (
                    <>
                      {/* Fondo difuminado ambiental para relleno armónico */}
                      <img
                        src={uploadUrl(servicio.imagenUrl)}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover blur-xl opacity-30 scale-125"
                        loading="lazy"
                        decoding="async"
                      />
                      {/* Imagen nítida completa sin recortes excesivos */}
                      <img
                        src={uploadUrl(servicio.imagenUrl)}
                        alt={servicio.nombre}
                        className="relative z-10 max-h-[340px] w-full object-contain p-3 drop-shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                      />
                    </>
                  ) : (
                    <div className="p-6 w-full flex items-center justify-center">
                      <AutoEjemplo resaltar={contenido?.resaltar || "carroceria"} className="w-full max-h-[240px]" />
                    </div>
                  )}

                  {/* Badge flotante sobre la imagen */}
                  <div className="absolute bottom-3 left-3 z-20 rounded-md bg-carbon-950/85 px-2.5 py-1 text-[11px] font-semibold text-chrome-300 backdrop-blur-md border border-white/10">
                    Pizarro Carwash Detail
                  </div>
                </div>

                {/* Panel de Inversión y CTA (Desktop) */}
                <div className="hidden lg:block mt-6 pt-5 border-t border-carbon-800/80">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-chrome-400">Inversión estimada</p>
                      {servicio.precioDesde ? (
                        <p className="mt-1 font-display text-3xl font-extrabold text-electric-400">
                          <span className="text-sm font-normal text-chrome-300">Desde </span>
                          ${Number(servicio.precioDesde).toLocaleString("es-AR")}
                        </p>
                      ) : (
                        <p className="mt-1 font-display text-2xl font-bold text-electric-400">
                          A convenir / Consultar
                        </p>
                      )}
                    </div>
                    <span className="rounded-full border border-electric-500/20 bg-electric-500/10 px-3 py-1 text-xs font-semibold text-electric-300">
                      Reserva previa
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-chrome-400 leading-normal">
                    * El valor final puede ajustarse según el tamaño, modelo y estado inicial de la unidad.
                  </p>

                  <a
                    href={linkWhatsApp(mensajeConsultaServicio(servicio))}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary mt-5 w-full py-3.5 text-base shadow-neon hover:shadow-cyan-500/50"
                  >
                    <MessageCircle size={20} /> Consultar por WhatsApp
                  </a>

                  <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-chrome-400">
                    <span className="flex items-center gap-1">
                      <Check size={14} className="text-electric-400" /> Respuesta rápida
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Check size={14} className="text-electric-400" /> Asesoramiento directo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Qué incluye este servicio */}
          <div className="mt-16 rounded-2xl border border-electric-500/20 bg-gradient-to-b from-carbon-900/60 to-carbon-950/60 p-6 sm:p-10 backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-carbon-800/80 pb-6">
              <div>
                <span className="section-eyebrow">DETALLE DEL PROCESO</span>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                  ¿Qué incluye este servicio?
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-chrome-300 max-w-md">
                Utilizamos técnicas seguras de lavado y productos certificados para garantizar un resultado impecable sin comprometer la pintura ni los interiores.
              </p>
            </div>

            {/* Listado de items con diseño de tarjetas/checklist */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {itemsIncluidos.map((item, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-3.5 rounded-xl border border-carbon-800/80 bg-carbon-950/60 p-4 transition-all duration-200 hover:border-electric-500/40 hover:bg-carbon-900/60"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-electric-500/30 bg-electric-500/10 text-electric-400 transition-colors group-hover:bg-electric-500 group-hover:text-carbon-950">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm leading-relaxed text-chrome-200 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Banner de Garantía y Cuidado */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-carbon-800 bg-carbon-950/80 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric-500/10 text-electric-400">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Compromiso de Calidad Pizarro</h4>
                  <p className="text-xs text-chrome-400">
                    Trabajamos con microfibras de alto gramaje, químicos con pH neutro y secado por aire.
                  </p>
                </div>
              </div>

              <a
                href={linkWhatsApp(mensajeConsultaServicio(servicio))}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary whitespace-nowrap text-xs py-2 px-4"
              >
                <CalendarCheck size={16} /> Reservá tu turno
              </a>
            </div>
          </div>

          {/* Sección de Reseñas y Formulario */}
          <div id="seccion-resenas" className="mt-16 scroll-mt-28">
            <div className="mb-8">
              <span className="section-eyebrow">FEEDBACK DE CLIENTES</span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                Opiniones y Experiencias
              </h2>
            </div>

            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
              
              {/* Columna Reseñas existentes (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {resenas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-carbon-800 bg-carbon-900/30 p-10 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-carbon-800/80 text-electric-400">
                      <Star size={24} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">Todavía no hay reseñas</h3>
                    <p className="mt-1 max-w-sm text-sm text-chrome-400">
                      ¿Ya probaste este servicio? Dejanos tu comentario a la derecha y sé el primero en compartir tu experiencia.
                    </p>
                  </div>
                ) : (
                  resenas.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-carbon-800/90 bg-carbon-900/60 p-5 backdrop-blur-sm transition-all duration-200 hover:border-carbon-700"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-electric-500/30 bg-electric-500/10 font-display text-sm font-bold text-electric-300">
                            {r.nombreCliente ? r.nombreCliente.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <span className="font-display text-sm font-bold text-white">
                              {r.nombreCliente}
                            </span>
                            <p className="text-[11px] text-chrome-400">
                              {new Date(r.createdAt).toLocaleDateString("es-AR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg border border-carbon-800 bg-carbon-950/70 px-2.5 py-1">
                          <Estrellas valor={r.calificacion} tamano={13} />
                        </div>
                      </div>

                      <p className="mt-3.5 text-sm leading-relaxed text-chrome-200 pl-1 border-l-2 border-electric-500/30 ml-2">
                        "{r.comentario}"
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Columna Formulario Dejá tu Reseña (5 cols) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-electric-500/25 bg-gradient-to-b from-carbon-900/90 to-carbon-950/90 p-6 sm:p-7 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-electric-400">
                    <Star size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Tu opinión cuenta</span>
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold text-white">Dejá tu reseña</h3>
                  <p className="mt-1 text-xs text-chrome-300">
                    Compartí tu experiencia con este servicio para ayudar a otros miembros de la comunidad.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-chrome-300">
                        <User size={13} className="text-electric-400" /> Tu nombre
                      </label>
                      <input
                        required
                        className="input-field"
                        placeholder="Ej: Juan Pérez"
                        value={form.nombreCliente}
                        onChange={(e) => setForm({ ...form, nombreCliente: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-chrome-300">
                          Calificación
                        </label>
                        <span className="text-xs font-bold text-electric-400">
                          {CALIFICACION_LABELS[form.calificacion] || `${form.calificacion} / 5`}
                        </span>
                      </div>
                      <div className="flex items-center rounded-lg border border-carbon-800 bg-carbon-950/70 p-3">
                        <Estrellas
                          valor={form.calificacion}
                          tamano={26}
                          interactivo
                          onChange={(n) => setForm({ ...form, calificacion: n })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-chrome-300">
                        Tu comentario
                      </label>
                      <textarea
                        required
                        rows={3}
                        className="input-field resize-none text-sm"
                        placeholder="¿Qué tal quedó tu vehículo? Contanos sobre la atención, los detalles o el acabado final..."
                        value={form.comentario}
                        onChange={(e) => setForm({ ...form, comentario: e.target.value })}
                      />
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                        {error}
                      </div>
                    )}

                    {enviado && (
                      <div className="flex items-center gap-2 rounded-lg border border-electric-500/40 bg-electric-500/15 p-3 text-xs font-semibold text-electric-300 shadow-neon">
                        <CheckCircle2 size={16} /> ¡Muchas gracias! Tu reseña se publicó exitosamente.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={enviando}
                      className="btn-primary w-full py-3 text-sm font-bold shadow-neon disabled:opacity-60"
                    >
                      <Send size={16} />
                      {enviando ? "Publicando reseña..." : "Publicar reseña"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

