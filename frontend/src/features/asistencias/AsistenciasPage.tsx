import { useEffect, useState } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import type { Asistencia } from "../../types/asistencia";
import { getAsistenciasByEmpleado } from "../../services/asistenciaService";

const empleadoId = "019f1504-4501-7102-93fb-c63d98590a5c";

export function AsistenciasPage() {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);

  useEffect(() => {
    getAsistenciasByEmpleado(empleadoId).then(setAsistencias);
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Asistencias</Typography>

      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Entrada</TableCell>
              <TableCell>Salida</TableCell>
              <TableCell>Horas</TableCell>
              <TableCell>Extras</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {asistencias.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{new Date(a.fecha).toLocaleDateString("es-DO")}</TableCell>
                <TableCell>{new Date(a.horaEntrada).toLocaleTimeString("es-DO")}</TableCell>
                <TableCell>{a.horaSalida ? new Date(a.horaSalida).toLocaleTimeString("es-DO") : "-"}</TableCell>
                <TableCell>{a.horasTrabajadas}</TableCell>
                <TableCell>{a.horasExtras}</TableCell>
                <TableCell>{a.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}