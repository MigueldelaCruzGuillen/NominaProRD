import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createEmpleado, updateEmpleado, deleteEmpleado } from "../../services/empleadoService";
import type { Empleado } from "../../types/empleado";
import { getDepartamentos } from "../../services/departamentoService";
import { getPuestos } from "../../services/puestoService";
import type { Departamento } from "../../types/departamento";
import type { Puesto } from "../../types/puesto";
import AppSnackbar from "../../components/AppSnackbar";
import { EmpleadoToolbar } from "./EmpleadoToolbar";
import { EmpleadoTable } from "./EmpleadoTable";
import { EmpleadoDialog } from "./EmpleadoDialog";
import { EmpleadoDetailsDialog } from "./EmpleadoDetailsDialog";
import { useEmpleados } from "./hooks/useEmpleados";
import { PageHeader } from "../../components/common/PageHeader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";
import { useConfiguracion } from "../../contexts/ConfiguracionContext";

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
    const { hasRole } = useAuth();
    const { configuracion } = useConfiguracion();
    const puedeGestionarEmpleados = hasRole("Administrador", "RRHH");
    const [departamentoFiltro, setDepartamentoFiltro] = useState("Todos");
    const [puestoFiltro, setPuestoFiltro] = useState("Todos");
    const { empleados, setEmpleados } = useEmpleados();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [puestos, setPuestos] = useState<Puesto[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState<Empleado | null>(null);
    const [empleadoDetalle, setEmpleadoDetalle] = useState<Empleado | null>(null);
    const [estadoFiltro, setEstadoFiltro] = useState("Activo");
    const [salarioDesde, setSalarioDesde] = useState("");
    const [salarioHasta, setSalarioHasta] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
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
        ?.filter((e) =>
            estadoFiltro === "Todos" ? true : e.estado === estadoFiltro
        )
        ?.filter((e) =>
            departamentoFiltro === "Todos" ? true : e.departamentoId === departamentoFiltro
        )
        ?.filter((e) =>
            puestoFiltro === "Todos" ? true : e.puestoId === puestoFiltro
        )
        ?.filter((e) =>
            salarioDesde ? e.salarioBase >= Number(salarioDesde) : true
        )
        ?.filter((e) =>
            salarioHasta ? e.salarioBase <= Number(salarioHasta) : true
        )
        ?.filter((e) =>
            `${e.nombre} ${e.apellido} ${e.cedula} ${e.correo}`
                .toLowerCase()
                .includes(search.toLowerCase())
        ) || [];

    function toggleEmpleado(id: string) {
        setSelected((prev) => {
            if (prev.includes(id)) {
                return prev.filter((x) => x !== id);
            } else {
                return [...prev, id];
            }
        });
    }

    function toggleTodos() {
        setSelected((prev) => {
            // Si ya estÃ¡n todos seleccionados, deseleccionar todos
            if (prev.length === empleadosFiltrados.length && empleadosFiltrados.length > 0) {
                return [];
            }
            // Si no, seleccionar todos los que estÃ¡n filtrados actualmente
            return empleadosFiltrados.map((e) => e.id);
        });
    }

    async function desactivarSeleccionados() {
        if (selected.length === 0) return;

        const confirmar = confirm(`Â¿Desactivar ${selected.length} empleados?`);
        if (!confirmar) return;

        try {
            await Promise.all(selected.map((id) => deleteEmpleado(id)));

            setEmpleados(
                empleados.map((e) =>
                    selected.includes(e.id) ? { ...e, estado: "Inactivo" } : e
                )
            );

            setSelected([]);

            setSnackbar({
                open: true,
                message: `${selected.length} empleado(s) desactivado(s) correctamente.`,
                severity: "warning"
            });
        } catch (error: any) {
            console.error("Error al desactivar empleados:", error);
            setSnackbar({
                open: true,
                message: "Error al desactivar los empleados.",
                severity: "error"
            });
        }
    }

    function handleEdit(empleado: Empleado) {
        setEditingId(empleado.id);

        setForm({
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            cedula: empleado.cedula,
            telefono: empleado.telefono,
            correo: empleado.correo,
            direccion: empleado.direccion,
            fechaNacimiento: empleado.fechaNacimiento
                ? empleado.fechaNacimiento.substring(0, 10)
                : "",

            fechaIngreso: empleado.fechaIngreso
                ? empleado.fechaIngreso.substring(0, 10)
                : "",
            salarioBase: empleado.salarioBase.toString(),
            tipoContrato: empleado.tipoContrato,
            departamentoId: empleado.departamentoId,
            puestoId: empleado.puestoId,
        });

        setOpen(true);
    }

    // 3. Reemplazar handleDeleteEmpleado
    function handleDeleteEmpleado(empleado: Empleado) {
        setEmpleadoAEliminar(empleado);
    }

    // 4. Crear funciÃ³n confirmarEliminarEmpleado
    async function confirmarEliminarEmpleado() {
        if (!empleadoAEliminar) return;

        await deleteEmpleado(empleadoAEliminar.id);

        setEmpleados(
            empleados.map((e) =>
                e.id === empleadoAEliminar.id
                    ? { ...e, estado: "Inactivo" }
                    : e
            )
        );

        setEmpleadoAEliminar(null);

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
            // Reiniciar el formulario despuÃ©s de crear
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
            const empleadoActualizado = await updateEmpleado(editingId, {
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

            setEmpleados((actuales) =>
                actuales.map((e) =>
                    e.id === empleadoActualizado.id ? empleadoActualizado : e
                )
            );

            setOpen(false);
            setEditingId(null);
            setForm(initialForm);

            setSnackbar({
                open: true,
                message: "Empleado actualizado correctamente.",
                severity: "success"
            });
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message ?? "No se pudo actualizar el empleado.",
                severity: "error"
            });
        }
    }

    return (
        <Box>
            <PageHeader
                title="Empleados"
                subtitle="GestiÃ³n del personal registrado."
                action={
                    puedeGestionarEmpleados ? (
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
                    ) : undefined
                }
            />

            <EmpleadoToolbar
                search={search}
                estado={estadoFiltro}
                departamentoFiltro={departamentoFiltro}
                puestoFiltro={puestoFiltro}
                departamentos={departamentos}
                puestos={puestos}
                salarioDesde={salarioDesde}
                salarioHasta={salarioHasta}
                onSearch={setSearch}
                onEstado={setEstadoFiltro}
                onDepartamento={setDepartamentoFiltro}
                onPuesto={setPuestoFiltro}
                onSalarioDesde={setSalarioDesde}
                onSalarioHasta={setSalarioHasta}
                canCreate={puedeGestionarEmpleados}
                onClearFilters={() => {
                    setSearch("");
                    setEstadoFiltro("Activo");
                    setDepartamentoFiltro("Todos");
                    setPuestoFiltro("Todos");
                    setSalarioDesde("");
                    setSalarioHasta("");
                }}
                onNuevo={() => {
                    setEditingId(null);
                    setForm(initialForm);
                    setOpen(true);
                }}
            />

            {puedeGestionarEmpleados && selected.length > 0 && (
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography>{selected.length} seleccionados</Typography>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={desactivarSeleccionados}
                    >
                        Desactivar seleccionados
                    </Button>
                </Box>
            )}

            <EmpleadoTable
                empleados={empleadosFiltrados}
                departamentos={departamentos}
                puestos={puestos}
                selected={selected}
                onEdit={handleEdit}
                onDelete={handleDeleteEmpleado}
                onView={setEmpleadoDetalle}
                onToggle={toggleEmpleado}
                onToggleAll={toggleTodos}
                canManage={puedeGestionarEmpleados}
                configSistema={{
                    moneda: configuracion.moneda,
                    idioma: configuracion.idioma,
                }}
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

            {/* ConfirmDialog */}
            <ConfirmDialog
                open={Boolean(empleadoAEliminar)}
                title="Desactivar empleado"
                message={`Â¿Seguro que deseas desactivar a ${empleadoAEliminar?.nombre} ${empleadoAEliminar?.apellido}?`}
                confirmText="Desactivar"
                onClose={() => setEmpleadoAEliminar(null)}
                onConfirm={confirmarEliminarEmpleado}
            />

            {/* EmpleadoDetailsDialog */}
            <EmpleadoDetailsDialog
                canEdit={puedeGestionarEmpleados}
                onEdit={handleEdit}
                open={Boolean(empleadoDetalle)}
                empleado={empleadoDetalle}
                departamentos={departamentos}
                puestos={puestos}
                onClose={() => setEmpleadoDetalle(null)}
                configSistema={{
                    moneda: configuracion.moneda,
                    idioma: configuracion.idioma,
                }}
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

