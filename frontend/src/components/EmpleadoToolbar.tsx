import { Box, Button, MenuItem, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Props = {
  search: string;
  estado: string;
  onSearch: (value: string) => void;
  onEstado: (value: string) => void;
  onNuevo: () => void;
};

export function EmpleadoToolbar({
  search,
  estado,
  onSearch,
  onEstado,
  onNuevo,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 2,
        flexWrap: "wrap",
      }}
    >
      <TextField
        fullWidth
        placeholder="Buscar empleado..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <TextField
        select
        label="Estado"
        value={estado}
        onChange={(e) => onEstado(e.target.value)}
        sx={{ width: 180 }}
      >
        <MenuItem value="Activo">Activo</MenuItem>
        <MenuItem value="Inactivo">Inactivo</MenuItem>
        <MenuItem value="Todos">Todos</MenuItem>
      </TextField>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onNuevo}
      >
        Nuevo
      </Button>
    </Box>
  );
}