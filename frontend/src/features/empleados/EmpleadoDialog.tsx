import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";

import type { Departamento } from "../../types/departamento";
import type { Puesto } from "../../types/puesto";

type EmpleadoForm = {
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  correo: string;
  direccion: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  salarioBase: string;
  tipoContrato: string;
  departamentoId: string;
  puestoId: string;
};

type Props = {
  open: boolean;
  editingId: string | null;
  form: EmpleadoForm;
  departamentos: Departamento[];
  puestos: Puesto[];
  onClose: () => void;
  onChange: (form: EmpleadoForm) => void;
  onSubmit: () => void;
};

export function EmpleadoDialog({
  open,
  editingId,
  form,
  departamentos,
  puestos,
  onClose,
  onChange,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{editingId ? "Editar empleado" : "Nuevo empleado"}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
          <TextField label="Nombre" value={form.nombre} onChange={(e) => onChange({ ...form, nombre: e.target.value })} />
          <TextField label="Apellido" value={form.apellido} onChange={(e) => onChange({ ...form, apellido: e.target.value })} />
          <TextField label="Cédula" value={form.cedula} onChange={(e) => onChange({ ...form, cedula: e.target.value })} />
          <TextField label="Teléfono" value={form.telefono} onChange={(e) => onChange({ ...form, telefono: e.target.value })} />
          <TextField label="Correo" value={form.correo} onChange={(e) => onChange({ ...form, correo: e.target.value })} />
          <TextField label="Dirección" value={form.direccion} onChange={(e) => onChange({ ...form, direccion: e.target.value })} />

          <TextField type="date" label="Fecha nacimiento" InputLabelProps={{ shrink: true }} value={form.fechaNacimiento} onChange={(e) => onChange({ ...form, fechaNacimiento: e.target.value })} />
          <TextField type="date" label="Fecha ingreso" InputLabelProps={{ shrink: true }} value={form.fechaIngreso} onChange={(e) => onChange({ ...form, fechaIngreso: e.target.value })} />

          <TextField label="Salario base" type="number" value={form.salarioBase} onChange={(e) => onChange({ ...form, salarioBase: e.target.value })} />
          <TextField label="Tipo contrato" value={form.tipoContrato} onChange={(e) => onChange({ ...form, tipoContrato: e.target.value })} />

          <TextField select label="Departamento" value={form.departamentoId} onChange={(e) => onChange({ ...form, departamentoId: e.target.value })}>
            {departamentos.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField select label="Puesto" value={form.puestoId} onChange={(e) => onChange({ ...form, puestoId: e.target.value })}>
            {puestos.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSubmit}>
          {editingId ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}