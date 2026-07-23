// frontend/src/components/layout/Topbar.tsx
import { Avatar, Box, Button, IconButton, Typography, Badge, Menu, MenuItem, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { PerfilDialog } from "../../features/perfil/PerfilDialog";
import {
  eliminarNotificacion,
  getNotificaciones,
  marcarNotificacionLeida,
  marcarTodasLeidas,
  type Notificacion,
} from "../../services/notificacionService";

type Props = {
  onLogout: () => void;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
};

export function Topbar({ onLogout, onToggleSidebar, onToggleTheme }: Props) {
  const theme = useTheme();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [anchorNotificaciones, setAnchorNotificaciones] = useState<HTMLElement | null>(null);

  async function cargarNotificaciones() {
    try {
      const data = await getNotificaciones();
      setNotificaciones(data);
    } catch {
      setNotificaciones([]);
    }
  }

  useEffect(() => {
    cargarNotificaciones();

    const interval = setInterval(cargarNotificaciones, 15000);

    return () => clearInterval(interval);
  }, []);

  // Obtener la inicial para el avatar
  const getInitial = () => {
    const name = user?.nombre || user?.email || "U";
    return name.charAt(0).toUpperCase();
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <>
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
          <IconButton
            onClick={(event) => setAnchorNotificaciones(event.currentTarget)}
          >
            <Badge badgeContent={noLeidas} color="error">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={onToggleTheme}>
            {theme.palette.mode === "dark" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>

          <Box
            onClick={() => setProfileOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              px: 1,
              py: 0.5,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Typography variant="body2">
              {user?.nombre ?? user?.email ?? "Usuario"}
            </Typography>
            <Avatar sx={{ width: 36, height: 36 }}>
              {getInitial()}
            </Avatar>
          </Box>

          <Button variant="outlined" size="small" onClick={onLogout}>
            Salir
          </Button>
        </Box>
      </Box>

      {/* Menú de notificaciones */}
      <Menu
        anchorEl={anchorNotificaciones}
        open={Boolean(anchorNotificaciones)}
        onClose={() => setAnchorNotificaciones(null)}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 480,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontWeight={700}>Notificaciones</Typography>

          <Button
            size="small"
            disabled={noLeidas === 0}
            onClick={async () => {
              await marcarTodasLeidas();
              await cargarNotificaciones();
            }}
          >
            Marcar todas
          </Button>
        </Box>

        <Divider />

        {notificaciones.length === 0 ? (
          <MenuItem disabled>No hay notificaciones.</MenuItem>
        ) : (
          notificaciones.slice(0, 10).map((notificacion) => {
            const color =
              notificacion.tipo === "Success"
                ? "success.main"
                : notificacion.tipo === "Warning"
                ? "warning.main"
                : notificacion.tipo === "Error"
                ? "error.main"
                : "info.main";

            return (
              <MenuItem
                key={notificacion.id}
                sx={{
                  alignItems: "stretch",
                  gap: 1,
                  whiteSpace: "normal",
                  bgcolor: notificacion.leida ? "transparent" : "action.hover",
                }}
                onClick={async () => {
                  if (!notificacion.leida) {
                    await marcarNotificacionLeida(notificacion.id);
                    await cargarNotificaciones();
                  }
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    borderRadius: 2,
                    bgcolor: color,
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={700}>
                    {notificacion.titulo}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {notificacion.mensaje}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {new Date(notificacion.fecha).toLocaleString("es-DO")}
                  </Typography>
                </Box>

                <IconButton
                  size="small"
                  onClick={async (event) => {
                    event.stopPropagation();
                    await eliminarNotificacion(notificacion.id);
                    await cargarNotificaciones();
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </MenuItem>
            );
          })
        )}
      </Menu>

      <PerfilDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}