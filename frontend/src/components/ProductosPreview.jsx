import { Link } from "react-router-dom";
import { ArrowRight, PackageSearch } from "lucide-react";
import { useProductos } from "../hooks/useDatos";
import TarjetaProducto from "./TarjetaProducto.jsx";
import MarcasSection from "./MarcasSection.jsx";
import { SkeletonProductos } from "./Skeletons.jsx";

export default function ProductosPreview() {
  const { productos, cargando } = useProductos();
  const destacados = productos.slice(0, 3);

  return (
    <section className="relative border-t border-electric-500/10 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">PRODUCTOS</span>
          <h2 className="section-title mt-3">Lo que usamos</h2>
        </div>

        {cargando ? (
          <div className="mt-14">
            <SkeletonProductos cantidad={3} />
          </div>
        ) : productos.length === 0 ? (
          <div className="mx-auto mt-14 flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed border-chrome-400/20 p-10 text-center">
            <PackageSearch className="text-chrome-400" size={32} />
            <p className="text-chrome-400">Todavía no hay productos cargados.</p>
          </div>
        ) : (
          <>
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destacados.map((p) => (
                <TarjetaProducto key={p.id} producto={p} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link to="/productos" className="btn-secondary">
                Ver todos los productos <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}

        <MarcasSection />
      </div>
    </section>
  );
}
