import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createEmpleado, getEmpleados, updateEmpleado } from "../../services/empleadoService";
import type { Empleado } from "../../types/empleado";
import { getDepartamentos } from "../../services/departamentoService";
import { getPuestos } from "../../services/puestoService";
import type { Departamento } from "../../types/departamento";
import type { Puesto } from "../../types/puesto";
import { deleteEmpleado } from "../../services/empleadoService";
import AppSnackbar from "../../components/AppSnackbar";
import { EmpleadoToolbar } from "../../components/EmpleadoToolbar";
import { EmpleadoTable } from "./EmpleadoTable";
import { EmpleadoDialog } from "./EmpleadoDialog";
import { useEmpleados } from "./hooks/useEmpleados";

// Constante fuera del componente
const initialForm = {
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
};

export function EmpleadosPage() {
    const { empleados, setEmpleados, loading, cargarEmpleados } = useEmpleados();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [puestos, setPuestos] = useState<Puesto[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [estadoFiltro, setEstadoFiltro] = useState("Activo");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // useState usando la constante
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        getDepartamentos().then(setDepartamentos);
        getPuestos().then(setPuestos);
    }, []);

    const empleadosFiltrados = empleados
        .filter((e) =>
            estadoFiltro === "Todos" ? true : e.estado === estadoFiltro
        )
        .filter((e) =>
            `${e.nombre} ${e.apellido} ${e.cedula} ${e.correo}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    function handleEdit(empleado: Empleado) {
        setEditingId(empleado.id);

        setForm({
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            cedula: empleado.cedula,
            telefono: empleado.telefono,
            correo: empleado.correo,
            direccion: empleado.direccion,
            fechaNacimiento: empleado.fechaNacimiento.substring(0, 10),
            fechaIngreso: empleado.fechaIngreso.substring(0, 10),
            salarioBase: empleado.salarioBase.toString(),
            tipoContrato: empleado.tipoContrato,
            departamentoId: empleado.departamentoId,
            puestoId: empleado.puestoId,
        });

        setOpen(true);
    }

    async function handleDeleteEmpleado(empleado: Empleado) {
        const confirmar = confirm(
            `¿Seguro que deseas eliminar a ${empleado.nombre} ${empleado.apellido}?`
        );

        if (!confirmar) return;

        await deleteEmpleado(empleado.id);

        setEmpleados(
            empleados.map((e) =>
                e.id === empleado.id ? { ...e, estado: "Inactivo" } : e
            )
        );

        setSnackbar({
            open: true,
            message: "Empleado desactivado.",
            severity: "warning"
        });
    }

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
            // Reiniciar el formulario después de crear
            setForm(initialForm);
            setEditingId(null);

            setSnackbar({
                open: true,
                message: "Empleado creado correctamente.",
                severity: "success"
            });
        } catch (error: any) {
            console.error("Error completo:", error);
            console.error("Respuesta backend:", error.response?.data);
        }
    }

    async function handleUpdateEmpleado() {
        if (!editingId) return;

        try {
            await updateEmpleado(editingId, {
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

            const lista = await getEmpleados();
            setEmpleados(lista);

            setOpen(false);
            setEditingId(null);
            setForm(initialForm);

            setSnackbar({
                open: true,
                message: "Empleado actualizado.",
                severity: "success"
            });
        } catch (error: any) {
            console.error(error);
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
                    onClick={() => {
                        setEditingId(null);
                        setForm(initialForm);
                        setOpen(true);
                    }}
                >
                    Nuevo empleado
                </Button>
            </Box>

            <EmpleadoToolbar
                search={search}
                estado={estadoFiltro}
                onSearch={setSearch}
                onEstado={setEstadoFiltro}
                onNuevo={() => {
                    setEditingId(null);
                    setForm(initialForm);
                    setOpen(true);
                }}
            />

            <EmpleadoTable
                empleados={empleadosFiltrados}
                departamentos={departamentos}
                puestos={puestos}
                onEdit={handleEdit}
                onDelete={handleDeleteEmpleado}
            />

            <EmpleadoDialog
                open={open}
                editingId={editingId}
                form={form}
                departamentos={departamentos}
                puestos={puestos}
                onClose={() => {
                    setOpen(false);
                    setEditingId(null);
                    setForm(initialForm);
                }}
                onChange={setForm}
                onSubmit={editingId ? handleUpdateEmpleado : handleCreateEmpleado}
            />

            {/* Snackbar */}
            <AppSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity as any}
                onClose={() =>
                    setSnackbar({ ...snackbar, open: false })
                }
            />
        </Box>
    );
}