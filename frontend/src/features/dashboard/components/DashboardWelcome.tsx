import {
  Avatar,
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import WavingHandIcon from "@mui/icons-material/WavingHand";

type Props = {
  usuario: string;
  empleados: number;
  nominasPendientes: number;
  periodosAbiertos: number;
};

export function DashboardWelcome({
  usuario,
  empleados,
  nominasPendientes,
  periodosAbiertos,
}: Props) {
  const hora = new Date().getHours();

  const saludo =
    hora < 12
      ? "Buenos días"
      : hora < 18
      ? "Buenas tardes"
      : "Buenas noches";

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
            }}
          >
            <WavingHandIcon />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight={700}>
              {saludo}, {usuario}
            </Typography>

            <Typography color="text.secondary">
              Bienvenido a NominaPro RD.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Chip
            color="success"
            label={`${empleados} empleados`}
          />

          <Chip
            color="warning"
            label={`${nominasPendientes} nóminas pendientes`}
          />

          <Chip
            color="info"
            label={`${periodosAbiertos} períodos abiertos`}
          />
        </Box>
      </Box>
    </Paper>
  );
}