import { Box, Button, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { ReporteCard } from "./ReporteCard";

type Props = {
  total: number;
  onExportExcel: () => void;
  onExportPdf: () => void;
};

export function UsuariosReportCard({
  total,
  onExportExcel,
  onExportPdf,
}: Props) {
  return (
    <ReporteCard
      title="Reporte de usuarios"
      description="Usuarios, roles y estado de acceso."
      icon={<PeopleAltIcon color="primary" />}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        {total} usuarios registrados
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