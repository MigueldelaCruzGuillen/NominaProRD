import {
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaymentsIcon from "@mui/icons-material/Payments";
import BusinessIcon from "@mui/icons-material/Business";
import AssessmentIcon from "@mui/icons-material/Assessment";

type Props = {
  onNuevoEmpleado: () => void;
  onNuevaNomina: () => void;
  onEmpresa: () => void;
  onReportes: () => void;
};

export function DashboardQuickActions({
  onNuevoEmpleado,
  onNuevaNomina,
  onEmpresa,
  onReportes,
}: Props) {
  return (
    <Paper
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Acciones rápidas
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={onNuevoEmpleado}
          >
            Nuevo empleado
          </Button>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PaymentsIcon />}
            onClick={onNuevaNomina}
          >
            Nueva nómina
          </Button>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<BusinessIcon />}
            onClick={onEmpresa}
          >
            Empresa
          </Button>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AssessmentIcon />}
            onClick={onReportes}
          >
            Reportes
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}