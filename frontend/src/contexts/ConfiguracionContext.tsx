import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getConfiguracionSistema,
  updateConfiguracionSistema,
  type ConfiguracionSistema,
} from "../services/configuracionService";

type ConfiguracionContextType = {
  configuracion: ConfiguracionSistema;
  loading: boolean;
  recargarConfiguracion: () => Promise<void>;
  guardarConfiguracion: (
    data: ConfiguracionSistema
  ) => Promise<ConfiguracionSistema>;
};

const valoresIniciales: ConfiguracionSistema = {
  idioma: "es-DO",
  zonaHoraria: "America/Santo_Domingo",
  formatoFecha: "dd/MM/yyyy",
  moneda: "DOP",
};

const ConfiguracionContext =
  createContext<ConfiguracionContextType | null>(null);

export function ConfiguracionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [configuracion, setConfiguracion] =
    useState<ConfiguracionSistema>(valoresIniciales);

  const [loading, setLoading] = useState(true);

  async function recargarConfiguracion() {
    try {
      const data = await getConfiguracionSistema();
      setConfiguracion(data);
    } catch (error) {
      console.error("No se pudo cargar la configuración:", error);
    } finally {
      setLoading(false);
    }
  }

  async function guardarConfiguracion(
    data: ConfiguracionSistema
  ): Promise<ConfiguracionSistema> {
    const actualizada = await updateConfiguracionSistema(data);
    setConfiguracion(actualizada);
    return actualizada;
  }

  useEffect(() => {
    recargarConfiguracion();
  }, []);

  return (
    <ConfiguracionContext.Provider
      value={{
        configuracion,
        loading,
        recargarConfiguracion,
        guardarConfiguracion,
      }}
    >
      {children}
    </ConfiguracionContext.Provider>
  );
}

export function useConfiguracion() {
  const context = useContext(ConfiguracionContext);

  if (!context) {
    throw new Error(
      "useConfiguracion debe usarse dentro de ConfiguracionProvider"
    );
  }

  return context;
}