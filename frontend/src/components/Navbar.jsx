import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

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

        <a
          href="https://wa.me/5493804111152"
          target="_blank"
          rel="noreferrer"
          className="btn-primary hidden lg:inline-flex"
        >
          Reservá tu turno
        </a>

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
          </ul>
        </div>
      )}
    </header>
  );
}
