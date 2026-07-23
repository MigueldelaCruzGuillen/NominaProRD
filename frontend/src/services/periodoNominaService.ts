import { api } from "./api";
import type { PeriodoNomina } from "../types/periodoNomina";

export async function getPeriodosNomina(): Promise<PeriodoNomina[]> {
  const response = await api.get<PeriodoNomina[]>("/periodos-nomina");
  return response.data;
}
export type CreatePeriodoNominaRequest = {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  tipo: string;
};

export async function createPeriodoNomina(
  data: CreatePeriodoNominaRequest
): Promise<PeriodoNomina> {
  const response = await api.post<PeriodoNomina>("/periodos-nomina", data);
  return response.data;
}
export async function cerrarPeriodo(id: string): Promise<PeriodoNomina> {
  const response = await api.put<PeriodoNomina>(
    `/periodos-nomina/${id}/cerrar`
  );

  return response.data;
}