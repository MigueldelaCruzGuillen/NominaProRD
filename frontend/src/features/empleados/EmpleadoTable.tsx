import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Checkbox,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import type { Empleado } from "../../types/empleado";
import type { Departamento } from "../../types/departamento";
import type { Puesto } from "../../types/puesto";
import { formatCurrency } from "../../utils/formatCurrency";

type Props = {
  empleados: Empleado[] | undefined;
  departamentos: Departamento[];
  puestos: Puesto[];
  selected?: string[];
  canManage: boolean;
  onEdit: (empleado: Empleado) => void;
  onDelete: (empleado: Empleado) => void;
  onView: (empleado: Empleado) => void;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  configSistema: {
    moneda: string;
    idioma: string;
  };
};

export function EmpleadoTable({
  empleados = [],
  departamentos,
  puestos,
  selected = [],
  canManage,
  onToggle,
  onToggleAll,
  onView,
  onEdit,
  onDelete,
  configSistema,
}: Props) {
  const getDepartamentoNombre = (id: string) => {
    const depto = departamentos.find((d) => d.id === id);
    return depto?.nombre || "Sin departamento";
  };

  const getPuestoNombre = (id: string) => {
    const puesto = puestos.find((p) => p.id === id);
    return puesto?.nombre || "Sin puesto";
  };

  return (
    <TableContainer component={Paper}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            {canManage && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    empleados.length > 0 &&
                    selected.length === empleados.length
                  }
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < empleados.length
                  }
                  onChange={onToggleAll}
                />
              </TableCell>
            )}
            <TableCell>Nombre</TableCell>
            <TableCell>CÃ©dula</TableCell>
            <TableCell>Departamento</TableCell>
            <TableCell>Puesto</TableCell>
            <TableCell>Salario Base</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">{canManage ? "Acciones" : "Ver"}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {empleados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canManage ? 8 : 7} align="center" sx={{ py: 4 }}>
                No hay empleados registrados
              </TableCell>
            </TableRow>
          ) : (
            empleados.map((e) => (
              <TableRow key={e.id} hover>
                {canManage && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(e.id)}
                      onChange={() => onToggle(e.id)}
                    />
                  </TableCell>
                )}
                <TableCell>
                  {e.nombre} {e.apellido}
                </TableCell>
                <TableCell>{e.cedula}</TableCell>
                <TableCell>{getDepartamentoNombre(e.departamentoId)}</TableCell>
                <TableCell>{getPuestoNombre(e.puestoId)}</TableCell>
                <TableCell>
                  {formatCurrency(
                    e.salarioBase,
                    configSistema.moneda,
                    configSistema.idioma
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={e.estado}
                    color={e.estado === "Activo" ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver detalles">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => onView(e)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  
                  {canManage && (
                    <>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(e)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Desactivar">
                        <IconButton
                          size="small"
                          color="error"
                          disabled={e.estado === "Inactivo"}
                          onClick={() => onDelete(e)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

