import { api } from "./api";
import type { Departamento } from "../types/departamento";


export type CreateDepartamentoRequest = {
  nombre: string;
  descripcion?: string;
};

export type UpdateDepartamentoRequest = {
  nombre: string;
  descripcion?: string;
};

export async function getDepartamentos(): Promise<Departamento[]> {
  const response = await api.get<Departamento[]>("/departamentos");
  return response.data;
}

export async function createDepartamento(
  data: CreateDepartamentoRequest
): Promise<Departamento> {
  const response = await api.post<Departamento>("/departamentos", data);
  return response.data;
}

export async function updateDepartamento(
  id: string,
  data: UpdateDepartamentoRequest
): Promise<Departamento> {
  const response = await api.put<Departamento>(
    `/departamentos/${id}`,
    data
  );

  return response.data;
}

export async function desactivarDepartamento(
  id: string
): Promise<void> {
  await api.delete(`/departamentos/${id}`);
}

export const deactivateDepartamento = async (
  id: string
): Promise<void> => {
  await api.patch(`/departamentos/${id}/desactivar`);
};

export const reactivateDepartamento = async (
  id: string
): Promise<void> => {
  await api.patch(`/departamentos/${id}/reactivar`);
};

