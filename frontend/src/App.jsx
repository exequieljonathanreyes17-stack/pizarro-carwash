import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import ServiciosPage from "./pages/ServiciosPage.jsx";
import ServicioDetallePage from "./pages/ServicioDetallePage.jsx";
import ProductosPage from "./pages/ProductosPage.jsx";
import ResultadosPage from "./pages/ResultadosPage.jsx";
import ContactoPage from "./pages/ContactoPage.jsx";
import Login from "./pages/admin/Login.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Panel from "./pages/admin/Panel.jsx";
import AdminProductos from "./pages/admin/AdminProductos.jsx";
import AdminServicios from "./pages/admin/AdminServicios.jsx";
import AdminCertificaciones from "./pages/admin/AdminCertificaciones.jsx";
import AdminMarcas from "./pages/admin/AdminMarcas.jsx";
import AdminResenas from "./pages/admin/AdminResenas.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/servicios" element={<ServiciosPage />} />
      <Route path="/servicios/:slug" element={<ServicioDetallePage />} />
      <Route path="/productos" element={<ProductosPage />} />
      <Route path="/resultados" element={<ResultadosPage />} />
      <Route path="/contacto" element={<ContactoPage />} />

      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <RutaProtegida>
            <AdminLayout />
          </RutaProtegida>
        }
      >
        <Route index element={<Panel />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="servicios" element={<AdminServicios />} />
        <Route path="certificaciones" element={<AdminCertificaciones />} />
        <Route path="marcas" element={<AdminMarcas />} />
        <Route path="resenas" element={<AdminResenas />} />
      </Route>
    </Routes>
    </>
  );
}
