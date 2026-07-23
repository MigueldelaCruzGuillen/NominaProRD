import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { ReporteCard } from "./ReporteCard";
import type { Departamento } from "../../../types/departamento";

type Props = {
  estado: string;
  departamentoId: string;
  departamentos: Departamento[];
  total: number;
  onEstadoChange: (value: string) => void;
  onDepartamentoChange: (value: string) => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
};

export function EmpleadosReportCard({
  estado,
  departamentoId,
  departamentos,
  total,
  onEstadoChange,
  onDepartamentoChange,
  onExportExcel,
  onExportPdf,
}: Props) {
  return (
    <ReporteCard title="Reporte de empleados">
      <TextField
        select
        fullWidth
        label="Estado"
        value={estado}
        onChange={(e) => onEstadoChange(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
      >
        <MenuItem value="Todos">Todos</MenuItem>
        <MenuItem value="Activo">Activo</MenuItem>
        <MenuItem value="Inactivo">Inactivo</MenuItem>
      </TextField>

      <TextField
        select
        fullWidth
        label="Departamento"
        value={departamentoId}
        onChange={(e) => onDepartamentoChange(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
      >
        <MenuItem value="Todos">Todos</MenuItem>

        {departamentos.map((departamento) => (
          <MenuItem key={departamento.id} value={departamento.id}>
            {departamento.nombre}
          </MenuItem>
        ))}
      </TextField>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {total} empleados encontrados
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={onExportExcel}
          fullWidth
          disabled={total === 0}
        >
          Exportar Excel
        </Button>

        <Button
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          onClick={onExportPdf}
          disabled={total === 0}
        >
          PDF
        </Button>
      </Box>
    </ReporteCard>
  );
}