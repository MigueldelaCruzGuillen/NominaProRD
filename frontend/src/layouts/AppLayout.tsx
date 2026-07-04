import { Box } from "@mui/material";
import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { NominasPage } from "../features/nominas/NominasPage";
import { EmpleadosPage } from "../features/empleados/EmpleadosPage";
import { AsistenciasPage } from "../features/asistencias/AsistenciasPage";
import { PeriodosPage } from "../features/periodos/PeriodosPage";

// ✅ 1. Actualizar Props
type Props = {
  onLogout: () => void;
  onToggleTheme: () => void; // Agregar onToggleTheme
};

// ✅ 2. Actualizar la función
export function AppLayout({ onLogout, onToggleTheme }: Props) {
  const [page, setPage] = useState<
    "dashboard" | "nominas" | "empleados" | "asistencias" | "periodos"
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
        {/* ✅ 3. Pasar onToggleTheme al Topbar */}
        <Topbar
          onLogout={onLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleTheme={onToggleTheme}
        />

        <Box component="main" sx={{ p: 3 }}>
          {page === "dashboard" && <DashboardPage />}
          {page === "nominas" && <NominasPage />}
          {page === "empleados" && <EmpleadosPage />}
          {page === "asistencias" && <AsistenciasPage />}
          {page === "periodos" && <PeriodosPage />}
        </Box>
      </Box>
    </Box>
  );
}