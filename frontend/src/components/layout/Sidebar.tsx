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
import BusinessIcon from "@mui/icons-material/Business";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

type Page = "dashboard" | "nominas" | "empleados" | "asistencias" | "periodos";

type Props = {
  collapsed: boolean;
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

const menu = [
  { text: "Dashboard", page: "dashboard" as const, icon: <DashboardIcon /> },
  { text: "Nóminas", page: "nominas" as const, icon: <PaymentsIcon /> },
  { text: "Empleados", page: "empleados" as const, icon: <PeopleIcon /> },
  { text: "Asistencias", page: "asistencias" as const, icon: <AccessTimeIcon /> },
  { text: "Períodos", page: "periodos" as const, icon: <CalendarMonthIcon /> },
];

export function Sidebar({ collapsed, currentPage, onNavigate }: Props) {
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
        {menu.map((item) => (
          <ListItemButton
            key={item.text}
            selected={currentPage === item.page} // ✅ Agregar selected
            onClick={() => onNavigate(item.page)}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&.Mui-selected": {
                bgcolor: "rgba(255,255,255,0.14)", // ✅ Estilo para item seleccionado
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