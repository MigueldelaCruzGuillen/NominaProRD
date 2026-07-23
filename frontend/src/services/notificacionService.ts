import { api } from "./api";

export type Notificacion = {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: "Info" | "Success" | "Warning" | "Error";
  leida: boolean;
  fecha: string;
  usuarioId: string | null;
};

export async function getNotificaciones(): Promise<Notificacion[]> {
  const response = await api.get<Notificacion[]>("/notificaciones");
  return response.data;
}

export async function marcarNotificacionLeida(id: string): Promise<void> {
  await api.put(`/notificaciones/${id}/leer`);
}

export async function marcarTodasLeidas(): Promise<void> {
  await api.put("/notificaciones/leer-todas");
}

export async function eliminarNotificacion(id: string): Promise<void> {
  await api.delete(`/notificaciones/${id}`);
}