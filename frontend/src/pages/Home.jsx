import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import HeroCarousel from "../components/HeroCarousel.jsx";
import Nosotros from "../components/Nosotros.jsx";
import ServiciosPreview from "../components/ServiciosPreview.jsx";
import ProductosPreview from "../components/ProductosPreview.jsx";
import ResultadosPreview from "../components/ResultadosPreview.jsx";
import Certificaciones from "../components/Certificaciones.jsx";
import Contacto from "../components/Contacto.jsx";

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [hash]);

  return (
    <Layout>
      <HeroCarousel />
      <Nosotros />
      <ServiciosPreview />
      <ProductosPreview />
      <ResultadosPreview />
      <Certificaciones />
      <Contacto />
    </Layout>
  );
}
