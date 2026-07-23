import { api } from "./api";
import type {
  Usuario,
  CreateUsuarioRequest,
  UpdateUsuarioRequest,
} from "../types/usuario";

export async function getUsuarios(): Promise<Usuario[]> {
  const response = await api.get<Usuario[]>("/usuarios");
  return response.data;
}

export async function createUsuario(
  data: CreateUsuarioRequest
): Promise<Usuario> {
  const response = await api.post<Usuario>("/usuarios", data);
  return response.data;
}

export async function updateUsuario(
  id: string,
  data: UpdateUsuarioRequest
): Promise<Usuario> {
  const response = await api.put<Usuario>(`/usuarios/${id}`, data);
  return response.data;
}

export async function desactivarUsuario(id: string): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}

export async function cambiarPasswordUsuario(
  id: string,
  nuevaPassword: string
): Promise<void> {
  await api.put(`/usuarios/${id}/password`, {
    nuevaPassword,
  });
}

export async function cambiarMiPassword(
  passwordActual: string,
  nuevaPassword: string
): Promise<void> {
  await api.put("/usuarios/mi-password", {
    passwordActual,
    nuevaPassword,
  });
}

export async function actualizarMiPerfil(
  nombre: string
): Promise<Usuario> {
  const response = await api.put<Usuario>("/usuarios/mi-perfil", {
    nombre,
  });

  return response.data;
}