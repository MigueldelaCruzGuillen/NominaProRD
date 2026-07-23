import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
//import BusinessIcon from "@mui/icons-material/Business";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { useAuth } from "../../contexts/AuthContext";

type Page =
  | "dashboard"
  | "nominas"
  | "empleados"
  | "organización"
  | "asistencias"
  | "periodos"
  | "reportes"
  | "configuracion"
  | "auditoria"
  | "usuarios";  // ✅ Agregado

type Props = {
  collapsed: boolean;
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

const menu = [
  { text: "Dashboard", page: "dashboard" as const, icon: <DashboardIcon /> },
  { text: "Nóminas", page: "nominas" as const, icon: <PaymentsIcon /> },
  { text: "Empleados", page: "empleados" as const, icon: <PeopleIcon /> },
  { text: "Organización", page: "organización" as const, icon: <AccountTreeIcon />, adminOnly: true },
  { text: "Asistencias", page: "asistencias" as const, icon: <AccessTimeIcon /> },
  { text: "Períodos", page: "periodos" as const, icon: <CalendarMonthIcon /> },
  { text: "Reportes", page: "reportes" as const, icon: <AssessmentIcon /> },
  { text: "Usuarios", page: "usuarios" as const, icon: <ManageAccountsIcon />, adminOnly: true },  // ✅ Agregado
  { text: "Configuración", page: "configuracion" as const, icon: <SettingsIcon /> },
  { text: "Auditoría", page: "auditoria" as const, icon: <HistoryIcon />, adminOnly: true },
];

export function Sidebar({ collapsed, currentPage, onNavigate }: Props) {
  const { hasRole } = useAuth();

  return (
    <Box
      sx={{
        width: collapsed ? 80 : 260,
        transition: "width 0.2s ease",
        bgcolor: "#0f172a",
        color: "#fff",
        minHeight: "100vh",
        p: 2,
      }}
    >
      {!collapsed && (
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
          NominaPro RD
        </Typography>
      )}

      <List>
        {menu
          .filter((item) => !item.adminOnly || hasRole("Administrador"))
          .map((item) => (
            <ListItemButton
              key={item.text}
              selected={currentPage === item.page}
              onClick={() => onNavigate(item.page)}
              sx={{
                borderRadius: 2,
                mb: 1,
                "&.Mui-selected": {
                  bgcolor: "rgba(255,255,255,0.14)",
                },
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#cbd5e1" }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          ))}
      </List>
    </Box>
  );
}