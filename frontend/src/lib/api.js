const BASE_URL = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("pizarro_token");
}

async function request(path, { method = "GET", body, isForm = false, auth = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    console.error("[API Network Error]:", err);
    throw new Error(
      "No se pudo conectar con el servidor. Verificá que el backend esté activo o que las fotos no sean excesivamente pesadas."
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("pizarro_token");
      localStorage.removeItem("pizarro_usuario");
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin") && !window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login?expirado=true";
      }
    }
    throw new Error(data?.error || "Ocurrió un error al comunicarse con el servidor.");
  }

  return data;
}

const memCache = new Map();
const CACHE_PREFIX = "pizarro_cache_";
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutos de caché en el cliente

export const cache = {
  get: (key) => {
    // 1. Memoria rápida (microsegundos)
    if (memCache.has(key)) return memCache.get(key);

    // 2. Persistencia en sessionStorage para navegación y recargas instantáneas (0ms)
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const raw = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.exp && parsed.exp > Date.now()) {
            memCache.set(key, parsed.data);
            return parsed.data;
          } else {
            sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
          }
        }
      }
    } catch (e) {}

    return null;
  },
  set: (key, val, ttlMs = DEFAULT_TTL_MS) => {
    memCache.set(key, val);
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.setItem(
          `${CACHE_PREFIX}${key}`,
          JSON.stringify({ data: val, exp: Date.now() + ttlMs })
        );
      }
    } catch (e) {}
  },
  clear: (prefix) => {
    memCache.clear();
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const keys = Object.keys(sessionStorage);
        for (const k of keys) {
          if (k.startsWith(CACHE_PREFIX)) {
            if (!prefix || k.includes(prefix)) {
              sessionStorage.removeItem(k);
            }
          }
        }
      }
    } catch (e) {}
  },
};

export const api = {
  get: (path, auth = false) => request(path, { method: "GET", auth }),
  post: async (path, body, opts = {}) => {
    const res = await request(path, { method: "POST", body, ...opts });
    cache.clear();
    return res;
  },
  put: async (path, body, opts = {}) => {
    const res = await request(path, { method: "PUT", body, ...opts });
    cache.clear();
    return res;
  },
  del: async (path, opts = {}) => {
    const res = await request(path, { method: "DELETE", ...opts });
    cache.clear();
    return res;
  },
};

export function uploadUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith("http")) {
    // Si la imagen proviene de Cloudinary, inyectar transformaciones automáticas de CDN Edge:
    // f_auto: entrega automáticamente WebP/AVIF según el navegador del usuario
    // q_auto: comprime con algoritmo perceptivo reduciendo hasta un 70% el peso sin pérdida visible
    if (pathOrUrl.includes("res.cloudinary.com") && pathOrUrl.includes("/upload/")) {
      if (!pathOrUrl.includes("/f_auto") && !pathOrUrl.includes("/q_auto")) {
        return pathOrUrl.replace("/upload/", "/upload/f_auto,q_auto/");
      }
    }
    return pathOrUrl;
  }
  const apiHost = import.meta.env.VITE_API_HOST || "";
  return `${apiHost}${pathOrUrl}`;
}
