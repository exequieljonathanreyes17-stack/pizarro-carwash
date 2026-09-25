import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageCircle, Clock, ArrowLeft, Send } from "lucide-react";
import Layout from "../components/Layout.jsx";
import AutoEjemplo from "../components/AutoEjemplo.jsx";
import Estrellas from "../components/Estrellas.jsx";
import { useServicios } from "../hooks/useDatos";
import { slugify } from "../lib/slug";
import { obtenerContenidoServicio } from "../data/serviciosContenido";
import { linkWhatsApp, mensajeConsultaServicio } from "../lib/whatsapp";
import { api, uploadUrl } from "../lib/api";

export default function ServicioDetallePage() {
  const { slug } = useParams();
  const { servicios } = useServicios();
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

  if (!servicio) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <p className="text-chrome-300">No encontramos ese servicio.</p>
          <Link to="/servicios" className="btn-secondary mt-6 inline-flex">
            <ArrowLeft size={18} /> Volver a servicios
          </Link>
        </div>
      </Layout>
    );
  }

  const contenido = obtenerContenidoServicio(servicio.nombre);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const nueva = await api.post(`/servicios/${servicio.id}/resenas`, form);
      setResenas((r) => [nueva, ...r]);
      setForm({ nombreCliente: "", calificacion: 5, comentario: "" });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Layout>
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <Link to="/servicios" className="inline-flex items-center gap-1 text-sm text-chrome-400 hover:text-electric-400">
            <ArrowLeft size={16} /> Volver a servicios
          </Link>

          <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              {servicio.masVendido && (
                <span className="mb-3 inline-block rounded-full bg-electric-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-electric-400">
                  Más elegido
                </span>
              )}
              <h1 className="section-title">{servicio.nombre}</h1>

              {servicio.totalResenas > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <Estrellas valor={servicio.ratingPromedio} />
                  <span className="text-sm text-chrome-400">
                    {servicio.ratingPromedio} ({servicio.totalResenas} reseña
                    {servicio.totalResenas === 1 ? "" : "s"})
                  </span>
                </div>
              )}

              <p className="mt-4 text-chrome-300">{servicio.descripcion}</p>

              <div className="mt-4 flex items-center gap-2 text-sm text-chrome-400">
                <Clock size={16} className="text-electric-400" /> Duración estimada: {servicio.duracion || contenido.duracion}
              </div>

              {servicio.precioDesde && (
                <p className="mt-4 font-display text-2xl font-bold text-electric-400">
                  Desde ${Number(servicio.precioDesde).toLocaleString("es-AR")}
                </p>
              )}
            </div>

            <div className="glass-card flex items-center justify-center rounded-xl p-6">
              {servicio.imagenUrl ? (
                <img
                  src={uploadUrl(servicio.imagenUrl)}
                  alt={servicio.nombre}
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <AutoEjemplo resaltar={contenido.resaltar} className="w-full" />
              )}
            </div>
          </div>

          <div className="mt-14 glass-card rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-chrome-100">Qué incluye este servicio</h2>
            <ul className="mt-4 space-y-3">
              {(servicio.incluye ? servicio.incluye.split('\n').filter(Boolean) : contenido.incluye).map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-chrome-300">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-electric-400" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={linkWhatsApp(mensajeConsultaServicio(servicio))}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8 w-full sm:w-auto"
            >
              <MessageCircle size={18} /> Consultar por WhatsApp
            </a>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-xl font-bold text-chrome-100">Reseñas de clientes</h2>
              <div className="mt-4 space-y-4">
                {resenas.length === 0 && (
                  <p className="text-sm text-chrome-400">Todavía no hay reseñas para este servicio. ¡Sé el primero!</p>
                )}
                {resenas.map((r) => (
                  <div key={r.id} className="glass-card rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-chrome-100">{r.nombreCliente}</span>
                      <Estrellas valor={r.calificacion} tamano={14} />
                    </div>
                    <p className="mt-2 text-sm text-chrome-300">{r.comentario}</p>
                    <p className="mt-2 text-[11px] text-chrome-400">
                      {new Date(r.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-chrome-100">Dejá tu reseña</h2>
              <form onSubmit={handleSubmit} className="glass-card mt-4 space-y-3 rounded-xl p-5">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Tu nombre</label>
                  <input
                    required
                    className="input-field"
                    value={form.nombreCliente}
                    onChange={(e) => setForm({ ...form, nombreCliente: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Calificación</label>
                  <Estrellas
                    valor={form.calificacion}
                    tamano={24}
                    interactivo
                    onChange={(n) => setForm({ ...form, calificacion: n })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-chrome-400">Comentario</label>
                  <textarea
                    required
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Contanos cómo fue tu experiencia"
                    value={form.comentario}
                    onChange={(e) => setForm({ ...form, comentario: e.target.value })}
                  />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}
                {enviado && <p className="text-sm text-electric-400">¡Gracias por tu reseña!</p>}

                <button type="submit" disabled={enviando} className="btn-primary w-full disabled:opacity-60">
                  <Send size={16} /> {enviando ? "Enviando..." : "Enviar reseña"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
