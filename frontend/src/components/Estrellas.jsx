import { Star } from "lucide-react";

export default function Estrellas({ valor = 0, tamano = 16, interactivo = false, onChange }) {
  const items = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {items.map((n) => {
        const lleno = n <= Math.round(valor);
        return (
          <button
            key={n}
            type={interactivo ? "button" : undefined}
            disabled={!interactivo}
            onClick={interactivo ? () => onChange?.(n) : undefined}
            className={interactivo ? "cursor-pointer" : "cursor-default"}
            aria-label={interactivo ? `Calificar con ${n} estrellas` : undefined}
          >
            <Star
              size={tamano}
              className={lleno ? "fill-electric-400 text-electric-400" : "text-chrome-400/40"}
            />
          </button>
        );
      })}
    </div>
  );
}
