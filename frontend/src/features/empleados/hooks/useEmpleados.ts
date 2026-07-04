import { useEffect, useState } from "react";
import type { Empleado } from "../../../types/empleado";
import { getEmpleados } from "../../../services/empleadoService";

export function useEmpleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);

  async function cargarEmpleados() {
    try {
      setLoading(true);
      const data = await getEmpleados();
      setEmpleados(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarEmpleados();
  }, []);

  return {
    empleados,
    setEmpleados,
    loading,
    cargarEmpleados,
  };
}