// Ilustración de auto de ejemplo (side view estilizado), usada como imagen
// de referencia en las páginas de detalle de servicios. No es una foto real:
// evita depender de fotos con derechos de autor y mantiene la estética del logo.
export default function AutoEjemplo({ className = "", resaltar = "carroceria" }) {
  const activo = "#2f8ff5";
  const inactivo = "#3a4250";

  const color = (zona) => (resaltar === zona || resaltar === "todo" ? activo : inactivo);

  return (
    <svg viewBox="0 0 640 300" className={className} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de auto de ejemplo">
      <defs>
        <linearGradient id="pisoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d4aa8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0d4aa8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Reflejo / piso */}
      <ellipse cx="320" cy="255" rx="260" ry="18" fill="url(#pisoGrad)" />

      {/* Carrocería */}
      <path
        d="M60 190 C60 160 90 150 120 148 L165 110 C180 96 205 88 235 88 L400 88 C430 88 455 98 470 118 L505 150 C545 154 575 165 585 190 L585 205 C585 214 578 220 568 220 L520 220 C520 198 502 180 480 180 C458 180 440 198 440 220 L215 220 C215 198 197 180 175 180 C153 180 135 198 135 220 L82 220 C70 220 60 214 60 205 Z"
        fill="none"
        stroke={color("carroceria")}
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* Vidrios */}
      <path
        d="M182 108 C192 100 210 94 232 94 L322 94 L322 148 L155 148 Z"
        fill={color("vidrios")}
        opacity="0.35"
      />
      <path d="M330 94 L398 94 C420 94 438 102 450 116 L468 148 L330 148 Z" fill={color("vidrios")} opacity="0.35" />

      {/* Óptica delantera */}
      <ellipse cx="565" cy="172" rx="14" ry="9" fill={color("opticas")} opacity="0.9" />
      {/* Óptica trasera */}
      <ellipse cx="82" cy="172" rx="10" ry="8" fill={color("opticas")} opacity="0.9" />

      {/* Ruedas */}
      <circle cx="175" cy="220" r="34" fill="#0a0d12" stroke={color("ruedas")} strokeWidth="6" />
      <circle cx="175" cy="220" r="12" fill={color("ruedas")} />
      <circle cx="480" cy="220" r="34" fill="#0a0d12" stroke={color("ruedas")} strokeWidth="6" />
      <circle cx="480" cy="220" r="12" fill={color("ruedas")} />

      {/* Línea de tapizado / interior (visible a través del vidrio) */}
      <path d="M200 140 L300 140" stroke={color("interior")} strokeWidth="4" strokeLinecap="round" opacity="0.8" />

      {/* Destellos de brillo */}
      <g opacity="0.9">
        <path d="M300 60 L305 72 L317 76 L305 80 L300 92 L295 80 L283 76 L295 72 Z" fill={activo} />
      </g>
    </svg>
  );
}
