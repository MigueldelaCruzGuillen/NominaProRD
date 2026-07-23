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
import AddIcon from "@mui/icons-material/Add";
import {
  createPeriodoNomina,
  getPeriodosNomina,
  cerrarPeriodo,
} from "../../services/periodoNominaService";
import type { PeriodoNomina } from "../../types/periodoNomina";
import { useSnackbar } from "../../contexts/SnackbarContext";
import  ConfirmDialog  from "../../components/common/ConfirmDialog";

export function PeriodosPage() {
  const [periodos, setPeriodos] = useState<PeriodoNomina[]>([]);
  const [open, setOpen] = useState(false);
  const [periodoACerrar, setPeriodoACerrar] = useState<PeriodoNomina | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    tipo: "Mensual",
  });

  const { showMessage } = useSnackbar();

  useEffect(() => {
    getPeriodosNomina().then(setPeriodos);
  }, []);

  async function handleCrearPeriodo() {
    try {
      const nuevoPeriodo = await createPeriodoNomina({
        nombre: form.nombre,
        fechaInicio: `${form.fechaInicio}T00:00:00Z`,
        fechaFin: `${form.fechaFin}T23:59:59Z`,
        tipo: form.tipo,
      });

      setPeriodos((actuales) => [nuevoPeriodo, ...actuales]);
      setOpen(false);

      setForm({
        nombre: "",
        fechaInicio: "",
        fechaFin: "",
        tipo: "Mensual",
      });

      showMessage("Período creado correctamente.", "success");
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ?? "No se pudo crear el período.",
        "error"
      );
    }
  }

  async function confirmarCerrarPeriodo() {
    if (!periodoACerrar) return;

    try {
      const actualizado = await cerrarPeriodo(periodoACerrar.id);

      setPeriodos((actuales) =>
        actuales.map((p) =>
          p.id === periodoACerrar.id ? actualizado : p
        )
      );

      setPeriodoACerrar(null);
      showMessage("Período cerrado correctamente.", "success");
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ?? "No se pudo cerrar el período.",
        "error"
      );
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">
          Períodos de Nómina
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Nuevo período
        </Button>
      </Box>

      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {periodos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{new Date(p.fechaInicio).toLocaleDateString("es-DO")}</TableCell>
                <TableCell>{new Date(p.fechaFin).toLocaleDateString("es-DO")}</TableCell>
                <TableCell>{p.tipo}</TableCell>
                <TableCell>
                  <Chip
                    label={p.estado}
                    color={p.estado === "Cerrado" ? "default" : "success"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={p.estado === "Cerrado"}
                    onClick={() => setPeriodoACerrar(p)}
                  >
                    {p.estado === "Cerrado" ? "Cerrado" : "Cerrar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog para crear período */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nuevo período de nómina</DialogTitle>

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
            type="date"
            label="Fecha de inicio"
            slotProps={{ inputLabel: { shrink: true } }}
            value={form.fechaInicio}
            onChange={(e) =>
              setForm({ ...form, fechaInicio: e.target.value })
            }
          />

          <TextField
            type="date"
            label="Fecha final"
            slotProps={{ inputLabel: { shrink: true } }}
            value={form.fechaFin}
            onChange={(e) =>
              setForm({ ...form, fechaFin: e.target.value })
            }
          />

          <TextField
            select
            label="Tipo"
            value={form.tipo}
            onChange={(e) =>
              setForm({ ...form, tipo: e.target.value })
            }
          >
            <MenuItem value="Mensual">Mensual</MenuItem>
            <MenuItem value="Quincenal">Quincenal</MenuItem>
            <MenuItem value="Semanal">Semanal</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCrearPeriodo}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para cerrar período */}
      <ConfirmDialog
        open={Boolean(periodoACerrar)}
        title="Cerrar período"
        message={`¿Seguro que deseas cerrar el período ${periodoACerrar?.nombre}?`}
        confirmText="Cerrar período"
        onCancel={() => setPeriodoACerrar(null)}
        onConfirm={confirmarCerrarPeriodo}
      />
    </Box>
  );
}