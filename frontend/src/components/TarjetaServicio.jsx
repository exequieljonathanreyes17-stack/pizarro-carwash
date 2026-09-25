import { Link } from "react-router-dom";
import { Droplets, Sparkles, CarFront, Sofa, Star, Lightbulb, Wrench, ChevronRight, MessageCircle } from "lucide-react";
import { slugify } from "../lib/slug";
import { linkWhatsApp, mensajeConsultaServicio } from "../lib/whatsapp";
import { uploadUrl } from "../lib/api";
import Estrellas from "./Estrellas.jsx";

const ICONOS = {
  droplets: Droplets,
  sparkles: Sparkles,
  "car-front": CarFront,
  sofa: Sofa,
  star: Star,
  lightbulb: Lightbulb,
};

export default function TarjetaServicio({ servicio }) {
  const Icono = ICONOS[servicio.icono] || Wrench;
  const slug = slugify(servicio.nombre);

  return (
    <div className="group glass-card flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:border-electric-400/60 hover:shadow-neon">
      {servicio.imagenUrl ? (
        <div className="h-40 w-full bg-carbon-900">
          <img src={uploadUrl(servicio.imagenUrl)} alt={servicio.nombre} className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
        </div>
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-electric-500/10 text-electric-400 transition-colors group-hover:bg-electric-500/20">
          <Icono size={40} />
        </div>
      )}
      
      <div className="flex flex-col flex-1 p-6">
        {servicio.masVendido && (
          <span className="mb-3 inline-block w-fit rounded-full bg-electric-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-electric-400">
            Más elegido
          </span>
        )}
        <Link to={`/servicios/${slug}`}>
          <h3 className="font-display text-lg font-bold text-chrome-100">{servicio.nombre}</h3>
        </Link>
      {servicio.totalResenas > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <Estrellas valor={servicio.ratingPromedio} tamano={14} />
          <span className="text-xs text-chrome-400">({servicio.totalResenas})</span>
        </div>
      )}
      <p className="mt-2 flex-1 text-sm text-chrome-300">{servicio.descripcion}</p>
      {servicio.precioDesde && (
        <p className="mt-3 font-display text-electric-400">
          Desde <span className="text-lg font-bold">${Number(servicio.precioDesde).toLocaleString("es-AR")}</span>
        </p>
      )}

      <Link
        to={`/servicios/${slug}`}
        className="mt-4 inline-flex items-center gap-1 font-display text-sm font-semibold text-electric-400"
      >
        Ver detalle <ChevronRight size={16} />
      </Link>

      <a
        href={linkWhatsApp(mensajeConsultaServicio(servicio))}
        target="_blank"
        rel="noreferrer"
        className="btn-primary mt-4 !py-2 text-sm"
      >
        <MessageCircle size={16} /> Consultar
      </a>
      </div>
    </div>
  );
}
