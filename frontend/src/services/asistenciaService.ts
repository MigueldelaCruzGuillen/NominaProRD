import { api } from "./api";
import type { Asistencia } from "../types/asistencia";

export async function getAsistenciasByEmpleado(empleadoId: string): Promise<Asistencia[]> {
  const response = await api.get<Asistencia[]>(`/asistencias/empleado/${empleadoId}`);
  return response.data;
}