import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import HistoryIcon from "@mui/icons-material/History";

import { ReporteCard } from "./ReporteCard";

type Props = {
  usuario: string;
  modulo: string;
  accion: string;
  usuarios: string[];
  modulos: string[];
  acciones: string[];
  total: number;
  onUsuarioChange: (value: string) => void;
  onModuloChange: (value: string) => void;
  onAccionChange: (value: string) => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
};

export function AuditoriaReportCard({
  usuario,
  modulo,
  accion,
  usuarios,
  modulos,
  acciones,
  total,
  onUsuarioChange,
  onModuloChange,
  onAccionChange,
  onExportExcel,
  onExportPdf,
}: Props) {
  return (
    <ReporteCard
      title="Reporte de auditoría"
      icon={<HistoryIcon color="primary" />}
    >
      <TextField
        select
        fullWidth
        label="Usuario"
        value={usuario}
        onChange={(e) => onUsuarioChange(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
      >
        <MenuItem value="Todos">Todos</MenuItem>

        {usuarios.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Módulo"
        value={modulo}
        onChange={(e) => onModuloChange(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
      >
        <MenuItem value="Todos">Todos</MenuItem>

        {modulos.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Acción"
        value={accion}
        onChange={(e) => onAccionChange(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
      >
        <MenuItem value="Todos">Todos</MenuItem>

        {acciones.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {total} registros encontrados
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