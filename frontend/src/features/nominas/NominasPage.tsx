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
  MenuItem,
  TextField,
} from "@mui/material";
import { getNominas, pagarNomina } from "../../services/nominaService";
import type { NominaResumen } from "../../types/nomina";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { getNominaById } from "../../services/nominaService";
import type { Nomina } from "../../types/nomina";
import { descargarReciboPdf } from "../../services/nominaService";
import { useAuth } from "../../contexts/AuthContext";
import { generarNomina } from "../../services/nominaService";
import { getPeriodosNomina } from "../../services/periodoNominaService";
import type { PeriodoNomina } from "../../types/periodoNomina";
import  ConfirmDialog  from "../../components/common/ConfirmDialog";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { getConfiguracionSistema } from "../../services/configuracionService";

export function NominasPage() {
  const [nominas, setNominas] = useState<NominaResumen[]>([]);
  const [selectedNomina, setSelectedNomina] = useState<Nomina | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { hasRole } = useAuth();
  const [periodos, setPeriodos] = useState<PeriodoNomina[]>([]);
  const [periodoId, setPeriodoId] = useState("");
  const [nominaAPagar, setNominaAPagar] = useState<NominaResumen | Nomina | null>(null);
  const { showMessage } = useSnackbar();
  const [configSistema, setConfigSistema] = useState({
    moneda: "DOP",
    idioma: "es-DO"
  });

  const puedeGestionarNominas = hasRole("Administrador", "Contabilidad");

  useEffect(() => {
    getNominas().then(setNominas);
    getPeriodosNomina().then(setPeriodos);
    
    // Cargar configuración del sistema
    getConfiguracionSistema()
      .then(setConfigSistema)
      .catch(() => {
        // Mantener valores por defecto
        console.warn("No se pudo cargar la configuración del sistema");
      });
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

  async function handleGenerarNomina() {
    if (!periodoId) return;

    try {
      await generarNomina({
        empresaId: localStorage.getItem("empresaId")!,
        periodoNominaId: periodoId,
      });

      const data = await getNominas();
      setNominas(data);
      setPeriodoId("");

      showMessage("Nómina generada correctamente.", "success");
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ??
        "No se pudo generar la nómina.",
        "error"
      );
    }
  }

  async function confirmarPagoNomina() {
    if (!nominaAPagar) return;

    try {
      await pagarNomina(nominaAPagar.id);

      const data = await getNominas();
      setNominas(data);

      if (selectedNomina?.id === nominaAPagar.id) {
        setSelectedNomina({
          ...selectedNomina,
          estado: "Pagada",
        });
      }

      setNominaAPagar(null);
      showMessage("Nómina marcada como pagada correctamente.", "success");
    } catch (error: any) {
      showMessage(
        error.response?.data?.message ?? "No se pudo pagar la nómina.",
        "error"
      );
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">
          Nóminas
        </Typography>
      </Box>

      {/* Selector de período y botón generar nómina */}
      {puedeGestionarNominas && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            select
            label="Período"
            value={periodoId}
            onChange={(e) => setPeriodoId(e.target.value)}
            sx={{ minWidth: 280 }}
          >
            {periodos
              .filter((p) => p.estado === "Abierto")
              .map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nombre}
                </MenuItem>
              ))}
          </TextField>

          <Button
            variant="contained"
            disabled={!periodoId}
            onClick={handleGenerarNomina}
          >
            Generar nómina
          </Button>
        </Box>
      )}

      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Período</TableCell>
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
                <TableCell>
                  {periodos.find((p) => p.id === nomina.periodoNominaId)?.nombre ?? "-"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={nomina.estado}
                    color={nomina.estado === "Pagada" ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {formatCurrency(nomina.totalBruto, configSistema.moneda, configSistema.idioma)}
                </TableCell>
                <TableCell>
                  {formatCurrency(nomina.totalDeducciones, configSistema.moneda, configSistema.idioma)}
                </TableCell>
                <TableCell>
                  {formatCurrency(nomina.totalNeto, configSistema.moneda, configSistema.idioma)}
                </TableCell>
                <TableCell>{new Date(nomina.fechaGeneracion).toLocaleDateString("es-DO")}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleVerDetalle(nomina.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <Button
                    size="small"
                    variant="contained"
                    disabled={
                      nomina.estado === "Pagada" ||
                      !puedeGestionarNominas
                    }
                    onClick={() => setNominaAPagar(nomina)}
                  >
                    {nomina.estado === "Pagada" ? "Pagada" : "Pagar"}
                  </Button>

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
          <Typography variant="h6">
            {selectedNomina?.periodoNombre}
          </Typography>

          {selectedNomina && (
            <Chip
              label={selectedNomina.estado}
              color={selectedNomina.estado === "Pagada" ? "success" : "warning"}
              size="small"
              sx={{ mt: 1 }}
            />
          )}

          {/* Información de pago */}
          {selectedNomina?.estado === "Pagada" && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Pagada por: {selectedNomina.pagadaPorUsuario ?? "-"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Fecha de pago:{" "}
                {selectedNomina.fechaPago
                  ? new Date(selectedNomina.fechaPago).toLocaleString("es-DO")
                  : "-"}
              </Typography>
            </Box>
          )}

          {/* Resumen de totales */}
          {selectedNomina && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                },
                gap: 2,
                my: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total bruto
                </Typography>

                <Typography fontWeight={700}>
                  {formatCurrency(selectedNomina.totalBruto, configSistema.moneda, configSistema.idioma)}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Deducciones
                </Typography>

                <Typography fontWeight={700}>
                  {formatCurrency(selectedNomina.totalDeducciones, configSistema.moneda, configSistema.idioma)}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total neto
                </Typography>

                <Typography fontWeight={700} color="success.main">
                  {formatCurrency(selectedNomina.totalNeto, configSistema.moneda, configSistema.idioma)}
                </Typography>
              </Box>
            </Box>
          )}

          {selectedNomina?.detalles.map((d) => (
            <Box
              key={d.empleadoId}
              sx={{
                mb: 3,
                p: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {d.empleadoNombre}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {d.departamento} · {d.puesto}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography sx={{ mb: 1 }}>
                Salario base: {formatCurrency(d.salarioBase, configSistema.moneda, configSistema.idioma)}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                AFP: {formatCurrency(d.afp, configSistema.moneda, configSistema.idioma)}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                SFS: {formatCurrency(d.sfs, configSistema.moneda, configSistema.idioma)}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                ISR: {formatCurrency(d.isr, configSistema.moneda, configSistema.idioma)}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Horas extras: {formatCurrency(d.horasExtras ?? 0, configSistema.moneda, configSistema.idioma)}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Total ingresos: {formatCurrency(d.totalIngresos, configSistema.moneda, configSistema.idioma)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Neto a pagar: {formatCurrency(d.netoPagar, configSistema.moneda, configSistema.idioma)}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() =>
                    descargarReciboPdf(selectedNomina.id, d.empleadoId)
                  }
                >
                  Descargar PDF
                </Button>
              </Box>
            </Box>
          ))}
        </DialogContent>

        <DialogActions>
          {selectedNomina &&
            selectedNomina.estado !== "Pagada" &&
            puedeGestionarNominas && (
              <Button
                variant="contained"
                onClick={() => setNominaAPagar(selectedNomina)}
              >
                Marcar como pagada
              </Button>
            )}
          <Button onClick={() => setDetailOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para pagar nómina */}
      <ConfirmDialog
        open={Boolean(nominaAPagar)}
        title="Confirmar pago"
        message="¿Seguro que deseas marcar esta nómina como pagada? Esta acción quedará registrada en auditoría."
        confirmText="Marcar como pagada"
        onCancel={() => setNominaAPagar(null)}
        onConfirm={confirmarPagoNomina}
      />
    </Box>
  );
}