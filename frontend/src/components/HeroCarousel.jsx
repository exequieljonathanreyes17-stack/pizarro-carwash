import { useEffect, useState } from "react";
import { ShieldCheck, Sparkles, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { 
    imagen: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", 
    alt: "Lavado exterior premium" 
  },
  { 
    imagen: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", 
    alt: "Detailing y abrillantado" 
  },
  { 
    imagen: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", 
    alt: "Interior limpio y deportivo" 
  },
];

const INTERVALO = 6000;

export default function HeroCarousel() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndice((i) => (i + 1) % SLIDES.length);
    }, INTERVALO);
    return () => clearInterval(id);
  }, []);

  function anterior() {
    setIndice((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }
  function siguiente() {
    setIndice((i) => (i + 1) % SLIDES.length);
  }

  return (
    <section id="inicio" className="relative flex h-screen min-h-[640px] items-center overflow-hidden">
      {/* Slides de fondo */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === indice ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.imagen}
            alt={slide.alt}
            className="absolute inset-0 h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          {/* Capas de oscurecimiento para asegurar la legibilidad del texto */}
          <div className="absolute inset-0 bg-carbon-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-950/50 via-transparent to-carbon-950/50" />
        </div>
      ))}

      {/* Resplandores fijos */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-electric-600/20 blur-[140px]" />

      {/* Texto y botones superpuestos, fijos sobre el carrusel */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8">
        <span className="section-eyebrow">CUIDAMOS TU VEHÍCULO COMO SI FUERA EL NUESTRO</span>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
          <span className="text-chrome">DEVOLVÉ EL</span>
          <br />
          <span className="text-electric">BRILLO Y LA PROTECCIÓN</span>
          <br />
          <span className="text-chrome">A TU VEHÍCULO</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base text-chrome-300 md:text-lg">
          Lavado, detailing y abrillantado profesional para autos y motos. Atención
          personalizada, trabajo por turnos y productos de calidad.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="https://wa.me/5493804111152" target="_blank" rel="noreferrer" className="btn-primary">
            Reservá tu turno
          </a>
          <a href="#servicios-preview" className="btn-secondary">
            Ver servicios
          </a>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 border-t border-chrome-400/10 pt-6">
          <span className="flex items-center gap-2 text-xs font-semibold text-chrome-300 sm:text-sm">
            <ShieldCheck className="text-electric-400" size={20} /> Productos de calidad
          </span>
          <span className="flex items-center gap-2 text-xs font-semibold text-chrome-300 sm:text-sm">
            <Sparkles className="text-electric-400" size={20} /> Atención personalizada
          </span>
          <span className="flex items-center gap-2 text-xs font-semibold text-chrome-300 sm:text-sm">
            <Clock className="text-electric-400" size={20} /> Trabajo por turnos
          </span>
        </div>
      </div>

      {/* Controles del carrusel */}
      <button
        onClick={anterior}
        aria-label="Slide anterior"
        className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-carbon-950/50 p-2 text-chrome-200 backdrop-blur-sm transition-colors hover:text-electric-400 sm:block"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={siguiente}
        aria-label="Slide siguiente"
        className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-carbon-950/50 p-2 text-chrome-200 backdrop-blur-sm transition-colors hover:text-electric-400 sm:block"
      >
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndice(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === indice ? "w-6 bg-electric-400" : "w-2 bg-chrome-400/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
