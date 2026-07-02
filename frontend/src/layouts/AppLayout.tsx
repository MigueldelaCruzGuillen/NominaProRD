import { Box } from "@mui/material";
import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { NominasPage } from "../features/nominas/NominasPage";
import { EmpleadosPage } from "../features/empleados/EmpleadosPage";
import { AsistenciasPage } from "../features/asistencias/AsistenciasPage";
import { PeriodosPage } from "../features/periodos/PeriodosPage";

type Props = {
  onLogout: () => void;
};

export function AppLayout({ onLogout }: Props) {
  const [page, setPage] = useState<
  "dashboard" | "nominas" | "empleados" | "asistencias" | "periodos"
>("dashboard");
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar onNavigate={setPage} />

      <Box sx={{ flexGrow: 1 }}>
        <Topbar onLogout={onLogout} />

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