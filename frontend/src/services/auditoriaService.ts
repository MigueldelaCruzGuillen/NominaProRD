import { api } from "./api";

export type Auditoria = {
  id: string;
  usuarioId: string;
  usuario: string;
  modulo: string;
  accion: string;
  descripcion: string;
  fecha: string;
  ip: string | null;
};

export async function getAuditorias(): Promise<Auditoria[]> {
  const response = await api.get<Auditoria[]>("/auditorias");
  return response.data;
}