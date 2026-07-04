import { api } from "./api";
import type { Puesto } from "../types/puesto";

export async function getPuestos(): Promise<Puesto[]> {
  const response = await api.get<Puesto[]>("/puestos");
  return response.data;
}