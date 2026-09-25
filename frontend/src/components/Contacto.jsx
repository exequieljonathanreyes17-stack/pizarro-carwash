import { MapPin, Clock, Phone, Instagram, CheckCircle2, MessageCircle } from "lucide-react";
import { linkWhatsApp } from "../lib/whatsapp";

const DIRECCION = "Barrio Alunai, Zona Oeste, La Rioja, Argentina";
const MAPA_SRC = `https://www.google.com/maps?q=${encodeURIComponent(DIRECCION)}&output=embed`;

export default function Contacto() {
  return (
    <section id="contacto" className="relative border-t border-electric-500/10 py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch">
          <div>
            <span className="section-eyebrow">UBICACIÓN</span>
            <h2 className="section-title mt-3">Visitanos hoy</h2>

            <ul className="mt-8 space-y-5">
              <ItemContacto icon={MapPin} label="Dirección" valor={DIRECCION} />
              <ItemContacto icon={Clock} label="Horarios" valor="Consultá disponibilidad de turnos por WhatsApp" />
              <ItemContacto icon={Phone} label="Teléfono / WhatsApp" valor="3804-111152" href="https://wa.me/5493804111152" />
              <ItemContacto
                icon={Instagram}
                label="Instagram"
                valor="@pizarrocarwash"
                href="https://instagram.com/pizarrocarwash"
              />
            </ul>

            <a
              href={linkWhatsApp("Hola, quiero consultar disponibilidad de turno.")}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-8 w-full sm:w-auto"
            >
              <MessageCircle size={18} /> Preguntar por WhatsApp
            </a>
          </div>

          <div className="min-h-[320px] overflow-hidden rounded-xl border border-electric-500/20">
            <iframe
              title="Ubicación de Pizarro Carwash"
              src={MAPA_SRC}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ItemContacto({ icon: Icon, label, valor, href }) {
  const contenido = (
    <>
      <CheckCircle2 className="mt-0.5 flex-none text-electric-400" size={18} />
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-wide text-chrome-400">{label}</p>
        <p className="mt-0.5 font-semibold text-chrome-100">{valor}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <li>
        <a href={href} target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-electric-400">
          {contenido}
        </a>
      </li>
    );
  }

  return <li className="flex items-start gap-3">{contenido}</li>;
}
