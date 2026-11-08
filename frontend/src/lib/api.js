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

export const cache = {
  get: (key) => memCache.get(key),
  set: (key, val) => memCache.set(key, val),
  clear: (prefix) => {
    if (!prefix) memCache.clear();
    else {
      for (const k of memCache.keys()) {
        if (k.startsWith(prefix)) memCache.delete(k);
      }
    }
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
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  const apiHost = import.meta.env.VITE_API_HOST || "";
  return `${apiHost}${pathOrUrl}`;
}
