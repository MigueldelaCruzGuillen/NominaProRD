import { api } from "./api";

export type ConfiguracionNomina = {
  porcentajeAfp: number;
  porcentajeSfs: number;
  aplicarIsr: boolean;
  diaPago: number;
  decimales: number;
};

export async function getConfiguracionNomina(): Promise<ConfiguracionNomina> {
  const response = await api.get<ConfiguracionNomina>(
    "/configuracion-nomina"
  );

  return response.data;
}

export async function updateConfiguracionNomina(
  data: ConfiguracionNomina
): Promise<ConfiguracionNomina> {
  const response = await api.put<ConfiguracionNomina>(
    "/configuracion-nomina",
    data
  );

  return response.data;
}