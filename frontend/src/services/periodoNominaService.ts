import { api } from "./api";
import type { PeriodoNomina } from "../types/periodoNomina";

export async function getPeriodosNomina(): Promise<PeriodoNomina[]> {
  const response = await api.get<PeriodoNomina[]>("/periodos-nomina");
  return response.data;
}