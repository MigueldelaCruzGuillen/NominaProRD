import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getPeriodosNomina } from "../../services/periodoNominaService";
import type { PeriodoNomina } from "../../types/periodoNomina";

export function PeriodosPage() {
  const [periodos, setPeriodos] = useState<PeriodoNomina[]>([]);

  useEffect(() => {
    getPeriodosNomina().then(setPeriodos);
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Períodos de Nómina
      </Typography>

      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {periodos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{new Date(p.fechaInicio).toLocaleDateString("es-DO")}</TableCell>
                <TableCell>{new Date(p.fechaFin).toLocaleDateString("es-DO")}</TableCell>
                <TableCell>{p.tipo}</TableCell>
                <TableCell>
                  <Chip
                    label={p.estado}
                    color={p.estado === "Cerrado" ? "default" : "success"}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}