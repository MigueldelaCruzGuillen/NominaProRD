import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import AddIcon from "@mui/icons-material/Add";
import { getUsuarios, createUsuario, updateUsuario, desactivarUsuario, cambiarPasswordUsuario } from "../../services/usuarioService";
import type { Usuario } from "../../types/usuario";
import { useAuth } from "../../contexts/AuthContext";
import  ConfirmDialog  from "../../components/common/ConfirmDialog";
import { useSnackbar } from "../../contexts/SnackbarContext";

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [usuarioACambiar, setUsuarioACambiar] = useState<Usuario | null>(null);
  const [usuarioPassword, setUsuarioPassword] = useState<Usuario | null>(null);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [search, setSearch] = useState("");
  const [rolFiltro, setRolFiltro] = useState("Todos");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "Consulta",
  });
  const { user: usuarioActual } = useAuth();
  const { showMessage } = useSnackbar();

  useEffect(() => {
    getUsuarios().then(setUsuarios);
  }, []);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPage(0);
  }, [search, rolFiltro]);

  const usuariosFiltrados = usuarios
    .filter((u) =>
      rolFiltro === "Todos" ? true : u.rol === rolFiltro
    )
    .filter((u) =>
      `${u.nombre} ${u.email} ${u.rol}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const usuariosPaginados = usuariosFiltrados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  async function handleGuardarUsuario() {
    // Validaciones
    if (!form.nombre.trim()) {
      showMessage("El nombre es obligatorio.", "warning");
      return;
    }

    if (!form.email.trim()) {
      showMessage("El correo es obligatorio.", "warning");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showMessage("Ingresa un correo válido.", "warning");
      return;
    }

    if (!editing && form.password.length < 6) {
      showMessage("La contraseña debe tener al menos 6 caracteres.", "warning");
      return;
    }

    if (!form.rol) {
      showMessage("Selecciona un rol.", "warning");
      return;
    }

    try {
      if (editing) {
        const actualizado = await updateUsuario(editing.id, {
          nombre: form.nombre,
          email: form.email,
          rol: form.rol,
          activo: true,
        });

        setUsuarios((actuales) =>
          actuales.map((u) =>
            u.id === actualizado.id ? actualizado : u
          )
        );

        showMessage("Usuario actualizado correctamente.", "success");
      } else {
        const nuevo = await createUsuario({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rol: form.rol,
          empresaId: localStorage.getItem("empresaId")!,
        });

        setUsuarios((actuales) => [...actuales, nuevo]);
        showMessage("Usuario creado correctamente.", "success");
      }

      setOpen(false);
      setEditing(null);

      setForm({
        nombre: "",
        email: "",
        password: "",
        rol: "Consulta",
      });
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ?? "No se pudo guardar el usuario.",
        "error"
      );
    }
  }

  async function confirmarCambioEstado() {
    if (!usuarioACambiar) return;

    try {
      if (usuarioACambiar.activo) {
        await desactivarUsuario(usuarioACambiar.id);

        setUsuarios((actuales) =>
          actuales.map((u) =>
            u.id === usuarioACambiar.id ? { ...u, activo: false } : u
          )
        );

        showMessage("Usuario desactivado correctamente.", "warning");
      } else {
        const actualizado = await updateUsuario(usuarioACambiar.id, {
          nombre: usuarioACambiar.nombre,
          email: usuarioACambiar.email,
          rol: usuarioACambiar.rol,
          activo: true,
        });

        setUsuarios((actuales) =>
          actuales.map((u) =>
            u.id === actualizado.id ? actualizado : u
          )
        );

        showMessage("Usuario reactivado correctamente.", "success");
      }

      setUsuarioACambiar(null);
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ?? "No se pudo cambiar el estado del usuario.",
        "error"
      );
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Usuarios
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Gestión de usuarios, roles y acceso al sistema.
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ mb: 3 }}
      >
        Nuevo usuario
      </Button>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Buscar usuario"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
          size="small"
        />

        <TextField
          select
          label="Rol"
          value={rolFiltro}
          onChange={(e) => setRolFiltro(e.target.value)}
          sx={{ minWidth: 180 }}
          size="small"
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Administrador">Administrador</MenuItem>
          <MenuItem value="RRHH">RRHH</MenuItem>
          <MenuItem value="Contabilidad">Contabilidad</MenuItem>
          <MenuItem value="Consulta">Consulta</MenuItem>
        </TextField>
      </Box>

      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {usuariosPaginados.map((usuario) => (
              <TableRow key={usuario.id} hover>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.rol} 
                    size="small" 
                    color={
                      usuario.rol === "Administrador" 
                        ? "error" 
                        : usuario.rol === "RRHH" 
                        ? "primary" 
                        : usuario.rol === "Contabilidad" 
                        ? "warning" 
                        : "default"
                    } 
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={usuario.activo ? "Activo" : "Inactivo"}
                    size="small"
                    color={usuario.activo ? "success" : "default"}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditing(usuario);

                      setForm({
                        nombre: usuario.nombre,
                        email: usuario.email,
                        password: "",
                        rol: usuario.rol,
                      });

                      setOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color={usuario.activo ? "error" : "success"}
                    disabled={usuario.id === usuarioActual?.usuarioId}
                    onClick={() => setUsuarioACambiar(usuario)}
                  >
                    {usuario.id === usuarioActual?.usuarioId
                      ? "Usuario actual"
                      : usuario.activo
                      ? "Desactivar"
                      : "Reactivar"}
                  </Button>
                  <Button
                    size="small"
                    disabled={usuario.id === usuarioActual?.usuarioId}
                    onClick={() => {
                      setUsuarioPassword(usuario);
                      setNuevaPassword("");
                    }}
                  >
                    {usuario.id === usuarioActual?.usuarioId
                      ? "Usuario actual"
                      : "Contraseña"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={usuariosFiltrados.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </Paper>

      {/* Diálogo para crear/editar usuario */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>

        <DialogContent
          sx={{
            display: "grid",
            gap: 2,
            pt: "16px !important",
          }}
        >
          <TextField
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />

          <TextField
            label="Correo"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          {!editing && (
            <TextField
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              helperText="Mínimo 6 caracteres"
            />
          )}

          <TextField
            select
            label="Rol"
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            required
          >
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="RRHH">RRHH</MenuItem>
            <MenuItem value="Contabilidad">Contabilidad</MenuItem>
            <MenuItem value="Consulta">Consulta</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            setEditing(null);
            setForm({
              nombre: "",
              email: "",
              password: "",
              rol: "Consulta",
            });
          }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleGuardarUsuario}>
            {editing ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ConfirmDialog para cambiar estado */}
      <ConfirmDialog
        open={Boolean(usuarioACambiar)}
        title={usuarioACambiar?.activo ? "Desactivar usuario" : "Reactivar usuario"}
        message={
          usuarioACambiar?.activo
            ? `¿Seguro que deseas desactivar a ${usuarioACambiar?.email}?`
            : `¿Seguro que deseas reactivar a ${usuarioACambiar?.email}?`
        }
        confirmText={usuarioACambiar?.activo ? "Desactivar" : "Reactivar"}
        onClose={() => setUsuarioACambiar(null)}
        onConfirm={confirmarCambioEstado}
      />

      {/* Diálogo para cambiar contraseña */}
      <Dialog
        open={Boolean(usuarioPassword)}
        onClose={() => {
          setUsuarioPassword(null);
          setNuevaPassword("");
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Cambiar contraseña</DialogTitle>

        <DialogContent sx={{ pt: "16px !important" }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Usuario: {usuarioPassword?.email}
          </Typography>

          <TextField
            fullWidth
            label="Nueva contraseña"
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setUsuarioPassword(null);
              setNuevaPassword("");
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={async () => {
              if (!usuarioPassword) return;

              if (nuevaPassword.length < 6) {
                showMessage(
                  "La contraseña debe tener al menos 6 caracteres.",
                  "warning"
                );
                return;
              }

              try {
                await cambiarPasswordUsuario(
                  usuarioPassword.id,
                  nuevaPassword
                );

                setUsuarioPassword(null);
                setNuevaPassword("");

                showMessage(
                  "Contraseña actualizada correctamente.",
                  "success"
                );
              } catch (error: any) {
                showMessage(
                  error.response?.data?.message ??
                    "No se pudo cambiar la contraseña.",
                  "error"
                );
              }
            }}
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}