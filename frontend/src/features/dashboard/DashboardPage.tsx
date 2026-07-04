import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Paper,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getNominas } from "../../services/nominaService";
import { getEmpleados } from "../../services/empleadoService";
import type { NominaResumen } from "../../types/nomina";
import type { Empleado } from "../../types/empleado";

export function DashboardPage() {
  const [nominas, setNominas] = useState<NominaResumen[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  useEffect(() => {
    getNominas().then(setNominas);
    getEmpleados().then(setEmpleados);
  }, []);

  const empleadosActivos = empleados.filter((e) => e.estado === "Activo").length;
  const pagadas = nominas.filter((n) => n.estado === "Pagada").length;
  const totalNeto = nominas.reduce((sum, n) => sum + n.totalNeto, 0);

  const chartData = nominas.map((n) => ({
    id: n.id.slice(0, 6),
    neto: n.totalNeto,
    bruto: n.totalBruto,
  }));

  const actividad = [
    {
      titulo: "Nómina generada",
      descripcion: "Nómina Junio 2026",
      fecha: "Hace 2 minutos",
    },
    {
      titulo: "Empleado registrado",
      descripcion: "Carlos Ramírez",
      fecha: "Hace 15 minutos",
    },
    {
      titulo: "Nómina pagada",
      descripcion: "Pago completado",
      fecha: "Hace 1 hora",
    },
  ];

  const cards = [
    { label: "Empleados activos", value: empleadosActivos, icon: <PeopleIcon /> },
    { label: "Nóminas", value: nominas.length, icon: <PaymentsIcon /> },
    { label: "Pagadas", value: pagadas, icon: <CheckCircleIcon /> },
    {
      label: "Total neto",
      value: `RD$${totalNeto.toLocaleString("es-DO", {
        minimumFractionDigits: 2,
      })}`,
      icon: <TrendingUpIcon />,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Resumen general de nómina, empleados y pagos.
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
        {cards.map((card) => (
          <Box key={card.label} sx={{ flex: "1 1 220px" }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography color="text.secondary">{card.label}</Typography>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                      {card.value}
                    </Typography>
                  </Box>

                  <Box sx={{ color: "primary.main" }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 3 }}>
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Nóminas generadas
            </Typography>

            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bruto" name="Bruto" />
                  <Bar dataKey="neto" name="Neto" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Actividad reciente
            </Typography>

            {actividad.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 2,
                  borderBottom:
                    index !== actividad.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
              >
                <Box>
                  <Typography fontWeight={600}>
                    {item.titulo}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.descripcion}
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {item.fecha}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Últimas nóminas
          </Typography>

          {nominas.slice(0, 5).map((n) => (
            <Box
              key={n.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                py: 1.5,
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <Box>
                <Typography fontWeight={600}>
                  Nómina {n.id.slice(0, 8)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(n.fechaGeneracion).toLocaleDateString("es-DO")}
                </Typography>
              </Box>

              <Typography fontWeight={700}>
                RD${n.totalNeto.toLocaleString("es-DO")}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}