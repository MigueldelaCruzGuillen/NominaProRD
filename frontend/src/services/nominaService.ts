import { api } from "./api";
import type { Nomina, NominaResumen } from "../types/nomina";

export async function getNominas(): Promise<NominaResumen[]> {
  const response = await api.get<NominaResumen[]>("/nominas");
  return response.data;
}

export async function pagarNomina(id: string) {
  const response = await api.put(`/nominas/${id}/pagar`);
  return response.data;
}

export async function getNominaById(id: string): Promise<Nomina> {
  const response = await api.get<Nomina>(`/nominas/${id}`);
  return response.data;
}

export async function descargarReciboPdf(
  nominaId: string,
  empleadoId: string
) {
  const response = await api.get(
    `/nominas/${nominaId}/recibo/${empleadoId}`,
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", `recibo-${empleadoId}.pdf`);
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}