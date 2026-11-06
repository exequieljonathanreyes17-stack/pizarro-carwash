import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Lock } from "lucide-react";

const LINKS = [
  { to: "/#nosotros", label: "Nosotros" },
  { to: "/servicios", label: "Servicios" },
  { to: "/productos", label: "Productos" },
  { to: "/resultados", label: "Resultados" },
  { to: "/#certificaciones", label: "Certificaciones" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-carbon-950/90 backdrop-blur-md border-b border-electric-500/10" : "bg-carbon-950/70 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo-circular.png" alt="Pizarro Carwash" className="h-11 w-11 object-contain" />
          <span className="hidden font-display text-lg font-bold sm:block">
            <span className="text-chrome">PIZARRO</span> <span className="text-electric-400">CARWASH</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `font-display text-sm font-semibold tracking-wide transition-colors ${
                    isActive ? "text-electric-400" : "text-chrome-200 hover:text-electric-400"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/admin"
            title="Panel de Administrador"
            className="flex items-center gap-1.5 rounded-lg border border-electric-500/20 bg-carbon-900/60 px-3 py-2 text-xs font-semibold text-chrome-300 transition-all hover:border-electric-400 hover:text-electric-400"
          >
            <Lock size={14} />
            <span>Admin</span>
          </Link>

          <a
            href="https://wa.me/5493804111152"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Reservá tu turno
          </a>
        </div>

        <button
          className="text-chrome-100 lg:hidden"
          onClick={() => setAbierto((v) => !v)}
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          {abierto ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {abierto && (
        <div className="border-t border-electric-500/10 bg-carbon-950/98 px-4 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setAbierto(false)}
                  className={({ isActive }) =>
                    `block font-display text-base font-semibold ${isActive ? "text-electric-400" : "text-chrome-200"}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href="https://wa.me/5493804111152"
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-2 w-full"
              >
                Reservá tu turno
              </a>
            </li>
            <li className="pt-2 border-t border-carbon-800/80">
              <Link
                to="/admin"
                onClick={() => setAbierto(false)}
                className="flex items-center gap-2 font-display text-sm font-semibold text-chrome-300 hover:text-electric-400"
              >
                <Lock size={16} />
                Acceso Administrador
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
