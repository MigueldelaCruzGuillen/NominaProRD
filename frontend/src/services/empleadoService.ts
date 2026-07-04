import { api } from "./api";
import type { Empleado } from "../types/empleado";


export type CreateEmpleadoRequest = {
  nombre: string;
  apellido: string;
  cedula: string;
  fechaNacimiento: string;
  telefono: string;
  correo: string;
  direccion: string;
  fechaIngreso: string;
  salarioBase: number;
  tipoContrato: string;
  empresaId: string;
  departamentoId: string;
  puestoId: string;
};

export async function getEmpleados(): Promise<Empleado[]> {
  const response = await api.get<Empleado[]>("/empleados");
  return response.data;
}

export async function createEmpleado(data: CreateEmpleadoRequest): Promise<Empleado> {
  const response = await api.post<Empleado>("/empleados", data);
  return response.data;
}

export async function getEmpleadoById(id: string): Promise<Empleado> {
  const response = await api.get<Empleado>(`/empleados/${id}`);
  return response.data;
}

export async function updateEmpleado(
  id: string,
  data: CreateEmpleadoRequest
): Promise<Empleado> {
  const response = await api.put<Empleado>(`/empleados/${id}`, data);
  return response.data;
}

export async function deleteEmpleado(id: string): Promise<void> {
  await api.delete(`/empleados/${id}`);
}

