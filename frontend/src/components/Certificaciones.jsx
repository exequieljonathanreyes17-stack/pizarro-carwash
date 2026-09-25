import { useEffect, useState } from "react";
import { Award, BadgeCheck } from "lucide-react";
import { api, uploadUrl } from "../lib/api";

const CERTIFICACION_EJEMPLO = [
  {
    id: "ej1",
    nombreEmpleado: "Nuestro especialista en detailing",
    titulo: "Capacitación en Pulido y Detailing Automotriz",
    institucion: "Academia de capacitación certificada",
    descripcion: "Certificación que respalda la calidad de nuestros trabajos de pulido y abrillantado.",
    imagenUrl: null,
  },
];

export default function Certificaciones() {
  const [certificaciones, setCertificaciones] = useState(CERTIFICACION_EJEMPLO);

  useEffect(() => {
    api
      .get("/certificaciones")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCertificaciones(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="certificaciones" className="relative border-t border-electric-500/10 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">RESPALDO PROFESIONAL</span>
          <h2 className="section-title mt-3">Capacitaciones y certificaciones</h2>
          <p className="mt-4 text-chrome-300">
            Nuestro equipo se forma constantemente en técnicas de pulido y detailing para
            garantizar el mejor resultado en cada trabajo.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {certificaciones.map((c) => (
            <div key={c.id} className="glass-card flex gap-4 rounded-xl p-5">
              <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-lg bg-electric-500/10 text-electric-400">
                {c.imagenUrl ? (
                  <img src={uploadUrl(c.imagenUrl)} alt={c.titulo} className="h-full w-full object-cover" />
                ) : (
                  <Award size={28} />
                )}
              </div>
              <div>
                <p className="flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wide text-electric-400">
                  <BadgeCheck size={14} /> {c.nombreEmpleado}
                </p>
                <h3 className="mt-1 font-display font-bold text-chrome-100">{c.titulo}</h3>
                {c.institucion && <p className="mt-1 text-xs text-chrome-400">{c.institucion}</p>}
                {c.descripcion && <p className="mt-2 text-sm text-chrome-300">{c.descripcion}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
