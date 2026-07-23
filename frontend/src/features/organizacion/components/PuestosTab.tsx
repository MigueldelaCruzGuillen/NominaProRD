import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  createPuesto,
  getPuestos,
  updatePuesto,
  deactivatePuesto,
  reactivatePuesto,
} from "../../../services/puestoService";

import { getDepartamentos } from "../../../services/departamentoService";

import type { Puesto } from "../../../types/puesto";
import type { Departamento } from "../../../types/departamento";

import { useSnackbar } from "../../../contexts/SnackbarContext";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

export function PuestosTab() {
  const { showMessage } = useSnackbar();

  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Puesto | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] =
    useState<"deactivate" | "reactivate" | null>(null);
  const [selectedPuesto, setSelectedPuesto] =
    useState<Puesto | null>(null);
  const [confirmLoading, setConfirmLoading] =
    useState(false);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    departamentoId: "",
  });

  const loadData = async () => {
    try {
      const [puestosData, departamentosData] = await Promise.all([
        getPuestos(),
        getDepartamentos(),
      ]);

      setPuestos(puestosData);

      setDepartamentos(
        departamentosData.filter((departamento) => departamento.activo)
      );
    } catch {
      showMessage(
        "No se pudieron cargar los puestos y departamentos.",
        "error"
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const puestosFiltrados = puestos.filter((puesto) =>
    `${puesto.nombre} ${puesto.descripcion ?? ""} ${
      puesto.departamentoNombre ?? ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleClose = () => {
    if (saving) return;

    setOpen(false);
    setEditing(null);
    setForm({
      nombre: "",
      descripcion: "",
      departamentoId: "",
    });
  };

  const handleGuardar = async () => {
    if (!form.nombre.trim()) {
      showMessage("El nombre del puesto es obligatorio.", "warning");
      return;
    }

    if (!form.departamentoId) {
      showMessage("Selecciona un departamento.", "warning");
      return;
    }

    const departamentoSeleccionado = departamentos.find(
      (departamento) => departamento.id === form.departamentoId
    );

    if (!departamentoSeleccionado) {
      showMessage("El departamento seleccionado no es válido.", "error");
      return;
    }

    try {
      setSaving(true);

      if (editing) {
        const actualizado = await updatePuesto(
          editing.id,
          {
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim(),
            departamentoId: form.departamentoId,
          }
        );

        setPuestos(actuales =>
          actuales.map(p =>
            p.id === actualizado.id
              ? actualizado
              : p
          )
        );

        showMessage("Puesto actualizado correctamente.", "success");
      } else {
        const nuevo = await createPuesto({
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          empresaId: departamentoSeleccionado.empresaId,
          departamentoId: form.departamentoId,
        });

        setPuestos(actuales => [...actuales, nuevo]);

        showMessage("Puesto creado correctamente.", "success");
      }

      setOpen(false);
      setEditing(null);
      setForm({
        nombre: "",
        descripcion: "",
        departamentoId: "",
      });
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ??
          "No se pudo guardar el puesto.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedPuesto || !confirmAction) return;

    try {
      setConfirmLoading(true);

      if (confirmAction === "deactivate") {
        await deactivatePuesto(selectedPuesto.id);
        showMessage("Puesto desactivado correctamente.", "success");
      }

      if (confirmAction === "reactivate") {
        await reactivatePuesto(selectedPuesto.id);
        showMessage("Puesto reactivado correctamente.", "success");
      }

      setConfirmOpen(false);
      setConfirmAction(null);
      setSelectedPuesto(null);

      await loadData();
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
    setSelectedPuesto(null);
  };

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
          label="Buscar puesto"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: 280 }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null);
            setForm({
              nombre: "",
              descripcion: "",
              departamentoId: "",
            });
            setOpen(true);
          }}
        >
          Nuevo puesto
        </Button>
      </Box>

      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Empleados</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {puestosFiltrados.map((puesto) => (
              <TableRow key={puesto.id} hover>
                <TableCell>
                  <Typography fontWeight={600}>
                    {puesto.nombre}
                  </Typography>
                </TableCell>

                <TableCell>
                  {puesto.departamentoNombre || "-"}
                </TableCell>

                <TableCell>
                  {puesto.descripcion || "-"}
                </TableCell>

                <TableCell>
                  {puesto.totalEmpleados}
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={puesto.activo ? "Activo" : "Inactivo"}
                    color={puesto.activo ? "success" : "default"}
                  />
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditing(puesto);
                        setForm({
                          nombre: puesto.nombre,
                          descripcion: puesto.descripcion ?? "",
                          departamentoId: puesto.departamentoId,
                        });
                        setOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  {puesto.activo ? (
                    <Tooltip
                      title={
                        puesto.totalEmpleados > 0
                          ? "No se puede desactivar porque tiene empleados activos"
                          : "Desactivar"
                      }
                    >
                      <span>
                        <IconButton
                          color="warning"
                          disabled={puesto.totalEmpleados > 0}
                          onClick={() => {
                            setSelectedPuesto(puesto);
                            setConfirmAction("deactivate");
                            setConfirmOpen(true);
                          }}
                        >
                          <BlockIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Reactivar">
                      <IconButton
                        color="success"
                        onClick={() => {
                          setSelectedPuesto(puesto);
                          setConfirmAction("reactivate");
                          setConfirmOpen(true);
                        }}
                      >
                        <ReplayIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {puestosFiltrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay puestos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editing ? "Editar puesto" : "Nuevo puesto"}
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
            onChange={(event) =>
              setForm({
                ...form,
                nombre: event.target.value,
              })
            }
            disabled={saving}
          />

          <FormControl fullWidth>
            <InputLabel id="departamento-label">
              Departamento
            </InputLabel>

            <Select
              labelId="departamento-label"
              label="Departamento"
              value={form.departamentoId}
              onChange={(event) =>
                setForm({
                  ...form,
                  departamentoId: event.target.value,
                })
              }
              disabled={saving}
            >
              {departamentos.map((departamento) => (
                <MenuItem
                  key={departamento.id}
                  value={departamento.id}
                >
                  {departamento.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Descripción"
            multiline
            minRows={3}
            value={form.descripcion}
            onChange={(event) =>
              setForm({
                ...form,
                descripcion: event.target.value,
              })
            }
            disabled={saving}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={saving}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleGuardar}
            disabled={saving}
          >
            {saving ? "Guardando..." : editing ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title={
          confirmAction === "deactivate"
            ? "Desactivar puesto"
            : "Reactivar puesto"
        }
        message={
          confirmAction === "deactivate"
            ? `¿Deseas desactivar el puesto "${selectedPuesto?.nombre ?? ""}"?`
            : `¿Deseas reactivar el puesto "${selectedPuesto?.nombre ?? ""}"?`
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