import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import ReplayIcon from "@mui/icons-material/Replay";

import {
  createDepartamento,
  deactivateDepartamento,
  getDepartamentos,
  reactivateDepartamento,
  updateDepartamento,
} from "../../../services/departamentoService";

import type { Departamento } from "../../../types/departamento";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

type ConfirmAction = "deactivate" | "reactivate" | null;

export function DepartamentosTab() {
  const { showMessage } = useSnackbar();

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Departamento | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  // Estados para el ConfirmDialog centralizado
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const loadDepartamentos = async () => {
    try {
      const data = await getDepartamentos();
      setDepartamentos(data);
    } catch (error) {
      showMessage("No se pudieron cargar los departamentos.", "error");
    }
  };

  useEffect(() => {
    loadDepartamentos();
  }, []);

  const departamentosFiltrados = departamentos.filter((departamento) =>
    `${departamento.nombre} ${departamento.descripcion ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleEdit = (departamento: Departamento) => {
    setEditing(departamento);
    setForm({
      nombre: departamento.nombre,
      descripcion: departamento.descripcion ?? "",
    });
    setOpen(true);
  };

  const requestDeactivate = (departamento: Departamento) => {
    setSelectedDepartamento(departamento);
    setConfirmAction("deactivate");
    setConfirmOpen(true);
  };

  const requestReactivate = (departamento: Departamento) => {
    setSelectedDepartamento(departamento);
    setConfirmAction("reactivate");
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedDepartamento || !confirmAction) return;

    try {
      setConfirmLoading(true);

      if (confirmAction === "deactivate") {
        await deactivateDepartamento(selectedDepartamento.id);
        showMessage("Departamento desactivado correctamente.", "success");
      }

      if (confirmAction === "reactivate") {
        await reactivateDepartamento(selectedDepartamento.id);
        showMessage("Departamento reactivado correctamente.", "success");
      }

      setConfirmOpen(false);
      setConfirmAction(null);
      setSelectedDepartamento(null);

      await loadDepartamentos();
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ??
          "No se pudo completar la operación.",
        "error"
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCloseConfirm = () => {
    if (confirmLoading) return;

    setConfirmOpen(false);
    setConfirmAction(null);
    setSelectedDepartamento(null);
  };

  async function handleGuardar() {
    if (!form.nombre.trim()) {
      showMessage("El nombre es obligatorio.", "warning");
      return;
    }

    try {
      if (editing) {
        const actualizado = await updateDepartamento(editing.id, {
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim() || undefined,
        });

        setDepartamentos((actuales) =>
          actuales.map((d) =>
            d.id === actualizado.id ? actualizado : d
          )
        );

        showMessage("Departamento actualizado correctamente.", "success");
      } else {
        const nuevo = await createDepartamento({
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim() || undefined,
        });

        setDepartamentos((actuales) => [...actuales, nuevo]);

        showMessage("Departamento creado correctamente.", "success");
      }

      setOpen(false);
      setEditing(null);
      setForm({ nombre: "", descripcion: "" });
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ??
          "No se pudo guardar el departamento.",
        "error"
      );
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          label="Buscar departamento"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null);
            setForm({ nombre: "", descripcion: "" });
            setOpen(true);
          }}
        >
          Nuevo departamento
        </Button>
      </Box>

      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Empleados</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {departamentosFiltrados.map((departamento) => (
              <TableRow key={departamento.id} hover>
                <TableCell>
                  <Typography fontWeight={600}>
                    {departamento.nombre}
                  </Typography>
                </TableCell>

                <TableCell>
                  {departamento.descripcion || "-"}
                </TableCell>

                <TableCell>
                  {departamento.totalEmpleados}
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={departamento.activo ? "Activo" : "Inactivo"}
                    color={departamento.activo ? "success" : "default"}
                  />
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(departamento)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  {departamento.activo ? (
                    <Tooltip
                      title={
                        departamento.totalEmpleados > 0
                          ? "No se puede desactivar porque tiene empleados activos"
                          : "Desactivar"
                      }
                    >
                      <span>
                        <IconButton
                          color="warning"
                          onClick={() => requestDeactivate(departamento)}
                          disabled={departamento.totalEmpleados > 0}
                        >
                          <BlockIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Reactivar">
                      <IconButton
                        color="success"
                        onClick={() => requestReactivate(departamento)}
                      >
                        <ReplayIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {departamentosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay departamentos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
          setForm({ nombre: "", descripcion: "" });
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editing ? "Editar departamento" : "Nuevo departamento"}
        </DialogTitle>

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
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
          />

          <TextField
            label="Descripción"
            multiline
            minRows={3}
            value={form.descripcion}
            onChange={(e) =>
              setForm({ ...form, descripcion: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            setEditing(null);
            setForm({ nombre: "", descripcion: "" });
          }}>
            Cancelar
          </Button>

          <Button variant="contained" onClick={handleGuardar}>
            {editing ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ConfirmDialog centralizado */}
      <ConfirmDialog
        open={confirmOpen}
        title={
          confirmAction === "deactivate"
            ? "Desactivar departamento"
            : "Reactivar departamento"
        }
        message={
          confirmAction === "deactivate"
            ? `¿Deseas desactivar el departamento "${selectedDepartamento?.nombre ?? ""}"?`
            : `¿Deseas reactivar el departamento "${selectedDepartamento?.nombre ?? ""}"?`
        }
        confirmText={
          confirmAction === "deactivate"
            ? "Desactivar"
            : "Reactivar"
        }
        confirmColor={
          confirmAction === "deactivate"
            ? "warning"
            : "success"
        }
        loading={confirmLoading}
        onConfirm={handleConfirmAction}
        onClose={handleCloseConfirm}
      />
    </Box>
  );
}