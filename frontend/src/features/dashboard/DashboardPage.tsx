import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import { getNominas } from "../../services/nominaService";
import type { NominaResumen } from "../../types/nomina";

export function DashboardPage() {
  const [nominas, setNominas] = useState<NominaResumen[]>([]);

  useEffect(() => {
    getNominas().then(setNominas);
  }, []);

  const pagadas = nominas.filter((n) => n.estado === "Pagada").length;
  const totalNeto = nominas.reduce((sum, n) => sum + n.totalNeto, 0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Box sx={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 3 
      }}>
        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: "200px" }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Nóminas</Typography>
              <Typography variant="h4">{nominas.length}</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: "200px" }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Pagadas</Typography>
              <Typography variant="h4">{pagadas}</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: "200px" }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Total neto</Typography>
              <Typography variant="h5">
                RD${totalNeto.toLocaleString("es-DO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: "200px" }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", gap: 1, color: "primary.main" }}>
                <PaymentsIcon />
                <CheckCircleIcon />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}