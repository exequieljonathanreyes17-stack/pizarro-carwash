import { useEffect, useState } from "react";
import { Package, Wrench, Award, Star } from "lucide-react";
import { api } from "../../lib/api";

export default function Panel() {
  const [stats, setStats] = useState({ productos: 0, servicios: 0, certificaciones: 0, resenas: 0 });

  useEffect(() => {
    Promise.all([
      api.get("/productos?todos=true").catch(() => []),
      api.get("/servicios?todos=true").catch(() => []),
      api.get("/certificaciones?todos=true").catch(() => []),
      api.get("/resenas", true).catch(() => []),
    ]).then(([productos, servicios, certificaciones, resenas]) => {
      setStats({
        productos: productos.length,
        servicios: servicios.length,
        certificaciones: certificaciones.length,
        resenas: resenas.length,
      });
    });
  }, []);

  const tarjetas = [
    { label: "Productos", valor: stats.productos, icon: Package },
    { label: "Servicios", valor: stats.servicios, icon: Wrench },
    { label: "Certificaciones", valor: stats.certificaciones, icon: Award },
    { label: "Reseñas recibidas", valor: stats.resenas, icon: Star },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-chrome-100">Resumen general</h1>
      <p className="mt-1 text-sm text-chrome-400">
        Administrá los productos, servicios y certificaciones que se muestran en la web pública.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tarjetas.map(({ label, valor, icon: Icon }) => (
          <div key={label} className="glass-card rounded-xl p-5">
            <Icon className="text-electric-400" size={22} />
            <p className="mt-3 font-display text-3xl font-bold text-chrome-100">{valor}</p>
            <p className="mt-1 text-sm text-chrome-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
