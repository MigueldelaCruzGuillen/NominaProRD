import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FadeIn } from "../../../components/common/FadeIn";

type GastoMensual = {
  mes: string;
  total: number;
};

type EmpleadosDepartamento = {
  nombre: string;
  cantidad: number;
};

type Props = {
  gastoPorMes: GastoMensual[];
  empleadosPorDepartamento: EmpleadosDepartamento[];
};

export function DashboardCharts({
  gastoPorMes,
  empleadosPorDepartamento,
}: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "1.7fr 1fr",
        },
        gap: 2,
        mt: 3,
      }}
    >
      <FadeIn delay={0.35}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Gasto salarial por mes
          </Typography>

          <Box sx={{ color: "primary.main", width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={gastoPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    Number(value).toLocaleString("es-DO", {
                      style: "currency",
                      currency: "DOP",
                    })
                  }
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </FadeIn>

      <FadeIn delay={0.50}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Empleados por departamento
          </Typography>

          <Box sx={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={empleadosPorDepartamento}
                  dataKey="cantidad"
                  nameKey="nombre"
                  outerRadius={100}
                  label
                >
                  {empleadosPorDepartamento.map((item, index) => (
                    <Cell
                      key={item.nombre}
                      fill={[
                        "#2563eb",
                        "#16a34a",
                        "#f59e0b",
                        "#dc2626",
                        "#7c3aed",
                        "#0891b2",
                      ][index % 6]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </FadeIn>
    </Box>
  );
}