import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import type { PeriodoNomina } from "../../../types/periodoNomina";

type Props = {
  periodos: PeriodoNomina[];
};

export function DashboardUpcomingPayments({ periodos }: Props) {
  const proximos = [...periodos]
    .filter((periodo) => periodo.estado === "Abierto")
    .sort(
      (a, b) =>
        new Date(a.fechaFin).getTime() -
        new Date(b.fechaFin).getTime()
    )
    .slice(0, 3);

  return (
    <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Próximos períodos
      </Typography>

      {proximos.length === 0 ? (
        <Typography color="text.secondary">
          No hay períodos abiertos.
        </Typography>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          {proximos.map((periodo) => (
            <Box
              key={periodo.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Box>
                <Typography fontWeight={700}>
                  {periodo.nombre}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {new Date(periodo.fechaInicio).toLocaleDateString("es-DO")}
                  {" — "}
                  {new Date(periodo.fechaFin).toLocaleDateString("es-DO")}
                </Typography>
              </Box>

              <Chip
                label={periodo.estado}
                color="info"
                size="small"
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}