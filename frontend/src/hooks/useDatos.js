import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .get("/servicios")
      .then((data) => {
        if (Array.isArray(data)) setServicios(data);
        else setServicios([]);
      })
      .catch(() => setServicios([]))
      .finally(() => setCargando(false));
  }, []);

  return { servicios, cargando };
}

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .get("/productos")
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setCargando(false));
  }, []);

  return { productos, cargando };
}

export function useResultados() {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .get("/resultados")
      .then(setResultados)
      .catch(() => setResultados([]))
      .finally(() => setCargando(false));
  }, []);

  return { resultados, cargando };
}

const CERTIFICACION_EJEMPLO = [
  {
    id: "ej1",
    nombreEmpleado: "Nuestro especialista en detailing",
    titulo: "Capacitación en Pulido y Detailing Automotriz",
    institucion: "Academia de capacitación certificada",
    descripcion: "Certificación que respalda la calidad de nuestros trabajos de pulido y abrillantado.",
    imagenUrl: null,
  },
];

export function useCertificaciones() {
  const [certificaciones, setCertificaciones] = useState(CERTIFICACION_EJEMPLO);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .get("/certificaciones")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCertificaciones(data);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  return { certificaciones, cargando };
}
