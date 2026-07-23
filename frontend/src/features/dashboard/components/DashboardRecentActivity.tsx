import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import type { Auditoria } from "../../../services/auditoriaService";

type Props = {
  auditorias: Auditoria[];
};

export function DashboardRecentActivity({ auditorias }: Props) {
  const recientes = auditorias.slice(0, 6);

  return (
    <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Actividad reciente
      </Typography>

      {recientes.length === 0 ? (
        <Typography color="text.secondary">
          No hay actividad reciente.
        </Typography>
      ) : (
        recientes.map((actividad, index) => (
          <Box
            key={actividad.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
              py: 1.5,
              borderBottom:
                index < recientes.length - 1
                  ? "1px solid"
                  : "none",
              borderColor: "divider",
            }}
          >
            <Box>
              <Typography fontWeight={600}>
                {actividad.usuario}
              </Typography>

              <Typography variant="body2" sx={{ my: 0.5 }}>
                {actividad.descripcion}
              </Typography>

              <Chip
                label={`${actividad.modulo} · ${actividad.accion}`}
                size="small"
                variant="outlined"
              />
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ whiteSpace: "nowrap" }}
            >
              {new Date(actividad.fecha).toLocaleString("es-DO")}
            </Typography>
          </Box>
        ))
      )}
    </Paper>
  );
}