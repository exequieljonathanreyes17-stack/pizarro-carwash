import { Link } from "react-router-dom";
import { MapPin, Phone, Instagram, Clock, Car } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto relative overflow-hidden bg-carbon-950 pt-16 pb-8 border-t border-electric-500/20">
      {/* Brillo superior tipo neón */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-electric-500/50 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.5)]"></div>
      
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          
          {/* Logo y Descripción */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="flex items-center gap-3">
              <img src="/images/logo-circular.png" alt="Pizarro Carwash" className="h-12 w-12 object-contain" />
              <span className="font-display text-lg font-bold tracking-wider">
                <span className="text-chrome-100">PIZARRO</span> <span className="text-electric-400">CARWASH</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-chrome-300">
              Cuidamos tu vehículo con la mejor tecnología y productos premium. Detailing, limpieza de interiores, abrillantados y más.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-electric-400">Enlaces Rápidos</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-chrome-300">
              <li>
                <Link to="/servicios" className="hover:text-electric-400 transition-colors flex items-center gap-2">
                  <Car size={16} /> Servicios y Precios
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-electric-400 transition-colors flex items-center gap-2">
                  <Phone size={16} /> Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Información y Contacto */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-electric-400">Encontranos</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-chrome-300">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-electric-400" />
                <span>Barrio Alunai, Zona Oeste<br />La Rioja, Argentina</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="shrink-0 text-electric-400" />
                <span>Lun a Sáb: 9:00 a 13:00 / 17:00 a 21:00</span>
              </li>
            </ul>
            
            <div className="mt-6 flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-500/10 text-electric-400 transition-all hover:bg-electric-500 hover:text-carbon-950 hover:shadow-neon">
                <Instagram size={20} />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-center border-t border-electric-500/10 pt-8 text-center">
          <p className="text-xs text-chrome-400">
            © {new Date().getFullYear()} Pizarro Carwash. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
