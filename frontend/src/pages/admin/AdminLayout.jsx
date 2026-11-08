import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Wrench,
  Sparkles,
  Award,
  Star,
  Tags,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const ITEMS = [
  { to: "/admin", label: "Panel", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/servicios", label: "Servicios", icon: Wrench },
  { to: "/admin/resultados", label: "Resultados", icon: Sparkles },
  { to: "/admin/certificaciones", label: "Certificaciones", icon: Award },
  { to: "/admin/marcas", label: "Marcas", icon: Tags },
  { to: "/admin/resenas", label: "Reseñas", icon: Star },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-carbon-950">
      {/* Fondo oscuro al abrir el menú en celular */}
      {menuAbierto && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Menú lateral (Sidebar) - Fijo en escritorio, drawer deslizable en celular */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-none flex-col border-r border-electric-500/10 bg-carbon-950 p-5 shadow-2xl transition-transform duration-300 ease-in-out md:static md:w-64 md:translate-x-0 md:bg-carbon-900/60 md:shadow-none ${
          menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo-circular.png" alt="Pizarro Carwash" className="h-10 w-10 object-contain" />
            <span className="font-display text-sm font-bold text-chrome-100">Panel Admin</span>
          </div>
          <button
            onClick={() => setMenuAbierto(false)}
            className="rounded-lg p-1.5 text-chrome-400 hover:bg-carbon-800 hover:text-white md:hidden"
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-electric-500/15 text-electric-400"
                    : "text-chrome-300 hover:bg-carbon-800 hover:text-chrome-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-carbon-800/80 flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuAbierto(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-chrome-300 hover:bg-carbon-800 hover:text-chrome-100"
          >
            <ExternalLink size={18} />
            Ver sitio
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-chrome-300 hover:bg-carbon-800 hover:text-red-400"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 min-w-0">
        {/* Barra superior con botón hamburguesa solo para celulares */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-electric-500/10 bg-carbon-950/90 px-4 py-3 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuAbierto(true)}
              className="flex items-center justify-center rounded-lg border border-electric-500/20 bg-carbon-900/80 p-2 text-chrome-200 transition-colors hover:border-electric-400 hover:text-electric-400"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
              <img src="/images/logo-circular.png" alt="Pizarro Carwash" className="h-8 w-8 object-contain" />
              <span className="font-display text-sm font-bold text-chrome-100">Panel Admin</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
          >
            <LogOut size={14} />
            <span>Salir</span>
          </button>
        </header>

        <div className="mx-auto max-w-6xl p-4 sm:p-5 md:p-8">
          <p className="mb-6 text-sm text-chrome-400">
            Hola, <span className="font-semibold text-chrome-100">{usuario?.nombre}</span>
          </p>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
