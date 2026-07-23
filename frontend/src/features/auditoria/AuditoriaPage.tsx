import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  MenuItem,
  TextField,
  TablePagination,
} from "@mui/material";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  getAuditorias,
  type Auditoria,
} from "../../services/auditoriaService";
import { exportToExcel } from "../../utils/exportExcel";

export function AuditoriaPage() {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [search, setSearch] = useState("");
  const [moduloFiltro, setModuloFiltro] = useState("Todos");
  const [accionFiltro, setAccionFiltro] = useState("Todos");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getAuditorias().then(setAuditorias);
  }, []);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPage(0);
  }, [search, moduloFiltro, accionFiltro]);

  const auditoriasFiltradas = auditorias
    .filter((a) =>
      moduloFiltro === "Todos" ? true : a.modulo === moduloFiltro
    )
    .filter((a) =>
      accionFiltro === "Todos" ? true : a.accion === accionFiltro
    )
    .filter((a) =>
      `${a.usuario} ${a.modulo} ${a.accion} ${a.descripcion}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const auditoriasPaginadas = auditoriasFiltradas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getColorByAccion = (accion: string) => {
    switch (accion) {
      case "Crear":
        return "success";
      case "Desactivar":
        return "error";
      case "Generar":
        return "info";
      case "Pagar":
        return "warning";
      case "Editar":
        return "primary";
      default:
        return "default";
    }
  };

  function exportarAuditoria() {
    exportToExcel(
      auditoriasFiltradas.map((a) => ({
        Fecha: new Date(a.fecha).toLocaleString("es-DO"),
        Usuario: a.usuario,
        Modulo: a.modulo,
        Accion: a.accion,
        Descripcion: a.descripcion,
        IP: a.ip ?? "",
      })),
      "reporte-auditoria",
      "Auditoria"
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Auditoría
      </Typography>

      {/* Filtros y búsqueda */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280 }}
        />

        <TextField
          select
          label="Módulo"
          value={moduloFiltro}
          onChange={(e) => setModuloFiltro(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Empleados">Empleados</MenuItem>
          <MenuItem value="Nóminas">Nóminas</MenuItem>
          <MenuItem value="Configuración">Configuración</MenuItem>
        </TextField>

        <TextField
          select
          label="Acción"
          value={accionFiltro}
          onChange={(e) => setAccionFiltro(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="Todos">Todas</MenuItem>
          <MenuItem value="Crear">Crear</MenuItem>
          <MenuItem value="Desactivar">Desactivar</MenuItem>
          <MenuItem value="Generar">Generar</MenuItem>
          <MenuItem value="Pagar">Pagar</MenuItem>
          <MenuItem value="Editar">Editar</MenuItem>
        </TextField>

        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={exportarAuditoria}
        >
          Exportar Excel
        </Button>
      </Box>

      {/* Tabla de auditoría */}
      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Módulo</TableCell>
              <TableCell>Acción</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {auditoriasPaginadas.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.usuario}</TableCell>
                <TableCell>{a.modulo}</TableCell>
                <TableCell>
                  <Chip
                    label={a.accion}
                    color={getColorByAccion(a.accion)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{a.descripcion}</TableCell>
                <TableCell>
                  {new Date(a.fecha).toLocaleString("es-DO")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={auditoriasFiltradas.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}