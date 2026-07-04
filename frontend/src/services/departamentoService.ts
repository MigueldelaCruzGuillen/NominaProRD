import { api } from "./api";
import type { Departamento } from "../types/departamento";

export async function getDepartamentos(): Promise<Departamento[]> {
  const response = await api.get<Departamento[]>("/departamentos");
  return response.data;
}