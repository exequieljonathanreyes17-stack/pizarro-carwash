import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
} from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminConfiguracion() {
  const { usuario, actualizarUsuario, logout } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [email, setEmail] = useState(usuario?.email || "");

  // Cambio de contraseña
  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  // Visibilidad de contraseñas
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // Estados de carga y feedback
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [error, setError] = useState("");

  // Cargar datos actuales desde el backend
  useEffect(() => {
    api
      .get("/auth/perfil", true)
      .then((data) => {
        if (data?.nombre) setNombre(data.nombre);
        if (data?.email) setEmail(data.email);
      })
      .catch(() => {});
  }, []);

  // Reglas de seguridad para la nueva contraseña
  const tieneLongitud = passwordNueva.length >= 8;
  const tieneLetra = /[a-zA-Z]/.test(passwordNueva);
  const tieneNumero = /[0-9]/.test(passwordNueva);
  const tieneSimbolo = /[^a-zA-Z0-9]/.test(passwordNueva) || /[A-Z]/.test(passwordNueva);
  const coinciden = passwordNueva && passwordNueva === confirmarPassword;

  // Cálculo de fuerza de contraseña (0 a 100)
  let fuerza = 0;
  if (tieneLongitud) fuerza += 30;
  if (tieneLetra) fuerza += 25;
  if (tieneNumero) fuerza += 25;
  if (tieneSimbolo) fuerza += 20;

  function obtenerColorYTextoFuerza() {
    if (fuerza <= 30) return { color: "bg-red-500", texto: "Débil", claseTexto: "text-red-400" };
    if (fuerza < 80) return { color: "bg-amber-500", texto: "Media", claseTexto: "text-amber-400" };
    return { color: "bg-emerald-500", texto: "Segura y Robusta", claseTexto: "text-emerald-400" };
  }

  const { color: barraColor, texto: textoFuerza, claseTexto } = obtenerColorYTextoFuerza();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    // Validaciones
    if (!nombre.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    if (!email.trim()) {
      setError("El correo electrónico no puede estar vacío.");
      return;
    }

    if (cambiarPassword) {
      if (!passwordActual) {
        setError("Debes ingresar tu contraseña actual para cambiarla.");
        return;
      }
      if (!tieneLongitud || !tieneLetra || !tieneNumero) {
        setError("La nueva contraseña debe tener mínimo 8 caracteres e incluir letras y números.");
        return;
      }
      if (!coinciden) {
        setError("Las contraseñas no coinciden. Por favor verificalas.");
        return;
      }
    }

    setGuardando(true);
    try {
      const seCambioPassword = Boolean(cambiarPassword && passwordNueva);
      const payload = {
        nombre: nombre.trim(),
        email: email.trim(),
      };

      if (seCambioPassword) {
        payload.passwordActual = passwordActual;
        payload.passwordNueva = passwordNueva;
      }

      const res = await api.put("/auth/perfil", payload, { auth: true });

      if (seCambioPassword) {
        setMensajeExito("¡Contraseña actualizada con éxito! Cerrando sesión para ingresar con tus nuevas credenciales...");
        setTimeout(() => {
          logout();
          navigate("/admin/login?cambioPassword=true");
        }, 1200);
        return;
      }

      // Si solo se actualizó nombre o email, mantenemos la sesión activa
      if (res.usuario) {
        actualizarUsuario(res.usuario, res.token);
      }

      setMensajeExito(res.mensaje || "Tus datos se actualizaron correctamente.");

      // Limpiar campos de contraseña
      setPasswordActual("");
      setPasswordNueva("");
      setConfirmarPassword("");
      setCambiarPassword(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al actualizar la configuración.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="font-display text-2xl font-bold text-chrome-100 flex items-center gap-2">
          <Settings className="text-electric-400" size={26} />
          Configuración de la cuenta
        </h1>
        <p className="mt-1 text-sm text-chrome-400">
          Modificá tu usuario, email de acceso y configurá una contraseña segura para proteger el panel.
        </p>
      </div>

      {/* Banner de Éxito */}
      {mensajeExito && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          <CheckCircle size={20} className="shrink-0 text-emerald-400" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Banner de Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle size={20} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BLOQUE 1: Datos de Usuario y Correo */}
        <div className="glass-card rounded-2xl border border-carbon-800 bg-carbon-900/40 p-6 space-y-5">
          <div className="border-b border-carbon-800 pb-3 flex items-center gap-2">
            <User className="text-electric-400" size={18} />
            <h2 className="font-display text-base font-bold text-white">
              Datos personales y acceso
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chrome-300">
                Nombre de Administrador
              </label>
              <div className="mt-1.5 relative flex items-center">
                <span className="absolute left-3 text-chrome-500 pointer-events-none">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Administrador Pizarro"
                  className="w-full rounded-xl border border-carbon-800 bg-carbon-950 pl-9 pr-3.5 py-2.5 text-sm text-chrome-100 placeholder:text-chrome-600 focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chrome-300">
                Correo Electrónico (Email de login)
              </label>
              <div className="mt-1.5 relative flex items-center">
                <span className="absolute left-3 text-chrome-500 pointer-events-none">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pizarrocarwash.com"
                  className="w-full rounded-xl border border-carbon-800 bg-carbon-950 pl-9 pr-3.5 py-2.5 text-sm text-chrome-100 placeholder:text-chrome-600 focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE 2: Cambio de Contraseña Segura */}
        <div className="glass-card rounded-2xl border border-carbon-800 bg-carbon-900/40 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-carbon-800 pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="text-electric-400" size={18} />
              <h2 className="font-display text-base font-bold text-white">
                Seguridad y Contraseña
              </h2>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-electric-400 hover:text-electric-300 transition-colors">
              <input
                type="checkbox"
                checked={cambiarPassword}
                onChange={(e) => setCambiarPassword(e.target.checked)}
                className="h-4 w-4 rounded border-carbon-700 bg-carbon-900 text-electric-500 focus:ring-electric-400"
              />
              Cambiar contraseña
            </label>
          </div>

          {!cambiarPassword ? (
            <p className="text-xs text-chrome-400">
              Tu contraseña actual está protegida con cifrado bcrypt. Si querés actualizarla a una nueva contraseña segura, marcá la casilla superior.
            </p>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Contraseña Actual */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chrome-300">
                  Contraseña Actual <span className="text-electric-400">*</span>
                </label>
                <div className="mt-1.5 relative flex items-center">
                  <span className="absolute left-3 text-chrome-500 pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    type={mostrarActual ? "text" : "password"}
                    required={cambiarPassword}
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    placeholder="Tu contraseña actual"
                    className="w-full rounded-xl border border-carbon-800 bg-carbon-950 pl-9 pr-10 py-2.5 text-sm text-chrome-100 placeholder:text-chrome-600 focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarActual(!mostrarActual)}
                    className="absolute right-3 text-chrome-400 hover:text-white"
                  >
                    {mostrarActual ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nueva Contraseña */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chrome-300">
                  Nueva Contraseña Segura <span className="text-electric-400">*</span>
                </label>
                <div className="mt-1.5 relative flex items-center">
                  <span className="absolute left-3 text-chrome-500 pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    type={mostrarNueva ? "text" : "password"}
                    required={cambiarPassword}
                    value={passwordNueva}
                    onChange={(e) => setPasswordNueva(e.target.value)}
                    placeholder="Mínimo 8 caracteres con letras y números"
                    className="w-full rounded-xl border border-carbon-800 bg-carbon-950 pl-9 pr-10 py-2.5 text-sm text-chrome-100 placeholder:text-chrome-600 focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarNueva(!mostrarNueva)}
                    className="absolute right-3 text-chrome-400 hover:text-white"
                  >
                    {mostrarNueva ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Barra de Fuerza de Contraseña */}
                {passwordNueva && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-chrome-400">Seguridad:</span>
                      <span className={`font-bold ${claseTexto}`}>{textoFuerza}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-carbon-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${barraColor}`}
                        style={{ width: `${fuerza}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-chrome-300">
                  Confirmar Nueva Contraseña <span className="text-electric-400">*</span>
                </label>
                <div className="mt-1.5 relative flex items-center">
                  <span className="absolute left-3 text-chrome-500 pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <input
                    type={mostrarConfirmar ? "text" : "password"}
                    required={cambiarPassword}
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    placeholder="Reescribí la nueva contraseña"
                    className="w-full rounded-xl border border-carbon-800 bg-carbon-950 pl-9 pr-10 py-2.5 text-sm text-chrome-100 placeholder:text-chrome-600 focus:border-electric-400 focus:outline-none focus:ring-1 focus:ring-electric-400"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    className="absolute right-3 text-chrome-400 hover:text-white"
                  >
                    {mostrarConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Checklist de requisitos de seguridad */}
              <div className="rounded-xl border border-carbon-800 bg-carbon-950/60 p-3.5 space-y-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-chrome-400 block mb-1">
                  Requisitos de seguridad:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-chrome-300">
                  <div className={`flex items-center gap-1.5 ${tieneLongitud ? "text-emerald-400 font-semibold" : "text-chrome-500"}`}>
                    <CheckCircle size={14} className={tieneLongitud ? "text-emerald-400" : "text-carbon-700"} />
                    Mínimo 8 caracteres
                  </div>
                  <div className={`flex items-center gap-1.5 ${tieneLetra ? "text-emerald-400 font-semibold" : "text-chrome-500"}`}>
                    <CheckCircle size={14} className={tieneLetra ? "text-emerald-400" : "text-carbon-700"} />
                    Al menos una letra
                  </div>
                  <div className={`flex items-center gap-1.5 ${tieneNumero ? "text-emerald-400 font-semibold" : "text-chrome-500"}`}>
                    <CheckCircle size={14} className={tieneNumero ? "text-emerald-400" : "text-carbon-700"} />
                    Al menos un número
                  </div>
                  <div className={`flex items-center gap-1.5 ${coinciden ? "text-emerald-400 font-semibold" : "text-chrome-500"}`}>
                    <CheckCircle size={14} className={coinciden ? "text-emerald-400" : "text-carbon-700"} />
                    Las contraseñas coinciden
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={guardando}
            className="btn-primary !px-6 !py-2.5 text-sm shadow-neon"
          >
            {guardando ? "Guardando cambios..." : "Guardar configuración"}
          </button>
        </div>
      </form>
    </div>
  );
}
