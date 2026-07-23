import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";

import type { Empleado } from "../../types/empleado";
import type { Departamento } from "../../types/departamento";
import type { Puesto } from "../../types/puesto";
import { formatCurrency } from "../../utils/formatCurrency";

type Props = {
  open: boolean;
  empleado: Empleado | null;
  departamentos: Departamento[];
  puestos: Puesto[];
  onClose: () => void;
  canEdit: boolean;
  onEdit: (empleado: Empleado) => void;
  configSistema: {
    moneda: string;
    idioma: string;
  };
};

export function EmpleadoDetailsDialog({
  open,
  empleado,
  departamentos,
  puestos,
  onClose,
  canEdit,
  onEdit,
  configSistema,
}: Props) {
  if (!empleado) return null;

  const departamento =
    departamentos.find((d) => d.id === empleado.departamentoId)?.nombre ?? "-";

  const puesto =
    puestos.find((p) => p.id === empleado.puestoId)?.nombre ?? "-";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {empleado.nombre} {empleado.apellido}
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {puesto}
        </Typography>

        <Chip
          label={empleado.estado}
          color={empleado.estado === "Activo" ? "success" : "default"}
          size="small"
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          InformaciÃ³n personal
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Typography><b>CÃ©dula:</b> {empleado.cedula}</Typography>
          <Typography><b>TelÃ©fono:</b> {empleado.telefono}</Typography>
          <Typography><b>Correo:</b> {empleado.correo}</Typography>
          <Typography><b>DirecciÃ³n:</b> {empleado.direccion}</Typography>
          <Typography>
            <b>Fecha nacimiento:</b>{" "}
            {new Date(empleado.fechaNacimiento).toLocaleDateString("es-DO")}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          InformaciÃ³n laboral
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Typography><b>Departamento:</b> {departamento}</Typography>
          <Typography><b>Puesto:</b> {puesto}</Typography>
          <Typography>
            <b>Fecha ingreso:</b>{" "}
            {new Date(empleado.fechaIngreso).toLocaleDateString("es-DO")}
          </Typography>
          <Typography><b>Contrato:</b> {empleado.tipoContrato}</Typography>
          <Typography>
            <b>Salario:</b>{" "}
            {formatCurrency(
              empleado.salarioBase,
              configSistema.moneda,
              configSistema.idioma
            )}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        {canEdit && (
          <Button
            variant="contained"
            onClick={() => {
              onEdit(empleado);
              onClose();
            }}
          >
            Editar
          </Button>
        )}
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}

