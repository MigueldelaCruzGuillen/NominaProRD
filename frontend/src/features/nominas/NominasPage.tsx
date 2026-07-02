import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getNominas, pagarNomina } from "../../services/nominaService";
import type { NominaResumen } from "../../types/nomina";

export function NominasPage() {
  const [nominas, setNominas] = useState<NominaResumen[]>([]);

  useEffect(() => {
    getNominas().then(setNominas);
  }, []);

  async function handlePagar(id: string) {
    await pagarNomina(id);
    const data = await getNominas();
    setNominas(data);
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Nóminas
      </Typography>

      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total bruto</TableCell>
              <TableCell>Deducciones</TableCell>
              <TableCell>Total neto</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {nominas.map((nomina) => (
              <TableRow key={nomina.id}>
                <TableCell>{nomina.id.slice(0, 8)}...</TableCell>
                <TableCell>
                  <Chip
                    label={nomina.estado}
                    color={nomina.estado === "Pagada" ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell>RD${nomina.totalBruto.toLocaleString("es-DO")}</TableCell>
                <TableCell>RD${nomina.totalDeducciones.toLocaleString("es-DO")}</TableCell>
                <TableCell>RD${nomina.totalNeto.toLocaleString("es-DO")}</TableCell>
                <TableCell>{new Date(nomina.fechaGeneracion).toLocaleDateString("es-DO")}</TableCell>
                <TableCell>
                <Button
                  size="small"
                  variant="contained"
                  disabled={nomina.estado === "Pagada"}
                  onClick={() => handlePagar(nomina.id)}
                 >
                 {nomina.estado === "Pagada" ? "Pagada" : "Pagar"}
               </Button>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}