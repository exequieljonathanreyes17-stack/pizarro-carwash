import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-carbon-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="/images/logo-circular.png" alt="Pizarro Carwash" className="h-20 w-20 object-contain" />
          <h1 className="mt-4 font-display text-xl font-bold text-chrome-100">Panel de administrador</h1>
          <p className="mt-1 text-sm text-chrome-400">Pizarro Carwash</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6">
          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-chrome-400">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@pizarrocarwash.com"
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-chrome-400">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={cargando} className="btn-primary w-full disabled:opacity-60">
            <LockKeyhole size={18} />
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
