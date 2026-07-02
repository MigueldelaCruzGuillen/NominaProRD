import { api } from "./api";
import type { NominaResumen } from "../types/nomina";

export async function getNominas(): Promise<NominaResumen[]> {
  const response = await api.get<NominaResumen[]>("/nominas");
  return response.data;
}

export async function pagarNomina(id: string) {
  const response = await api.put(`/nominas/${id}/pagar`);
  return response.data;
}