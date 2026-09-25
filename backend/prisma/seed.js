const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("pizarro2026", 10);
  await prisma.usuario.upsert({
    where: { email: "admin@pizarrocarwash.com" },
    update: {},
    create: {
      nombre: "Administrador Pizarro Carwash",
      email: "admin@pizarrocarwash.com",
      password: passwordHash,
    },
  });

  const servicios = [
    {
      nombre: "Lavado Tradicional",
      descripcion: "Lavado exterior completo con secado en microfibra y acondicionado de plásticos y cubiertas.",
      tipoVehiculo: "AMBOS",
      precioDesde: 8000,
      icono: "droplets",
      orden: 1,
    },
    {
      nombre: "Lavado VIP",
      descripcion: "Lavado profundo, limpieza de llantas y detalles, desengrasado, acondicionador y encerado premium.",
      tipoVehiculo: "AMBOS",
      precioDesde: 15000,
      icono: "sparkles",
      orden: 2,
      masVendido: true,
    },
    {
      nombre: "Limpieza de Interior",
      descripcion: "Aspirado e higienización profunda del habitáculo, tablero, puertas y consola.",
      tipoVehiculo: "AMBOS",
      precioDesde: null,
      icono: "car-front",
      orden: 3,
    },
    {
      nombre: "Limpieza de Tapizado / Butacas",
      descripcion: "Higienización profunda con máquina, eliminación de manchas y olores, recuperando el aspecto original de las butacas.",
      tipoVehiculo: "AMBOS",
      precioDesde: 70000,
      icono: "sofa",
      orden: 4,
    },
    {
      nombre: "Abrillantados",
      descripcion: "Recuperación de brillo y eliminación de marcas superficiales en la pintura.",
      tipoVehiculo: "AMBOS",
      precioDesde: 40000,
      icono: "star",
      orden: 5,
    },
    {
      nombre: "Restauración de Ópticas",
      descripcion: "Pulido y restauración de faros opacos o amarillentos, devolviendo transparencia y luminosidad.",
      tipoVehiculo: "AMBOS",
      precioDesde: null,
      icono: "lightbulb",
      orden: 6,
    },
  ];

  const serviciosCreados = [];
  for (const s of servicios) {
    const creado = await prisma.servicio.create({ data: s });
    serviciosCreados.push(creado);
  }

  // Reseñas de ejemplo (para que el sistema de estrellas tenga datos al arrancar)
  const vip = serviciosCreados.find((s) => s.nombre === "Lavado VIP");
  const opticas = serviciosCreados.find((s) => s.nombre === "Restauración de Ópticas");
  if (vip) {
    await prisma.resena.createMany({
      data: [
        { servicioId: vip.id, nombreCliente: "Cliente de ejemplo", calificacion: 5, comentario: "Excelente atención y terminación, quedó impecable." },
        { servicioId: vip.id, nombreCliente: "Cliente de ejemplo", calificacion: 4, comentario: "Muy buen trabajo, cumplieron con el horario del turno." },
      ],
    });
  }
  if (opticas) {
    await prisma.resena.create({
      data: { servicioId: opticas.id, nombreCliente: "Cliente de ejemplo", calificacion: 5, comentario: "Las ópticas quedaron como nuevas, se nota la diferencia de noche." },
    });
  }

  await prisma.certificacion.create({
    data: {
      nombreEmpleado: "Nombre del especialista",
      titulo: "Capacitación en Pulido y Detailing Automotriz",
      institucion: "Institución / academia de capacitación",
      descripcion: "Certificación que respalda la calidad de nuestros trabajos de pulido y abrillantado.",
      orden: 1,
    },
  });

  // Marcas de ejemplo: reemplazar por las marcas reales con las que trabaja el lavadero desde el panel admin
  await prisma.marca.createMany({
    data: [
      { nombre: "Marca 1", orden: 1 },
      { nombre: "Marca 2", orden: 2 },
      { nombre: "Marca 3", orden: 3 },
      { nombre: "Marca 4", orden: 4 },
    ],
  });

  console.log("Seed completado. Usuario admin: admin@pizarrocarwash.com / pizarro2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
