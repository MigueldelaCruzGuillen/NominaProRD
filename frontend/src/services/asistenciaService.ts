import {api} from "./api";
import type { Asistencia } from "../types/asistencia";

export interface CreateAsistenciaManualRequest {
  empleadoId: string;
  horaEntrada: string;
  horaSalida: string;
}

export async function getAsistencias(): Promise<Asistencia[]> {
  const response = await api.get<Asistencia[]>("/asistencias");
  return response.data;
}

export async function getAsistenciasByEmpleado(
  empleadoId: string
): Promise<Asistencia[]> {
  const response = await api.get<Asistencia[]>(
    `/asistencias/empleado/${empleadoId}`
  );

  return response.data;
}

export async function createAsistenciaManual(
  data: CreateAsistenciaManualRequest
): Promise<Asistencia> {
  const response = await api.post<Asistencia>(
    "/asistencias/manual",
    data
  );

  return response.data;
}