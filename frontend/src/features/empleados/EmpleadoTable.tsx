import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Empleado } from "../../types/empleado";
import type { Departamento } from "../../types/departamento";
import type { Puesto } from "../../types/puesto";

type Props = {
  empleados: Empleado[];
  departamentos: Departamento[];
  puestos: Puesto[];
  onEdit: (empleado: Empleado) => void;
  onDelete: (empleado: Empleado) => void;
};

export function EmpleadoTable({
  empleados,
  departamentos,
  puestos,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Cédula</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Departamento</TableCell>
            <TableCell>Puesto</TableCell>
            <TableCell>Salario</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {empleados.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                {e.nombre} {e.apellido}
              </TableCell>
              <TableCell>{e.cedula}</TableCell>
              <TableCell>{e.correo}</TableCell>
              <TableCell>
                {departamentos.find((d) => d.id === e.departamentoId)?.nombre ?? "-"}
              </TableCell>
              <TableCell>
                {puestos.find((p) => p.id === e.puestoId)?.nombre ?? "-"}
              </TableCell>
              <TableCell>RD${e.salarioBase.toLocaleString("es-DO")}</TableCell>
              <TableCell>
                <Chip
                  label={e.estado}
                  color={e.estado === "Activo" ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton size="small">
                  <VisibilityIcon fontSize="small" />
                </IconButton>

                <IconButton size="small" onClick={() => onEdit(e)}>
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  disabled={e.estado === "Inactivo"}
                  onClick={() => onDelete(e)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}