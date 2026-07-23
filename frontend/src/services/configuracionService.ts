import { api } from "./api";

export type ConfiguracionSistema = {
  idioma: string;
  zonaHoraria: string;
  formatoFecha: string;
  moneda: string;
};

export async function getConfiguracionSistema(): Promise<ConfiguracionSistema> {
  const response = await api.get<ConfiguracionSistema>("/configuracion");
  return response.data;
}

export async function updateConfiguracionSistema(
  data: ConfiguracionSistema
): Promise<ConfiguracionSistema> {
  const response = await api.put<ConfiguracionSistema>(
    "/configuracion",
    data
  );

  return response.data;
}