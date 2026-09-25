# Pizarro Carwash — Sitio web + Panel de administrador

Sistema completo para Pizarro Carwash: sitio web público (React + TailwindCSS,
con páginas propias para servicios, productos y resultados) y API/backend
(Express + Prisma, listo para MySQL) con panel de administrador para cargar
productos, servicios, certificaciones, marcas y moderar reseñas.

## Estructura del proyecto

```
pizarro-carwash/
├── backend/     API REST (Express + Prisma + MySQL)
└── frontend/    Sitio web + panel admin (React + Vite + Tailwind)
```

## 1. Requisitos previos

- Node.js 18 o superior
- Un servidor MySQL (local, Docker, o un servicio como Railway/PlanetScale)
- npm (viene con Node.js)

## 2. Poner en marcha el backend

```bash
cd backend
npm install
cp .env.example .env
```

Editá el archivo `.env` y completá `DATABASE_URL` con los datos de tu MySQL, por ejemplo:

```
DATABASE_URL="mysql://root:tu_password@localhost:3306/pizarro_carwash"
JWT_SECRET="una-clave-larga-y-aleatoria"
PORT=4000
```

> Si no tenés MySQL instalado, la forma más rápida es levantar uno con Docker:
> ```bash
> docker run --name pizarro-mysql -e MYSQL_ROOT_PASSWORD=tu_password \
>   -e MYSQL_DATABASE=pizarro_carwash -p 3306:3306 -d mysql:8
> ```

Con la base ya accesible, creá las tablas y cargá los datos iniciales:

```bash
npm run prisma:migrate     # crea las tablas en MySQL (te va a pedir un nombre, ej: "init")
npm run seed                # carga servicios, reseñas, marcas y el usuario admin de ejemplo
npm run dev                  # levanta la API en http://localhost:4000
```

**Usuario admin creado por el seed:**
- Email: `admin@pizarrocarwash.com`
- Contraseña: `pizarro2026`

**Importante:** cambiá esa contraseña apenas puedas (podés actualizarla
directamente en la base con Prisma Studio: `npm run prisma:studio`).

## 3. Poner en marcha el frontend

En otra terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

El sitio va a estar disponible en `http://localhost:5173`. Durante el
desarrollo, Vite redirige automáticamente las peticiones `/api` y `/uploads`
hacia el backend (`http://localhost:4000`), así que no hace falta configurar
nada más.

- Sitio público: `http://localhost:5173`
- Panel admin: `http://localhost:5173/admin/login`

## 4. Cómo está organizado el sitio

- **Inicio (`/`)**: carrusel a pantalla completa, sección "Quiénes somos"
  completa, un adelanto de 3 servicios (el marcado como "más vendido" +
  los 2 mejor calificados), un adelanto de 3 productos + las marcas con las
  que trabaja el lavadero, el resultado más reciente, certificaciones y la
  sección de contacto.
- **`/servicios`**: listado completo de todos los servicios.
- **`/servicios/:slug`**: detalle completo de un servicio — qué incluye,
  duración estimada, reseñas de clientes, formulario para dejar una reseña
  nueva y botón para consultar por WhatsApp.
- **`/productos`**: listado completo de productos, con filtro por categoría
  (auto, moto, ambos, accesorios, etc., según lo que cargues).
- **`/resultados`**: galería completa de trabajos antes/después, con vista
  ampliada al hacer clic.
- **`/contacto`**: mapa de ubicación + dirección, horarios, teléfono/WhatsApp
  e Instagram (sin formulario de mensaje).

## 5. Cómo se administra el contenido

Desde `/admin/login`, con el usuario del seed, podés:

- **Productos**: cargar nombre, descripción, precio, categoría, imagen y
  marcarlos como destacados.
- **Servicios**: editar los servicios, su precio "desde", a qué vehículo
  aplican y marcar cuál es el "más vendido" (aparece primero en el inicio).
- **Certificaciones**: cargar las capacitaciones y certificados del personal
  (por ejemplo, la capacitación en pulido y detailing).
- **Marcas**: cargar el nombre y logo de las marcas con las que trabaja el
  lavadero. Se muestran en el inicio, debajo de productos.
- **Reseñas**: moderar (eliminar si hace falta) las reseñas que dejan los
  clientes en cada servicio.

Todo lo que cargues ahí se refleja al instante en la web pública (recargando
la página), sin tocar código.

## 6. Reseñas y botón "Consultar" por WhatsApp

- Cualquier visitante puede dejar una reseña (nombre, estrellas y comentario)
  desde la página de detalle de un servicio. Se publican de inmediato; los 3
  servicios del inicio se eligen así: primero el marcado como "más vendido"
  desde el admin, y los otros dos por promedio de estrellas.
- Cada servicio y cada producto tienen un botón **Consultar** que abre
  WhatsApp (al 3804-111152) con un mensaje predefinido, incluyendo el nombre
  y precio de lo consultado.

## 7. Datos de contacto a revisar antes de publicar

La sección de Contacto usa estos valores de partida en
`frontend/src/components/Contacto.jsx` — **reemplazalos por los reales**:

- **Dirección**: se usó `"Barrio Alunai, Zona Oeste, La Rioja, Argentina"`
  como texto de búsqueda para el mapa. Si tenés la dirección exacta o el
  link de Google Maps del local, actualizá la constante `DIRECCION` (y de
  ser necesario `MAPA_SRC`) para que el pin sea preciso.
- **Horarios**: se dejó como "Consultá disponibilidad de turnos por
  WhatsApp" porque no se indicó un horario fijo. Reemplazalo si tenés uno.
- **Instagram**: se usó `@pizarrocarwash` como usuario de ejemplo.
  Reemplazalo por el usuario real de Instagram del lavadero.

## 8. Llevar esto a producción

1. **Base de datos:** contratá un MySQL en un proveedor (Railway, PlanetScale,
   Hostinger, etc.) y actualizá `DATABASE_URL` en el `.env` del backend.
2. **Backend:** desplegalo en un servicio que soporte Node.js (Railway,
   Render, un VPS, etc.). Corré `npm run prisma:migrate deploy` y `npm run seed`
   una sola vez contra la base de producción.
3. **Frontend:** corré `npm run build` dentro de `frontend/` y subí la carpeta
   `dist/` a cualquier hosting estático (Vercel, Netlify, Hostinger, etc.).
   Configurá `VITE_API_URL` y `VITE_API_HOST` en el `.env` de producción
   apuntando a la URL pública de tu backend.
4. **Imágenes subidas:** el backend las guarda en `backend/uploads/`. En
   producción asegurate de que esa carpeta persista entre despliegues (o
   migrá a un storage como S3/Cloudinary si el hosting no persiste archivos).

## 9. Notas sobre el diseño

- Colores y tipografía tomados del logo real de Pizarro Carwash: fondo negro,
  "PIZARRO" en efecto cromado/plateado y "CARWASH" en azul eléctrico con
  brillo neón.
- El carrusel del inicio usa ilustraciones propias (no fotos con derechos de
  autor de terceros); se pueden reemplazar por fotos reales de trabajos del
  lavadero subiendo imágenes al proyecto y ajustando `HeroCarousel.jsx`.
- El sitio es responsive: se probó el layout para mobile, tablet y desktop.
- Se respeta `prefers-reduced-motion` para las animaciones.

## 10. Alcance de los servicios (según lo indicado)

El sitio y el seed reflejan únicamente los servicios que ofrece el lavadero:
lavado tradicional, lavado VIP, limpieza de interior, limpieza de tapizado/
butacas, abrillantados y restauración de ópticas — **no** se incluyó lavado
de motor ni de chasis.
