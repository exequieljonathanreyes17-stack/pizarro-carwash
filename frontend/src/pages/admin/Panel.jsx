import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Wrench, Sparkles, Award, Star, ArrowUpRight } from "lucide-react";
import { api, cache } from "../../lib/api";
import { SkeletonStats } from "../../components/admin/AdminSkeletons.jsx";

export default function Panel() {
  const [stats, setStats] = useState(() => cache.get("/panel_stats") || null);
  const [cargando, setCargando] = useState(() => !cache.get("/panel_stats"));

  useEffect(() => {
    Promise.all([
      api.get("/productos?todos=true").catch(() => []),
      api.get("/servicios?todos=true").catch(() => []),
      api.get("/resultados?todos=true").catch(() => []),
      api.get("/certificaciones?todos=true").catch(() => []),
      api.get("/resenas", true).catch(() => []),
    ]).then(([productos, servicios, resultados, certificaciones, resenas]) => {
      const data = {
        productos: productos.length,
        servicios: servicios.length,
        resultados: resultados.length,
        certificaciones: certificaciones.length,
        resenas: resenas.length,
      };
      setStats(data);
      cache.set("/panel_stats", data);
    }).finally(() => {
      setCargando(false);
    });
  }, []);

  const tarjetas = stats ? [
    { label: "Productos", valor: stats.productos, icon: Package, to: "/admin/productos", desc: "Ver y gestionar productos" },
    { label: "Servicios", valor: stats.servicios, icon: Wrench, to: "/admin/servicios", desc: "Ver y gestionar servicios" },
    { label: "Resultados / Trabajos", valor: stats.resultados, icon: Sparkles, to: "/admin/resultados", desc: "Ver y subir resultados" },
    { label: "Certificaciones", valor: stats.certificaciones, icon: Award, to: "/admin/certificaciones", desc: "Ver y editar certificados" },
    { label: "Reseñas recibidas", valor: stats.resenas, icon: Star, to: "/admin/resenas", desc: "Ver opiniones de clientes" },
  ] : [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-chrome-100">Resumen general</h1>
      <p className="mt-1 text-sm text-chrome-400">
        Administrá los productos, servicios y certificaciones que se muestran en la web pública.
      </p>

      {cargando && !stats ? (
        <SkeletonStats />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tarjetas.map(({ label, valor, icon: Icon, to, desc }) => (
            <Link
              key={label}
              to={to}
              className="glass-card group relative block rounded-xl p-5 border border-carbon-800/80 transition-all duration-300 hover:border-electric-500/50 hover:bg-carbon-900/90 hover:-translate-y-1 hover:shadow-neon cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-500/10 text-electric-400 border border-electric-500/20 group-hover:bg-electric-500 group-hover:text-carbon-950 transition-colors">
                  <Icon size={20} />
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-chrome-500 transition-all duration-200 group-hover:text-electric-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>

              <p className="mt-4 font-display text-3xl font-bold text-chrome-100 group-hover:text-white transition-colors">
                {valor}
              </p>
              <p className="mt-1 text-sm font-semibold text-chrome-300 group-hover:text-electric-300 transition-colors">
                {label}
              </p>
              <p className="mt-1 text-xs text-chrome-500 group-hover:text-chrome-400 transition-colors">
                {desc}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
