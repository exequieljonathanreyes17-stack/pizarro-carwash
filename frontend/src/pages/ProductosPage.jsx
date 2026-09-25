import { useMemo, useState } from "react";
import Layout from "../components/Layout.jsx";
import TarjetaProducto from "../components/TarjetaProducto.jsx";
import { useProductos } from "../hooks/useDatos";

export default function ProductosPage() {
  const { productos, cargando } = useProductos();
  const [filtro, setFiltro] = useState("Todos");

  const categorias = useMemo(() => {
    const unicas = Array.from(new Set(productos.map((p) => p.categoria))).sort();
    return ["Todos", ...unicas];
  }, [productos]);

  const filtrados = filtro === "Todos" ? productos : productos.filter((p) => p.categoria === filtro);

  return (
    <Layout>
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">PRODUCTOS</span>
            <h1 className="section-title mt-3">Todos los productos</h1>
          </div>

          {categorias.length > 1 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categorias.map((c) => (
                <button
                  key={c}
                  onClick={() => setFiltro(c)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                    filtro === c
                      ? "border-electric-400 bg-electric-500/15 text-electric-400"
                      : "border-chrome-400/20 text-chrome-300 hover:border-electric-400/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {!cargando && filtrados.length === 0 ? (
            <p className="mt-14 text-center text-chrome-400">No hay productos en esta categoría.</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtrados.map((p) => (
                <TarjetaProducto key={p.id} producto={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
