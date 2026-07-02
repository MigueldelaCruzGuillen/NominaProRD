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
  onNavigate: (page: Page) => void;
};

const menu = [
  { text: "Dashboard", page: "dashboard" as const, icon: <DashboardIcon /> },
  { text: "Nóminas", page: "nominas" as const, icon: <PaymentsIcon /> },
  { text: "Empleados", page: "empleados" as const, icon: <PeopleIcon /> },
  { text: "Asistencias", page: "asistencias" as const, icon: <AccessTimeIcon /> },
  { text: "Períodos", page: "periodos" as const, icon: <CalendarMonthIcon /> },
];

export function Sidebar({ onNavigate }: Props) {
  return (
    <Box
      sx={{
        width: 260,
        bgcolor: "#0f172a",
        color: "#fff",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        NominaPro RD
      </Typography>

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => onNavigate(item.page)}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            <ListItemIcon sx={{ color: "#cbd5e1" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}