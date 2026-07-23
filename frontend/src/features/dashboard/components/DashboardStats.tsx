import GroupsIcon from "@mui/icons-material/Groups";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ApartmentIcon from "@mui/icons-material/Apartment";

import {
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { FadeIn } from "../../../components/common/FadeIn";

type Props = {
  empleados: number;
  nominas: number;
  gastoMensual: number;
  departamentos: number;
};

export function DashboardStats({
  empleados,
  nominas,
  gastoMensual,
  departamentos,
}: Props) {
  const cards = [
    {
      titulo: "Empleados",
      valor: empleados,
      icon: <GroupsIcon color="primary" />,
    },
    {
      titulo: "Nóminas",
      valor: nominas,
      icon: <PaymentsIcon color="primary" />,
    },
    {
      titulo: "Gasto mensual",
      valor: gastoMensual.toLocaleString("es-DO", {
        style: "currency",
        currency: "DOP",
      }),
      icon: <AccountBalanceWalletIcon color="success" />,
    },
    {
      titulo: "Departamentos",
      valor: departamentos,
      icon: <ApartmentIcon color="warning" />,
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid
          key={card.titulo}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <FadeIn delay={index * 0.08}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: 130,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {card.titulo}
                </Typography>

                {card.icon}
              </Box>

              <Typography
                variant="h5"
                fontWeight={700}
              >
                {card.valor}
              </Typography>
            </Paper>
          </FadeIn>
        </Grid>
      ))}
    </Grid>
  );
}