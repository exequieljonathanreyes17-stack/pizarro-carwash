import {
  Droplets,
  Sparkles,
  CarFront,
  Car,
  Truck,
  Bike,
  Sofa,
  Star,
  Lightbulb,
  Wrench,
  ShieldCheck,
  Disc,
  SprayCan,
  Brush,
  Wind,
  Gauge,
  Layers,
  Sun,
  Gem,
} from "lucide-react";

export const ICONOS_SERVICIOS = {
  droplets: Droplets,
  sparkles: Sparkles,
  "car-front": CarFront,
  car: Car,
  truck: Truck,
  bike: Bike,
  sofa: Sofa,
  star: Star,
  lightbulb: Lightbulb,
  "shield-check": ShieldCheck,
  disc: Disc,
  "spray-can": SprayCan,
  brush: Brush,
  wind: Wind,
  gauge: Gauge,
  layers: Layers,
  sun: Sun,
  gem: Gem,
  wrench: Wrench,
};

export const OPCIONES_ICONOS_SERVICIOS = [
  { valor: "sparkles", label: "✨ Brillo y Detailing (Sparkles)" },
  { valor: "droplets", label: "💧 Lavado y Espuma (Droplets)" },
  { valor: "car-front", label: "🚘 Frente de auto / Carrocería (Car Front)" },
  { valor: "car", label: "🚗 Automóviles y Sedanes (Car)" },
  { valor: "truck", label: "🛻 Camionetas, Pickups y 4x4 (Truck)" },
  { valor: "bike", label: "🏍️ Motos y Cuatriciclos (Bike)" },
  { valor: "sofa", label: "🛋️ Limpieza de Tapizados y Butacas (Sofa)" },
  { valor: "disc", label: "🔘 Llantas, Frenos y Rodados (Disc)" },
  { valor: "lightbulb", label: "💡 Restauración de Ópticas y Faros (Lightbulb)" },
  { valor: "spray-can", label: "🧴 Encerado y Acondicionador (Spray)" },
  { valor: "layers", label: "🧱 Tratamiento Multicapa / Acrílico (Layers)" },
  { valor: "gauge", label: "🏎️ Limpieza de Motor y Chasis (Gauge)" },
  { valor: "star", label: "⭐ Servicio VIP / Más Elegido (Star)" },
  { valor: "wrench", label: "🔧 Mantenimiento General (Wrench)" },
];

export function obtenerComponenteIcono(nombreIcono) {
  return ICONOS_SERVICIOS[nombreIcono] || Wrench;
}
