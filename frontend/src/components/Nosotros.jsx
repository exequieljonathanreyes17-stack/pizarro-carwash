import { Wrench, Users, MapPin } from "lucide-react";

export default function Nosotros() {
  return (
    <section id="nosotros" className="relative border-t border-electric-500/10 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="section-eyebrow">QUIÉNES SOMOS</span>
            <h2 className="section-title mt-3">Un lavadero pensado para tu auto y tu moto</h2>
            <p className="mt-6 text-chrome-300">
              Pizarro Carwash es un centro de lavado y detailing automotor ubicado en Barrio
              Alunai, Zona Oeste. Trabajamos por turnos, con atención personalizada y productos
              de calidad, para que cada vehículo salga como nuevo: por dentro y por fuera.
            </p>
            <p className="mt-4 text-chrome-300">
              Nos especializamos en lavado tradicional y VIP, limpieza de interior y tapizados,
              abrillantado y restauración de ópticas, tanto para autos como para motos.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <InfoItem icon={Wrench} label="Servicio" valor="Autos y motos" />
              <InfoItem icon={Users} label="Atención" valor="Personalizada, por turno" />
              <InfoItem icon={MapPin} label="Zona" valor="Barrio Alunai, Zona Oeste" />
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute h-48 w-48 rounded-full bg-electric-500/15 blur-[80px]" />
            <img
              src="/images/logo-horizontal.png"
              alt="Logo Pizarro Carwash"
              className="relative z-10 w-full max-w-md rounded-xl border border-electric-500/20 bg-carbon-900/60 p-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, label, valor }) {
  return (
    <div className="glass-card rounded-lg p-4">
      <Icon className="text-electric-400" size={20} />
      <p className="mt-2 font-display text-xs tracking-widest text-chrome-400">{label}</p>
      <p className="mt-1 font-semibold text-chrome-100">{valor}</p>
    </div>
  );
}
