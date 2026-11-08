import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const guardado = localStorage.getItem("pizarro_usuario");
    const token = localStorage.getItem("pizarro_token");
    if (guardado && token) {
      try {
        setUsuario(JSON.parse(guardado));
      } catch (e) {
        localStorage.removeItem("pizarro_usuario");
        localStorage.removeItem("pizarro_token");
        setUsuario(null);
      }
    } else {
      localStorage.removeItem("pizarro_usuario");
      localStorage.removeItem("pizarro_token");
      setUsuario(null);
    }
    setCargando(false);
  }, []);

  async function login(email, password) {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem("pizarro_token", data.token);
    localStorage.setItem("pizarro_usuario", JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem("pizarro_token");
    localStorage.removeItem("pizarro_usuario");
    setUsuario(null);
  }

  function actualizarUsuario(nuevoUsuario, nuevoToken) {
    if (nuevoToken) {
      localStorage.setItem("pizarro_token", nuevoToken);
    }
    if (nuevoUsuario) {
      localStorage.setItem("pizarro_usuario", JSON.stringify(nuevoUsuario));
      setUsuario(nuevoUsuario);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        login,
        logout,
        actualizarUsuario,
        isAuthenticated: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
