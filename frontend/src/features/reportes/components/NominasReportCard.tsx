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
import type { PeriodoNomina } from "../../../types/periodoNomina";

type Props = {
  estado: string;
  periodoId: string;
  periodos: PeriodoNomina[];
  total: number;
  onEstadoChange: (value: string) => void;
  onPeriodoChange: (value: string) => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
};

export function NominasReportCard({
  estado,
  periodoId,
  periodos,
  total,
  onEstadoChange,
  onPeriodoChange,
  onExportExcel,
  onExportPdf,
}: Props) {
  return (
    <ReporteCard title="Reporte de nóminas">
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
        <MenuItem value="Pendiente">Pendiente</MenuItem>
        <MenuItem value="Pagada">Pagada</MenuItem>
      </TextField>

      <TextField
        select
        fullWidth
        label="Período"
        value={periodoId}
        onChange={(e) => onPeriodoChange(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
      >
        <MenuItem value="Todos">Todos</MenuItem>

        {periodos.map((periodo) => (
          <MenuItem
            key={periodo.id}
            value={periodo.id}
          >
            {periodo.nombre}
          </MenuItem>
        ))}
      </TextField>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        {total} nóminas encontradas
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