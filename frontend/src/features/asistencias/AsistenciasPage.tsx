import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import type { Asistencia } from "../../types/asistencia";
import type { Empleado } from "../../types/empleado";

import {
  createAsistenciaManual,
  getAsistencias,
} from "../../services/asistenciaService";

import { getEmpleados } from "../../services/empleadoService";

interface FormAsistencia {
  empleadoId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
}

const initialForm: FormAsistencia = {
  empleadoId: "",
  fecha: new Date().toISOString().split("T")[0],
  horaEntrada: "08:00",
  horaSalida: "17:00",
};

export function AsistenciasPage() {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormAsistencia>(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [asistenciasData, empleadosData] = await Promise.all([
        getAsistencias(),
        getEmpleados(),
      ]);

      setAsistencias(asistenciasData);
      setEmpleados(empleadosData);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las asistencias.");
    } finally {
      setLoading(false);
    }
  };

  const hoy = new Date().toISOString().split("T")[0];

  const empleadosDisponibles = empleados.filter((empleado) => {
    if (empleado.estado !== "Activo") {
      return false;
    }

    const tieneAsistenciaHoy = asistencias.some((asistencia) => {
      return (
        asistencia.empleadoId === empleado.id &&
        asistencia.fecha.substring(0, 10) === hoy
      );
    });

    return !tieneAsistenciaHoy;
  });

  const asistenciasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return asistencias;
    }

    return asistencias.filter((asistencia) => {
      return (
        asistencia.empleadoNombre.toLowerCase().includes(termino) ||
        asistencia.departamentoNombre.toLowerCase().includes(termino) ||
        asistencia.puestoNombre.toLowerCase().includes(termino) ||
        asistencia.estado.toLowerCase().includes(termino)
      );
    });
  }, [asistencias, busqueda]);

  const abrirDialogo = () => {
    setForm({
      ...initialForm,
      fecha: new Date().toISOString().split("T")[0],
    });

    setError("");
    setDialogOpen(true);
  };

  const cerrarDialogo = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
  };

  const guardarAsistencia = async () => {
    if (!form.empleadoId) {
      setError("Debes seleccionar un empleado.");
      return;
    }

    if (!form.fecha || !form.horaEntrada || !form.horaSalida) {
      setError("Completa la fecha y las horas.");
      return;
    }

    const entradaLocal = new Date(
      `${form.fecha}T${form.horaEntrada}:00`
    );

    const salidaLocal = new Date(
      `${form.fecha}T${form.horaSalida}:00`
    );

    if (salidaLocal <= entradaLocal) {
      setError(
        "La hora de salida debe ser mayor que la hora de entrada."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createAsistenciaManual({
        empleadoId: form.empleadoId,
        horaEntrada: entradaLocal.toISOString(),
        horaSalida: salidaLocal.toISOString(),
      });

      setSuccess("Asistencia registrada correctamente.");
      setDialogOpen(false);

      await cargarDatos();
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ??
        err?.response?.data?.title ??
        "No se pudo registrar la asistencia.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-DO");
  };

  const formatearHora = (fecha?: string | null) => {
    if (!fecha) {
      return "—";
    }

    return new Date(fecha).toLocaleTimeString("es-DO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const obtenerColorEstado = (
    estado: string
  ): "success" | "warning" | "default" => {
    if (estado === "SalidaRegistrada") {
      return "success";
    }

    if (estado === "EntradaRegistrada") {
      return "warning";
    }

    return "default";
  };

  const obtenerTextoEstado = (estado: string) => {
    if (estado === "EntradaRegistrada") {
      return "Entrada registrada";
    }

    if (estado === "SalidaRegistrada") {
      return "Jornada completada";
    }

    return estado;
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4">
          Asistencias
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={abrirDialogo}
        >
          Nueva asistencia
        </Button>
      </Box>

      <TextField
        fullWidth
        size="small"
        label="Buscar por empleado, departamento, puesto o estado"
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
        sx={{ mb: 2 }}
      />

      {error && !dialogOpen && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <Paper sx={{ overflow: "hidden" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Empleado</TableCell>
                  <TableCell>Departamento</TableCell>
                  <TableCell>Puesto</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Entrada</TableCell>
                  <TableCell>Salida</TableCell>
                  <TableCell align="right">Horas</TableCell>
                  <TableCell align="right">Extras</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {asistenciasFiltradas.map((asistencia) => (
                  <TableRow key={asistencia.id} hover>
                    <TableCell>
                      {asistencia.empleadoNombre}
                    </TableCell>

                    <TableCell>
                      {asistencia.departamentoNombre || "—"}
                    </TableCell>

                    <TableCell>
                      {asistencia.puestoNombre || "—"}
                    </TableCell>

                    <TableCell>
                      {formatearFecha(asistencia.fecha)}
                    </TableCell>

                    <TableCell>
                      {formatearHora(asistencia.horaEntrada)}
                    </TableCell>

                    <TableCell>
                      {formatearHora(asistencia.horaSalida)}
                    </TableCell>

                    <TableCell align="right">
                      {asistencia.horasTrabajadas.toFixed(2)}
                    </TableCell>

                    <TableCell align="right">
                      {asistencia.horasExtras.toFixed(2)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={obtenerTextoEstado(
                          asistencia.estado
                        )}
                        color={obtenerColorEstado(
                          asistencia.estado
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {asistenciasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No se encontraron asistencias.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={cerrarDialogo}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Registrar asistencia
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ mt: 1, mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel id="empleado-asistencia-label">
              Empleado
            </InputLabel>

            <Select
              labelId="empleado-asistencia-label"
              label="Empleado"
              value={form.empleadoId}
              onChange={(event) =>
                setForm({
                  ...form,
                  empleadoId: event.target.value,
                })
              }
            >
              {empleadosDisponibles.map((empleado) => (
                <MenuItem
                  key={empleado.id}
                  value={empleado.id}
                >
                  {empleado.nombre} {empleado.apellido}
                  {empleado.departamentoNombre
                    ? ` — ${empleado.departamentoNombre}`
                    : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="date"
            label="Fecha"
            value={form.fecha}
            onChange={(event) =>
              setForm({
                ...form,
                fecha: event.target.value,
              })
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            sx={{ mb: 2 }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              type="time"
              label="Hora de entrada"
              value={form.horaEntrada}
              onChange={(event) =>
                setForm({
                  ...form,
                  horaEntrada: event.target.value,
                })
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              fullWidth
              type="time"
              label="Hora de salida"
              value={form.horaSalida}
              onChange={(event) =>
                setForm({
                  ...form,
                  horaSalida: event.target.value,
                })
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={cerrarDialogo}
            disabled={saving}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={guardarAsistencia}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Registrar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={4000}
        onClose={() => setSuccess("")}
        message={success}
      />
    </Box>
  );
}