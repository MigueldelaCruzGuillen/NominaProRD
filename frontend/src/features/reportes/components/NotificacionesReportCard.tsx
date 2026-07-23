import { Box, Button, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { ReporteCard } from "./ReporteCard";

type Props = {
  total: number;
  onExportExcel: () => void;
  onExportPdf: () => void;
};

export function NotificacionesReportCard({
  total,
  onExportExcel,
  onExportPdf,
}: Props) {
  return (
    <ReporteCard
      title="Reporte de notificaciones"
      description="Notificaciones generadas por el sistema."
      icon={<NotificationsIcon color="primary" />}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        {total} notificaciones registradas
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