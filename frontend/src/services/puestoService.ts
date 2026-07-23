import { api } from "./api";
import type { Puesto } from "../types/puesto";

export interface CreatePuestoRequest {
  nombre: string;
  descripcion?: string;
  empresaId: string;
  departamentoId: string;
}

export interface UpdatePuestoRequest {
  nombre: string;
  descripcion?: string;
  departamentoId: string;
}

export async function getPuestos(): Promise<Puesto[]> {
  const response = await api.get<Puesto[]>("/puestos");
  return response.data;
}

export async function createPuesto(
  data: CreatePuestoRequest
): Promise<Puesto> {
  const response = await api.post<Puesto>("/puestos", data);
  return response.data;
}

export async function updatePuesto(
  id: string,
  data: UpdatePuestoRequest
): Promise<Puesto> {
  const response = await api.put<Puesto>(`/puestos/${id}`, data);
  return response.data;
}

export async function deactivatePuesto(id: string): Promise<void> {
  await api.patch(`/puestos/${id}/desactivar`);
}

export async function reactivatePuesto(id: string): Promise<void> {
  await api.patch(`/puestos/${id}/reactivar`);
}