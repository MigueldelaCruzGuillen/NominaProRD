import { api } from "./api";

export type Empresa = {
  id: string;
  nombre: string;
  rnc: string;
  direccion: string;
  telefono: string;
  correo: string;
  activa: boolean;
};

export async function getEmpresas(): Promise<Empresa[]> {
  const response = await api.get<Empresa[]>("/empresas");
  return response.data;
}

export async function updateEmpresa(id: string, data: Empresa): Promise<Empresa> {
  const response = await api.put<Empresa>(`/empresas/${id}`, data);
  return response.data;
}