
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
    <div className="group glass-card relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-carbon-900/60 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-electric-500/40 hover:shadow-neon">
      
      {/* Etiqueta Flotante - Más elegido */}
      {servicio.masVendido && (
        <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-electric-500/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-electric-500/20 backdrop-blur-sm">
          <Sparkles size={14} className="text-white" />
          Más elegido
        </div>
      )}

      {/* Área Visual (Imagen o Ícono) */}
      <div className="relative h-52 w-full overflow-hidden bg-carbon-950 flex items-center justify-center">
        {servicio.imagenUrl ? (
          <>
            {/* Fondo difuminado para rellenar los bordes según los colores de la foto */}
            <img 
              src={uploadUrl(servicio.imagenUrl)} 
              alt="" 
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover blur-md opacity-30 scale-110" 
            />
            {/* Imagen principal completa, sin recortes ni zoom excesivo */}
            <img 
              src={uploadUrl(servicio.imagenUrl)} 
              alt={servicio.nombre} 
              className="relative z-10 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" 
            />
            {/* Gradiente oscuro sutil sobre la base */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-carbon-950/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-electric-500/5 transition-colors duration-500 group-hover:bg-electric-500/10">
            <Icono size={48} className="text-electric-500/40 transition-transform duration-500 group-hover:scale-110 group-hover:text-electric-400" />
          </div>
        )}
      </div>
      
      {/* Contenido de la Tarjeta */}
      <div className="flex flex-1 flex-col p-6">
        
        {/* Título */}
        <Link to={`/servicios/${slug}`} className="mb-2 inline-block">
          <h3 className="font-display text-xl font-bold text-chrome-100 transition-colors group-hover:text-white">
            {servicio.nombre}
          </h3>
        </Link>

        {/* Reseñas */}
        {servicio.totalResenas > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
              <Estrellas valor={servicio.ratingPromedio} tamano={12} />
            </div>
            <span className="text-xs font-medium text-chrome-400">
              ({servicio.totalResenas} {servicio.totalResenas === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>
        )}
        
        {/* Descripción */}
        <p className="mb-6 flex-1 text-sm leading-relaxed text-chrome-300 line-clamp-3">
          {servicio.descripcion}
        </p>

        {/* Separador visual */}
        <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Pie de tarjeta: Precio y link de detalle */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-chrome-500">
              Inversión
            </p>
            {servicio.precioDesde ? (
              <p className="font-display text-electric-400">
                <span className="text-xs">Desde </span>
                <span className="text-2xl font-bold">${Number(servicio.precioDesde).toLocaleString("es-AR")}</span>
              </p>
            ) : (
              <p className="font-display text-xl font-bold text-electric-400">
                Consultar
              </p>
            )}
          </div>

          <Link
            to={`/servicios/${slug}`}
            className="group/link flex items-center gap-1 text-sm font-semibold text-chrome-300 transition-colors hover:text-electric-400"
          >
            Detalle 
            <ChevronRight size={16} className="transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>

        {/* Botón WhatsApp */}
        <a
          href={linkWhatsApp(mensajeConsultaServicio(servicio))}
          target="_blank"
          rel="noreferrer"
          className="btn-primary flex w-full items-center justify-center gap-2 !py-2.5 shadow-lg shadow-electric-500/10 transition-all hover:shadow-electric-500/30"
        >
          <MessageCircle size={18} />
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}

