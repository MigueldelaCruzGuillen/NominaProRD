// frontend/src/features/perfil/PerfilDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { cambiarMiPassword, actualizarMiPerfil } from "../../services/usuarioService";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PerfilDialog({ open, onClose }: Props) {
  const { showMessage } = useSnackbar();
  const { user, setUser } = useAuth();
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [nombre, setNombre] = useState(user?.nombre ?? "");

  const handleCambiarPassword = async () => {
    if (!passwordActual) {
      showMessage("Ingresa tu contraseña actual.", "warning");
      return;
    }

    if (nuevaPassword.length < 6) {
      showMessage("La nueva contraseña debe tener al menos 6 caracteres.", "warning");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      showMessage("Las contraseñas no coinciden.", "warning");
      return;
    }

    try {
      setCambiandoPassword(true);
      await cambiarMiPassword(passwordActual, nuevaPassword);

      setPasswordOpen(false);
      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");

      showMessage("Contraseña actualizada correctamente.", "success");
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ??
          "No se pudo cambiar la contraseña.",
        "error"
      );
    } finally {
      setCambiandoPassword(false);
    }
  };

  async function handleActualizarPerfil() {
    if (!nombre.trim()) {
      showMessage("El nombre es obligatorio.", "warning");
      return;
    }

    try {
      setGuardandoPerfil(true);
      const actualizado = await actualizarMiPerfil(nombre.trim());

      setUser((actual) =>
        actual
          ? {
              ...actual,
              nombre: actualizado.nombre,
            }
          : actual
      );

      localStorage.setItem("nombre", actualizado.nombre);

      showMessage("Perfil actualizado correctamente.", "success");
      onClose();
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ??
          "No se pudo actualizar el perfil.",
        "error"
      );
    } finally {
      setGuardandoPerfil(false);
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Mi perfil</DialogTitle>

        <DialogContent sx={{ pt: "16px !important" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: 40,
                bgcolor: "primary.main",
                mb: 1,
              }}
            >
              {user?.email?.charAt(0).toUpperCase() ?? "U"}
            </Avatar>
            <Typography variant="h6">
              {user?.nombre || "Usuario"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Rol: {user?.rol}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Información personal
          </Typography>

          <TextField
            fullWidth
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            sx={{ mt: 1 }}
          />

          <Button
            variant="contained"
            onClick={handleActualizarPerfil}
            disabled={guardandoPerfil}
            sx={{ mt: 2 }}
          >
            {guardandoPerfil ? "Guardando..." : "Guardar perfil"}
          </Button>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Seguridad
          </Typography>

          <Button
            variant="outlined"
            onClick={() => setPasswordOpen(true)}
            fullWidth
          >
            Cambiar contraseña
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para cambiar contraseña */}
      <Dialog
        open={passwordOpen}
        onClose={() => {
          setPasswordOpen(false);
          setPasswordActual("");
          setNuevaPassword("");
          setConfirmarPassword("");
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Cambiar contraseña</DialogTitle>

        <DialogContent sx={{ pt: "16px !important", display: "grid", gap: 2 }}>
          <TextField
            label="Contraseña actual"
            type="password"
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
          />

          <TextField
            label="Nueva contraseña"
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
          />

          <TextField
            label="Confirmar nueva contraseña"
            type="password"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setPasswordOpen(false);
              setPasswordActual("");
              setNuevaPassword("");
              setConfirmarPassword("");
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCambiarPassword}
            disabled={cambiandoPassword}
          >
            {cambiandoPassword ? "Actualizando..." : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}