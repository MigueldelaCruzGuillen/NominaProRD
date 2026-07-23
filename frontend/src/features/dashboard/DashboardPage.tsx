import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import Chip from "@mui/material/Chip";

import { getNominas, pagarNomina } from "../../services/nominaService";
import { getEmpleados } from "../../services/empleadoService";
import type { NominaResumen } from "../../types/nomina";
import type { Empleado } from "../../types/empleado";
import { getDepartamentos } from "../../services/departamentoService";
import type { Departamento } from "../../types/departamento";
import { getAuditorias, type Auditoria } from "../../services/auditoriaService";
import { getUsuarios } from "../../services/usuarioService";
import type { Usuario } from "../../types/usuario";
import { getPeriodosNomina } from "../../services/periodoNominaService";
import type { PeriodoNomina } from "../../types/periodoNomina";
import { formatCurrency } from "../../utils/formatCurrency";
import { getConfiguracionSistema } from "../../services/configuracionService";
import { DashboardStats } from "./components/DashboardStats";
import { DashboardStatsSkeleton } from "./components/DashboardStatsSkeleton";
import { DashboardCharts } from "./components/DashboardCharts";
import { DashboardChartsSkeleton } from "./components/DashboardChartsSkeleton";
import { DashboardRecentActivity } from "./components/DashboardRecentActivity";
import { DashboardAlerts } from "./components/DashboardAlerts";
import { DashboardUpcomingPayments } from "./components/DashboardUpcomingPayments";
import { DashboardQuickActions } from "./components/DashboardQuickActions";
import { DashboardWelcome } from "./components/DashboardWelcome";

type Props = {
  onNavigate: (
    page:
      | "dashboard"
      | "nominas"
      | "empleados"
      | "asistencias"
      | "periodos"
      | "reportes"
      | "configuracion"
      | "auditoria"
      | "usuarios"
  ) => void;
};

export function DashboardPage({ onNavigate }: Props) {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nominas, setNominas] = useState<NominaResumen[]>([]);
  const [periodos, setPeriodos] = useState<PeriodoNomina[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [configSistema, setConfigSistema] = useState({
    moneda: "DOP",
    idioma: "es-DO"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      getEmpleados(),
      getNominas(),
      getDepartamentos(),
      getPeriodosNomina(),
      getAuditorias(),
      getConfiguracionSistema(),
    ])
      .then(([empleadosData, nominasData, departamentosData, periodosData, auditoriasData, configData]) => {
        setEmpleados(empleadosData);
        setNominas(nominasData);
        setDepartamentos(departamentosData);
        setPeriodos(periodosData);
        setAuditorias(auditoriasData);
        setConfigSistema(configData);
      })
      .catch((error) => {
        console.error("Error cargando Dashboard:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ✅ Función para pagar una nómina
  async function handlePagarNomina(id: string) {
    await pagarNomina(id);
    const data = await getNominas();
    setNominas(data);
  }

  // Cálculos para las tarjetas
  const pendientes = nominas.filter((n) => n.estado !== "Pagada");

  // Cálculos para las alertas
  const empleadosInactivos = empleados.filter(
    (empleado) => empleado.estado === "Inactivo"
  ).length;

  const periodosAbiertos = periodos.filter(
    (periodo) => periodo.estado === "Abierto"
  ).length;

  const nominasPendientes = nominas.filter(
    (nomina) => nomina.estado === "Pendiente"
  ).length;

  // Datos para gráficos
  const gastoPorMes = periodos.map((periodo) => {
    const nominasPeriodo = nominas.filter(
      (n) => n.periodoNominaId === periodo.id
    );

    return {
      mes: periodo.nombre,
      total: nominasPeriodo.reduce(
        (acumulado, nomina) => acumulado + nomina.totalNeto,
        0
      ),
    };
  });

  // Dentro del componente, reemplaza la variable empleadosPorDepartamento:

const empleadosPorDepartamento = departamentos
  .map((departamento) => ({
    nombre: departamento.nombre,
    cantidad: empleados.filter(
      (empleado) =>
        empleado.departamentoId === departamento.id &&
        empleado.estado === "Activo"
    ).length,
  }))
  .filter((item) => item.cantidad > 0);

  // Obtener el nombre del usuario (asumiendo que viene de algún contexto)
  // Por ahora usamos un valor por defecto
  const usuarioNombre = "Administrador"; // TODO: Obtener del contexto de autenticación

  return (
    <Box>
      {/* Dashboard Welcome 
      <DashboardWelcome
        usuario={usuarioNombre}
        empleados={empleados.length}
        nominasPendientes={nominasPendientes}
        periodosAbiertos={periodosAbiertos}
      />*/}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>

        <Typography color="text.secondary">
          Resumen general de la empresa.
        </Typography>
      </Box>

      {/* Dashboard Stats */}
      {loading ? (
        <DashboardStatsSkeleton />
      ) : (
        <DashboardStats
          empleados={empleados.length}
          nominas={nominas.length}
          gastoMensual={nominas.reduce(
            (total, nomina) => total + nomina.totalNeto,
            0
          )}
          departamentos={departamentos.length}
        />
      )}

      {/* Dashboard Charts */}
      {loading ? (
        <DashboardChartsSkeleton />
      ) : (
        <DashboardCharts
          gastoPorMes={gastoPorMes}
          empleadosPorDepartamento={empleadosPorDepartamento}
        />
      )}

      {/* Dashboard Alerts */}
      <DashboardAlerts
        empleadosInactivos={empleadosInactivos}
        periodosAbiertos={periodosAbiertos}
        nominasPendientes={nominasPendientes}
      />

      {/* Dashboard Upcoming Payments */}
      <DashboardUpcomingPayments periodos={periodos} />

      {/* Dashboard Recent Activity */}
      <DashboardRecentActivity auditorias={auditorias} />

      {/* Bloque: Nóminas pendientes de pago */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Nóminas pendientes de pago
        </Typography>

        {pendientes.length === 0 ? (
          <Typography color="text.secondary">
            No hay nóminas pendientes.
          </Typography>
        ) : (
          pendientes.slice(0, 5).map((n) => (
            <Box
              key={n.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box>
                <Typography fontWeight={600}>
                  Nómina {n.id.slice(0, 8)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(n.fechaGeneracion).toLocaleDateString("es-DO")}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip
                  label={n.estado}
                  color="warning"
                  size="small"
                />

                <Typography fontWeight={700} color="warning.main">
                  {formatCurrency(n.totalNeto, configSistema.moneda, configSistema.idioma)}
                </Typography>

                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handlePagarNomina(n.id)}
                >
                  Pagar
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* Tercera fila: Últimas nóminas */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 3, mt: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Últimas nóminas
          </Typography>

          {nominas.slice(0, 5).map((n) => (
            <Box
              key={n.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 1.5,
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <Box>
                <Typography fontWeight={600}>
                  Nómina {n.id.slice(0, 8)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(n.fechaGeneracion).toLocaleDateString("es-DO")}
                </Typography>
              </Box>

              <Typography fontWeight={700}>
                {formatCurrency(n.totalNeto, configSistema.moneda, configSistema.idioma)}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>

      {/* Dashboard Quick Actions */}
      <DashboardQuickActions
        onNuevoEmpleado={() => onNavigate("empleados")}
        onNuevaNomina={() => onNavigate("nominas")}
        onEmpresa={() => onNavigate("configuracion")}
        onReportes={() => onNavigate("reportes")}
      />
    </Box>
  );
}