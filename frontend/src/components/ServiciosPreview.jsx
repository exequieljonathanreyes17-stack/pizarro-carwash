import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useServicios } from "../hooks/useDatos";
import TarjetaServicio from "./TarjetaServicio.jsx";

function ordenarDestacados(servicios) {
  const masVendido = servicios.find((s) => s.masVendido);
  const resto = servicios
    .filter((s) => s !== masVendido)
    .sort((a, b) => (b.ratingPromedio || 0) - (a.ratingPromedio || 0));

  const destacados = masVendido ? [masVendido, ...resto] : resto;
  return destacados.slice(0, 3);
}

export default function ServiciosPreview() {
  const { servicios } = useServicios();
  const destacados = ordenarDestacados(servicios);

  return (
    <section id="servicios-preview" className="relative border-t border-electric-500/10 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">NUESTROS SERVICIOS</span>
          <h2 className="section-title mt-3">Los más elegidos por nuestros clientes</h2>
          <p className="mt-4 text-chrome-300">Tocá un servicio para ver el detalle completo de qué incluye.</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((s) => (
            <TarjetaServicio key={s.id} servicio={s} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/servicios" className="btn-secondary">
            Ver todos los servicios <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}


