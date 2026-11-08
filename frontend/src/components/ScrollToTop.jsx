import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  // Aseguramos que la restauración de scroll nativa del navegador no interfiera
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (hash) {
      // Si hay un hash (#nosotros, #certificaciones, etc.), desplazamos suavemente a dicho elemento
      const id = hash.replace("#", "");
      const timer = setTimeout(() => {
        const elemento = document.getElementById(id);
        if (elemento) {
          elemento.scrollIntoView({ behavior: "smooth" });
        }
      }, 60);

      return () => clearTimeout(timer);
    } else {
      // Si navegamos a una ruta sin hash, colocamos inmediatamente la vista arriba de todo (0, 0)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Reafirmamos en el siguiente cuadro por si la página monta componentes asíncronos
      const raf = requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });

      return () => cancelAnimationFrame(raf);
    }
  }, [pathname, hash, key]);

  return null;
}
