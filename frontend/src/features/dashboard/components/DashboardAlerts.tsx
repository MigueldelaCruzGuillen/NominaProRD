import {
  Alert,
  Box,
  Paper,
  Typography,
} from "@mui/material";

type Props = {
  empleadosInactivos: number;
  periodosAbiertos: number;
  nominasPendientes: number;
};

export function DashboardAlerts({
  empleadosInactivos,
  periodosAbiertos,
  nominasPendientes,
}: Props) {
  const sinAlertas =
    empleadosInactivos === 0 &&
    periodosAbiertos === 0 &&
    nominasPendientes === 0;

  return (
    <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Alertas del sistema
      </Typography>

      {sinAlertas ? (
        <Alert severity="success">
          No hay alertas pendientes.
        </Alert>
      ) : (
        <Box sx={{ display: "grid", gap: 1.5 }}>
          {nominasPendientes > 0 && (
            <Alert severity="warning">
              Hay {nominasPendientes} nómina(s) pendiente(s) de pago.
            </Alert>
          )}

          {periodosAbiertos > 0 && (
            <Alert severity="info">
              Hay {periodosAbiertos} período(s) de nómina abierto(s).
            </Alert>
          )}

          {empleadosInactivos > 0 && (
            <Alert severity="warning">
              Hay {empleadosInactivos} empleado(s) inactivo(s).
            </Alert>
          )}
        </Box>
      )}
    </Paper>
  );
}