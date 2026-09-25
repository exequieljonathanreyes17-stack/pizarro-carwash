import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Wrench, Award, Star, Tags, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const ITEMS = [
  { to: "/admin", label: "Panel", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/servicios", label: "Servicios", icon: Wrench },
  { to: "/admin/certificaciones", label: "Certificaciones", icon: Award },
  { to: "/admin/marcas", label: "Marcas", icon: Tags },
  { to: "/admin/resenas", label: "Reseñas", icon: Star },
];

export default function AdminLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-carbon-950">
      <aside className="hidden w-64 flex-none flex-col border-r border-electric-500/10 bg-carbon-900/60 p-5 md:flex">
        <div className="mb-8 flex items-center gap-2">
          <img src="/images/logo-circular.png" alt="Pizarro Carwash" className="h-10 w-10 object-contain" />
          <span className="font-display text-sm font-bold text-chrome-100">Panel Admin</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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

        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mb-2 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-chrome-300 hover:bg-carbon-800 hover:text-chrome-100"
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
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-electric-500/10 bg-carbon-900/40 px-5 py-4 md:hidden">
          <span className="font-display text-sm font-bold text-chrome-100">Panel Admin</span>
          <button onClick={handleLogout} className="text-sm text-chrome-300">
            Salir
          </button>
        </header>
        <div className="mx-auto max-w-6xl p-5 md:p-8">
          <p className="mb-6 text-sm text-chrome-400">
            Hola, <span className="font-semibold text-chrome-100">{usuario?.nombre}</span>
          </p>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
