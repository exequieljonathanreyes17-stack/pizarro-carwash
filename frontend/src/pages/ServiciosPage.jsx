import Layout from "../components/Layout.jsx";
import { useServicios } from "../hooks/useDatos";
import TarjetaServicio from "../components/TarjetaServicio.jsx";

export default function ServiciosPage() {
  const { servicios, cargando } = useServicios();

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">NUESTROS SERVICIOS</span>
            <h1 className="section-title mt-3">Todos los servicios</h1>
            <p className="mt-4 text-chrome-300">
              Elegí un servicio para ver el detalle completo, dejar tu reseña o consultar por
              WhatsApp.
            </p>
          </div>

          {!cargando && servicios.length === 0 ? (
            <p className="mt-14 text-center text-chrome-400">Todavía no hay servicios cargados.</p>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {servicios.map((s) => (
                <TarjetaServicio key={s.id} servicio={s} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
