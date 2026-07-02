import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createEmpleado, getEmpleados } from "../../services/empleadoService";
import type { Empleado } from "../../types/empleado";

export function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    correo: "",
    direccion: "",
    fechaNacimiento: "",
    fechaIngreso: "",
    salarioBase: "",
    tipoContrato: "Indefinido",
    departamentoId: "",
    puestoId: "",
  });

  useEffect(() => {
    getEmpleados().then(setEmpleados);
  }, []);

  const empleadosFiltrados = empleados.filter((e) =>
    `${e.nombre} ${e.apellido} ${e.cedula} ${e.correo}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  async function handleCreateEmpleado() {
    if (
  !form.nombre ||
  !form.apellido ||
  !form.cedula ||
  !form.fechaNacimiento ||
  !form.fechaIngreso ||
  !form.salarioBase ||
  !form.departamentoId ||
  !form.puestoId
) {
  alert("Completa nombre, apellido, cédula, fechas, salario, departamento y puesto.");
  return;
}
  try {
    console.log("Guardando empleado...", form);

    const nuevoEmpleado = await createEmpleado({
      nombre: form.nombre,
      apellido: form.apellido,
      cedula: form.cedula,
      fechaNacimiento: `${form.fechaNacimiento}T00:00:00Z`,
      telefono: form.telefono,
      correo: form.correo,
      direccion: form.direccion,
      fechaIngreso: `${form.fechaIngreso}T00:00:00Z`,
      salarioBase: Number(form.salarioBase),
      tipoContrato: form.tipoContrato,
      empresaId: "019f0b03-c8d3-7e21-ad91-bbd182d5dfab",
      departamentoId: form.departamentoId,
      puestoId: form.puestoId,
    });

    setEmpleados([...empleados, nuevoEmpleado]);
    setOpen(false);
    alert("Empleado creado correctamente.");
  }  catch (error: any) {
  console.error("Error completo:", error);
  console.error("Respuesta backend:", error.response?.data);
  alert(error.response?.data?.message ?? "Error creando empleado.");
}
}

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4">Empleados</Typography>
          <Typography color="text.secondary">
            Gestión del personal registrado en la empresa.
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
        >
          Nuevo empleado
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Buscar por nombre, cédula o correo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, bgcolor: "#fff" }}
      />

      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Cédula</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Salario</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {empleadosFiltrados.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.nombre} {e.apellido}</TableCell>
                <TableCell>{e.cedula}</TableCell>
                <TableCell>{e.correo}</TableCell>
                <TableCell>RD${e.salarioBase.toLocaleString("es-DO")}</TableCell>
                <TableCell>
                  <Chip label={e.estado} color="success" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Nuevo empleado</DialogTitle>

        <DialogContent>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
            <TextField 
              label="Nombre" 
              value={form.nombre} 
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
            />
            <TextField 
              label="Apellido" 
              value={form.apellido} 
              onChange={(e) => setForm({ ...form, apellido: e.target.value })} 
            />
            <TextField 
              label="Cédula" 
              value={form.cedula} 
              onChange={(e) => setForm({ ...form, cedula: e.target.value })} 
            />
            <TextField 
              label="Teléfono" 
              value={form.telefono} 
              onChange={(e) => setForm({ ...form, telefono: e.target.value })} 
            />
            <TextField 
              label="Correo" 
              value={form.correo} 
              onChange={(e) => setForm({ ...form, correo: e.target.value })} 
            />
            <TextField 
              label="Dirección" 
              value={form.direccion} 
              onChange={(e) => setForm({ ...form, direccion: e.target.value })} 
            />
            <TextField 
              type="date" 
              label="Fecha nacimiento" 
              InputLabelProps={{ shrink: true }} 
              value={form.fechaNacimiento} 
              onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} 
            />
            <TextField 
              type="date" 
              label="Fecha ingreso" 
              InputLabelProps={{ shrink: true }} 
              value={form.fechaIngreso} 
              onChange={(e) => setForm({ ...form, fechaIngreso: e.target.value })} 
            />
            <TextField 
              label="Salario base" 
              type="number" 
              value={form.salarioBase} 
              onChange={(e) => setForm({ ...form, salarioBase: e.target.value })} 
            />
            <TextField 
              label="Tipo contrato" 
              value={form.tipoContrato} 
              onChange={(e) => setForm({ ...form, tipoContrato: e.target.value })} 
            />
            <TextField 
              label="Departamento ID" 
              value={form.departamentoId} 
              onChange={(e) => setForm({ ...form, departamentoId: e.target.value })} 
            />
            <TextField 
              label="Puesto ID" 
              value={form.puestoId} 
              onChange={(e) => setForm({ ...form, puestoId: e.target.value })} 
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateEmpleado}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}