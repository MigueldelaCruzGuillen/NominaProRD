import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getEmpleados } from "../../services/empleadoService";
import type { Empleado } from "../../types/empleado";
import { exportToExcel } from "../../utils/exportExcel";
import { getNominas } from "../../services/nominaService";
import type { NominaResumen } from "../../types/nomina";
import { 
  exportAuditoriaPdf, 
  exportEmpleadosPdf, 
  exportNominasPdf, 
  exportUsuariosPdf,
  exportNotificacionesPdf,
} from "../../utils/exportPdf";
import { getUsuarios } from "../../services/usuarioService";
import type { Usuario } from "../../types/usuario";
import { getAuditorias, type Auditoria } from "../../services/auditoriaService";
import { getNotificaciones, type Notificacion } from "../../services/notificacionService";
import { getDepartamentos } from "../../services/departamentoService";
import type { Departamento } from "../../types/departamento";
import { getPeriodosNomina } from "../../services/periodoNominaService";
import type { PeriodoNomina } from "../../types/periodoNomina";
import { getPuestos } from "../../services/puestoService";
import type { Puesto } from "../../types/puesto";
import { getEmpresas } from "../../services/empresaService";
import { getConfiguracionSistema } from "../../services/configuracionService";
import { EmpleadosReportCard } from "./components/EmpleadosReportCard";
import { NominasReportCard } from "./components/NominasReportCard";
import { UsuariosReportCard } from "./components/UsuariosReportCard";
import { AuditoriaReportCard } from "./components/AuditoriaReportCard";
import { NotificacionesReportCard } from "./components/NotificacionesReportCard";

export function ReportesPage() {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [nominas, setNominas] = useState<NominaResumen[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [periodos, setPeriodos] = useState<PeriodoNomina[]>([]);
    const [puestos, setPuestos] = useState<Puesto[]>([]);
    const [empresa, setEmpresa] = useState<{
        nombre: string;
        rnc: string;
        direccion: string;
        telefono: string;
    } | null>(null);
    const [configSistema, setConfigSistema] = useState({
        moneda: "DOP",
        idioma: "es-DO"
    });

    const [estadoEmpleado, setEstadoEmpleado] = useState("Todos");
    const [departamentoEmpleado, setDepartamentoEmpleado] = useState("Todos");
    const [estadoNomina, setEstadoNomina] = useState("Todos");
    const [periodoNomina, setPeriodoNomina] = useState("Todos");
    const [usuarioFiltro, setUsuarioFiltro] = useState("Todos");
    const [moduloFiltro, setModuloFiltro] = useState("Todos");
    const [accionFiltro, setAccionFiltro] = useState("Todos");

    useEffect(() => {
        Promise.all([
            getEmpleados(),
            getNominas(),
            getUsuarios(),
            getAuditorias(),
            getNotificaciones(),
            getDepartamentos(),
            getPeriodosNomina(),
            getPuestos(),
            getEmpresas(),
            getConfiguracionSistema(),
        ]).then(([e, n, u, a, not, d, p, pu, emps, config]) => {
            setEmpleados(e);
            setNominas(n);
            setUsuarios(u);
            setAuditorias(a);
            setNotificaciones(not);
            setDepartamentos(d);
            setPeriodos(p);
            setPuestos(pu);
            if (emps.length > 0) {
                setEmpresa(emps[0]);
            }
            setConfigSistema(config);
        }).catch((error) => {
            console.error("Error cargando datos para reportes:", error);
        });
    }, []);

    const empleadosFiltrados = empleados
        .filter((e) =>
            estadoEmpleado === "Todos" ? true : e.estado === estadoEmpleado
        )
        .filter((e) =>
            departamentoEmpleado === "Todos"
                ? true
                : e.departamentoId === departamentoEmpleado
        );

    const nominasFiltradas = nominas
        .filter((n) =>
            estadoNomina === "Todos" ? true : n.estado === estadoNomina
        )
        .filter((n) =>
            periodoNomina === "Todos"
                ? true
                : n.periodoNominaId === periodoNomina
        );

    const auditoriasFiltradas = auditorias
        .filter((a) =>
            usuarioFiltro === "Todos"
                ? true
                : a.usuario === usuarioFiltro
        )
        .filter((a) =>
            moduloFiltro === "Todos"
                ? true
                : a.modulo === moduloFiltro
        )
        .filter((a) =>
            accionFiltro === "Todos"
                ? true
                : a.accion === accionFiltro
        );

    const usuariosAuditoria = [...new Set(auditorias.map((a) => a.usuario))];
    const modulosAuditoria = [...new Set(auditorias.map((a) => a.modulo))];
    const accionesAuditoria = [...new Set(auditorias.map((a) => a.accion))];

    function exportarEmpleados() {
        exportToExcel(
            empleadosFiltrados.map((e) => ({
                Nombre: `${e.nombre} ${e.apellido}`,
                Cedula: e.cedula,
                Correo: e.correo,
                Telefono: e.telefono,
                Salario: e.salarioBase,
                Estado: e.estado,
                TipoContrato: e.tipoContrato,
            })),
            "reporte-empleados",
            "Empleados"
        );
    }

    function exportarEmpleadosPdf() {
        if (!empresa) return;

        exportEmpleadosPdf(
            {
                nombre: empresa.nombre,
                rnc: empresa.rnc,
                direccion: empresa.direccion,
                telefono: empresa.telefono,
            },
            empleadosFiltrados.map((e) => ({
                nombre: `${e.nombre} ${e.apellido}`,
                cedula: e.cedula,
                correo: e.correo,
                departamento:
                    departamentos.find((d) => d.id === e.departamentoId)?.nombre ?? "-",
                puesto:
                    puestos.find((p) => p.id === e.puestoId)?.nombre ?? "-",
                salario: e.salarioBase,
                estado: e.estado,
            }))
        );
    }

    function exportarNominas() {
        exportToExcel(
            nominasFiltradas.map((n) => ({
                Id: n.id,
                Estado: n.estado,
                TotalBruto: n.totalBruto,
                Deducciones: n.totalDeducciones,
                TotalNeto: n.totalNeto,
                FechaGeneracion: new Date(n.fechaGeneracion).toLocaleDateString("es-DO"),
            })),
            "reporte-nominas",
            "Nominas"
        );
    }

    function exportarNominasPdf() {
        if (!empresa) return;

        exportNominasPdf(
            {
                nombre: empresa.nombre,
                rnc: empresa.rnc,
                direccion: empresa.direccion,
                telefono: empresa.telefono,
            },
            nominasFiltradas.map((n) => ({
                periodo:
                    periodos.find((p) => p.id === n.periodoNominaId)?.nombre ?? "-",
                estado: n.estado,
                totalBruto: n.totalBruto,
                totalDeducciones: n.totalDeducciones,
                totalNeto: n.totalNeto,
                fechaGeneracion: n.fechaGeneracion,
            }))
        );
    }

    function exportarUsuarios() {
        exportToExcel(
            usuarios.map((u) => ({
                Nombre: u.nombre,
                Correo: u.email,
                Rol: u.rol,
                Estado: u.activo ? "Activo" : "Inactivo",
            })),
            "reporte-usuarios",
            "Usuarios"
        );
    }

    function exportarUsuariosPdf() {
        if (!empresa) return;

        exportUsuariosPdf(
            {
                nombre: empresa.nombre,
                rnc: empresa.rnc,
                direccion: empresa.direccion,
                telefono: empresa.telefono,
            },
            usuarios.map((u) => ({
                nombre: u.nombre,
                email: u.email,
                rol: u.rol,
                estado: u.activo ? "Activo" : "Inactivo",
            }))
        );
    }

    function exportarAuditorias() {
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

    function exportarAuditoriaPdf() {
        if (!empresa) return;

        exportAuditoriaPdf(
            {
                nombre: empresa.nombre,
                rnc: empresa.rnc,
                direccion: empresa.direccion,
                telefono: empresa.telefono,
            },
            auditoriasFiltradas.map((a) => ({
                fecha: a.fecha,
                usuario: a.usuario,
                modulo: a.modulo,
                accion: a.accion,
                descripcion: a.descripcion,
                ip: a.ip,
            }))
        );
    }

    function exportarNotificaciones() {
        exportToExcel(
            notificaciones.map((n) => ({
                Fecha: new Date(n.fecha).toLocaleString("es-DO"),
                Titulo: n.titulo,
                Mensaje: n.mensaje,
                Tipo: n.tipo,
                Estado: n.leida ? "Leída" : "No leída",
            })),
            "reporte-notificaciones",
            "Notificaciones"
        );
    }

    function exportarNotificacionesPdf() {
        if (!empresa) return;

        exportNotificacionesPdf(
            {
                nombre: empresa.nombre,
                rnc: empresa.rnc,
                direccion: empresa.direccion,
                telefono: empresa.telefono,
            },
            notificaciones.map((n) => ({
                fecha: n.fecha,
                titulo: n.titulo,
                mensaje: n.mensaje,
                tipo: n.tipo,
                estado: n.leida ? "Leída" : "No leída",
            }))
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Reportes
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Exporta información de nóminas, empleados y asistencias.
            </Typography>

            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                {/* Reporte de empleados */}
                <EmpleadosReportCard
                    estado={estadoEmpleado}
                    departamentoId={departamentoEmpleado}
                    departamentos={departamentos}
                    total={empleadosFiltrados.length}
                    onEstadoChange={setEstadoEmpleado}
                    onDepartamentoChange={setDepartamentoEmpleado}
                    onExportExcel={exportarEmpleados}
                    onExportPdf={exportarEmpleadosPdf}
                />

                {/* Reporte de nóminas */}
                <NominasReportCard
                    estado={estadoNomina}
                    periodoId={periodoNomina}
                    periodos={periodos}
                    total={nominasFiltradas.length}
                    onEstadoChange={setEstadoNomina}
                    onPeriodoChange={setPeriodoNomina}
                    onExportExcel={exportarNominas}
                    onExportPdf={exportarNominasPdf}
                />

                {/* Reporte de usuarios */}
                <UsuariosReportCard
                    total={usuarios.length}
                    onExportExcel={exportarUsuarios}
                    onExportPdf={exportarUsuariosPdf}
                />

                {/* Reporte de auditoría */}
                <AuditoriaReportCard
                    usuario={usuarioFiltro}
                    modulo={moduloFiltro}
                    accion={accionFiltro}
                    usuarios={usuariosAuditoria}
                    modulos={modulosAuditoria}
                    acciones={accionesAuditoria}
                    total={auditoriasFiltradas.length}
                    onUsuarioChange={setUsuarioFiltro}
                    onModuloChange={setModuloFiltro}
                    onAccionChange={setAccionFiltro}
                    onExportExcel={exportarAuditorias}
                    onExportPdf={exportarAuditoriaPdf}
                />

                {/* Reporte de notificaciones */}
                <NotificacionesReportCard
                    total={notificaciones.length}
                    onExportExcel={exportarNotificaciones}
                    onExportPdf={exportarNotificacionesPdf}
                />
            </Box>
        </Box>
    );
}