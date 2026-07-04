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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Divider,
} from "@mui/material";
import { getNominas, pagarNomina } from "../../services/nominaService";
import type { NominaResumen } from "../../types/nomina";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PaidIcon from "@mui/icons-material/Paid";
import { getNominaById } from "../../services/nominaService";
import type { Nomina } from "../../types/nomina";
import { descargarReciboPdf } from "../../services/nominaService";

export function NominasPage() {
  const [nominas, setNominas] = useState<NominaResumen[]>([]);
  const [selectedNomina, setSelectedNomina] = useState<Nomina | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    getNominas().then(setNominas);
  }, []);

  async function handlePagar(id: string) {
    await pagarNomina(id);
    const data = await getNominas();
    setNominas(data);
  }

  async function handleVerDetalle(id: string) {
    const data = await getNominaById(id);
    setSelectedNomina(data);
    setDetailOpen(true);
  }

  function handleGenerarPDF(id: string) {
    // Lógica para generar PDF
    console.log("Generar PDF de nómina:", id);
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
              <TableCell align="center">Acciones</TableCell>
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
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleVerDetalle(nomina.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton
                    color="success"
                    disabled={nomina.estado === "Pagada"}
                    onClick={() => handlePagar(nomina.id)}
                  >
                    <PaidIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => handleGenerarPDF(nomina.id)}
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Diálogo fuera del map */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalle de Nómina</DialogTitle>

        <DialogContent>
          {selectedNomina?.detalles.map((d) => (
            <Box key={d.empleadoId} sx={{ mb: 3 }}>
              <Typography variant="h6">{d.empleadoNombre}</Typography>
              <Typography color="text.secondary">
                {d.departamento} · {d.puesto}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography>
                Salario base: RD${d.salarioBase.toLocaleString("es-DO")}
              </Typography>
              <Typography>
                AFP: RD${d.afp.toLocaleString("es-DO")}
              </Typography>
              <Typography>
                SFS: RD${d.sfs.toLocaleString("es-DO")}
              </Typography>
              <Typography>
                ISR: RD${d.isr.toLocaleString("es-DO")}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography fontWeight={700}>
                Neto a pagar: RD${d.netoPagar.toLocaleString("es-DO")}
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => descargarReciboPdf(selectedNomina.id, d.empleadoId)}
              >
                Descargar PDF
              </Button>
            </Box>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}