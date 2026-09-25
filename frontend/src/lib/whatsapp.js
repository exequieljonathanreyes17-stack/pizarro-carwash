const NUMERO_WHATSAPP = "5493804111152";

export function linkWhatsApp(mensaje) {
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

export function mensajeConsultaServicio(servicio) {
  const lineas = [
    "Hola, me interesa este servicio.",
    "",
    `*${servicio.nombre}*`,
  ];
  if (servicio.precioDesde) {
    lineas.push(`*Precio desde:* $${Number(servicio.precioDesde).toLocaleString("es-AR")}`);
  }
  lineas.push(`*Consulta desde:* pizarrocarwash.com`);
  return lineas.join("\n");
}

export function mensajeConsultaProducto(producto) {
  const lineas = [
    "Hola, me interesa este producto.",
    "",
    `*${producto.nombre}*`,
    `*Precio:* $${Number(producto.precio).toLocaleString("es-AR")}`,
    `*Consulta desde:* pizarrocarwash.com`,
  ];
  return lineas.join("\n");
}
