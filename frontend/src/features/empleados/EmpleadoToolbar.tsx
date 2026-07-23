import { Box, Button, MenuItem, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SearchBox } from "../../components/common/SearchBox";

import type { Departamento } from "../../types/departamento";
import type { Puesto } from "../../types/puesto";

type Props = {
  search: string;
  estado: string;
  departamentoFiltro: string;
  puestoFiltro: string;
  departamentos: Departamento[];
  puestos: Puesto[];
  salarioDesde: string;
  salarioHasta: string;
  canCreate: boolean;
  onSearch: (value: string) => void;
  onEstado: (value: string) => void;
  onDepartamento: (value: string) => void;
  onPuesto: (value: string) => void;
  onSalarioDesde: (value: string) => void;
  onSalarioHasta: (value: string) => void;
  onClearFilters: () => void;
  onNuevo: () => void;
};

export function EmpleadoToolbar({
  search,
  estado,
  departamentoFiltro,
  puestoFiltro,
  departamentos,
  puestos,
  salarioDesde,
  salarioHasta,
  canCreate,
  onSearch,
  onEstado,
  onDepartamento,
  onPuesto,
  onSalarioDesde,
  onSalarioHasta,
  onClearFilters,
  onNuevo,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 2,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <SearchBox
        value={search}
        placeholder="Buscar empleado..."
        onChange={onSearch}
      />

      <TextField
        select
        label="Estado"
        value={estado}
        onChange={(e) => onEstado(e.target.value)}
        sx={{ width: 150, bgcolor: "background.paper" }}
        size="small"
      >
        <MenuItem value="Todos">Todos</MenuItem>
        <MenuItem value="Activo">Activo</MenuItem>
        <MenuItem value="Inactivo">Inactivo</MenuItem>
      </TextField>

      <TextField
        select
        label="Departamento"
        value={departamentoFiltro}
        onChange={(e) => onDepartamento(e.target.value)}
        sx={{ width: 200, bgcolor: "background.paper" }}
        size="small"
      >
        <MenuItem value="Todos">Todos</MenuItem>
        {departamentos.map((d) => (
          <MenuItem key={d.id} value={d.id}>
            {d.nombre}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Puesto"
        value={puestoFiltro}
        onChange={(e) => onPuesto(e.target.value)}
        sx={{ width: 200, bgcolor: "background.paper" }}
        size="small"
      >
        <MenuItem value="Todos">Todos</MenuItem>
        {puestos.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.nombre}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Salario desde"
        type="number"
        value={salarioDesde}
        onChange={(e) => onSalarioDesde(e.target.value)}
        sx={{ width: 160, bgcolor: "background.paper" }}
        size="small"
      />

      <TextField
        label="Salario hasta"
        type="number"
        value={salarioHasta}
        onChange={(e) => onSalarioHasta(e.target.value)}
        sx={{ width: 160, bgcolor: "background.paper" }}
        size="small"
      />

      <Button variant="outlined" onClick={onClearFilters}>
        Limpiar
      </Button>

      {canCreate && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={onNuevo}>
          Nuevo
        </Button>
      )}
    </Box>
  );
}