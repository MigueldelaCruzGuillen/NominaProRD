import { Box } from "@mui/material";
import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { NominasPage } from "../features/nominas/NominasPage";
import { EmpleadosPage } from "../features/empleados/EmpleadosPage";
import { OrganizacionPage } from "../features/organizacion/OrganizacionPage";
import { AsistenciasPage } from "../features/asistencias/AsistenciasPage";
import { PeriodosPage } from "../features/periodos/PeriodosPage";
import { ReportesPage } from "../features/reportes/ReportesPage";
import { ConfiguracionPage } from "../features/configuracion/ConfiguracionPage";
import { AuditoriaPage } from "../features/auditoria/AuditoriaPage";
import { UsuariosPage } from "../features/Usuarios/UsuariosPage";

// ✅ 1. Actualizar Props
type Props = {
  onLogout: () => void;
  onToggleTheme: () => void;
};

// ✅ 2. Actualizar el tipo de page para incluir "reportes"
export function AppLayout({ onLogout, onToggleTheme }: Props) {
 const [page, setPage] = useState<
  | "dashboard"
  | "nominas"
  | "empleados"
  | "organización"
  | "asistencias"
  | "periodos"
  | "reportes"
  | "configuracion"
  | "auditoria"
  | "usuarios"
>("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar
        collapsed={!sidebarOpen}
        currentPage={page}
        onNavigate={setPage}
      />

      <Box sx={{ flexGrow: 1 }}>
        <Topbar
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleTheme={onToggleTheme}
        />

        <Box component="main" sx={{ p: 3 }}>
          {page === "usuarios" && <UsuariosPage />}
          {page === "dashboard" && <DashboardPage onNavigate={setPage} />}
          {page === "nominas" && <NominasPage />}
          {page === "empleados" && <EmpleadosPage />}
          {page === "organización" && <OrganizacionPage />}
          {page === "asistencias" && <AsistenciasPage />}
          {page === "periodos" && <PeriodosPage />}
          {page === "reportes" && <ReportesPage />}
          {page === "configuracion" && <ConfiguracionPage />} 
          {page === "auditoria" && <AuditoriaPage />} 
        </Box>
      </Box>
    </Box>
  );
}