import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useTheme } from "@mui/material/styles";

// ✅ Actualizar Props
type Props = {
  onLogout: () => void;
  onToggleSidebar: () => void;
  onToggleTheme: () => void; // Agregar onToggleTheme
};


// ✅ Actualizar función con todos los parámetros
export function Topbar({ onLogout, onToggleSidebar, onToggleTheme }: Props) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: 72,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={onToggleSidebar}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Panel administrativo
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton>
          <NotificationsNoneIcon />
        </IconButton>

        {/* ✅ Botón de modo oscuro con la función correcta */}
        <IconButton onClick={onToggleTheme}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>

        <Typography variant="body2">Miguel</Typography>

        <Avatar sx={{ width: 36, height: 36 }}>M</Avatar>

        <Button variant="outlined" size="small" onClick={onLogout}>
          Salir
        </Button>
      </Box>
    </Box>
  );
}