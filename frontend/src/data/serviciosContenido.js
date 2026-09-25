// Contenido ampliado por servicio, para las páginas de detalle.
// Se busca por nombre normalizado (slug). Si un servicio cargado desde el
// panel admin no tiene una coincidencia acá, se muestra con datos genéricos.
import { slugify } from "../lib/slug";

const CONTENIDO = {
  "lavado-tradicional": {
    resaltar: "carroceria",
    duracion: "30 a 45 minutos",
    incluye: [
      "Lavado exterior completo con productos específicos para pintura y plásticos.",
      "Secado prolijo con paños de microfibra para evitar marcas y rayas.",
      "Acondicionado de plásticos y cubiertas para un acabado parejo.",
      "Limpieza de vidrios exteriores.",
      "Repaso de llantas y zócalos.",
    ],
  },
  "lavado-vip": {
    resaltar: "carroceria",
    duracion: "45 a 60 minutos",
    incluye: [
      "Lavado exterior profundo, incluyendo zonas de difícil acceso.",
      "Limpieza detallada de llantas y detalles de carrocería.",
      "Desengrasado de rodados y pasarruedas.",
      "Aplicación de acondicionador en plásticos y cubiertas.",
      "Encerado premium: aporta brillo y protege la pintura del sol y la suciedad.",
    ],
  },
  "limpieza-de-interior": {
    resaltar: "interior",
    duracion: "40 a 60 minutos",
    incluye: [
      "Aspirado completo de piso, asientos y baúl.",
      "Limpieza de tablero, puertas, consola y volante con productos que nutren el plástico.",
      "Limpieza de vidrios interiores.",
      "Aplicación de ambientador.",
      "Repaso de zócalos, cinturones y rincones ocultos.",
    ],
  },
  "limpieza-de-tapizado-butacas": {
    resaltar: "interior",
    duracion: "1 a 2 horas según el estado del tapizado",
    incluye: [
      "Higienización profunda de butacas con máquina inyectora/extractora.",
      "Eliminación de manchas y olores incorporados en la tela o el cuero.",
      "Retiro de humedad acumulada.",
      "Cepillado de alfombras para remover suciedad adherida.",
      "Recuperación del aspecto original del tapizado.",
    ],
  },
  abrillantados: {
    resaltar: "carroceria",
    duracion: "1 a 2 horas según el estado de la pintura",
    incluye: [
      "Diagnóstico del estado de la pintura antes de empezar.",
      "Recuperación de brillo mediante pulido controlado.",
      "Eliminación de marcas superficiales y microrrayas leves.",
      "Aplicación de una capa protectora que facilita el lavado posterior.",
      "Terminación manual para un acabado parejo.",
    ],
  },
  "restauracion-de-opticas": {
    resaltar: "opticas",
    duracion: "30 a 45 minutos",
    incluye: [
      "Evaluación del nivel de opacidad y amarillamiento de las ópticas.",
      "Pulido progresivo para recuperar transparencia.",
      "Eliminación de rayas superficiales.",
      "Sellado protector para retrasar que vuelvan a opacarse.",
      "Mejora inmediata de la iluminación y de la estética del frente del vehículo.",
    ],
  },
};

export function obtenerContenidoServicio(nombre) {
  const clave = slugify(nombre);
  return (
    CONTENIDO[clave] || {
      resaltar: "carroceria",
      duracion: "A confirmar según el vehículo",
      incluye: [
        "Trabajo realizado con atención personalizada y productos de calidad.",
        "Cuidamos tu vehículo como si fuera el nuestro.",
      ],
    }
  );
}
