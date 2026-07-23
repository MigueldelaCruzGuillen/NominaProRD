import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ============================================
// 1. EXPORTAR NÓMINAS PDF
// ============================================
type NominaPdfRow = {
  periodo: string;
  estado: string;
  totalBruto: number;
  totalDeducciones: number;
  totalNeto: number;
  fechaGeneracion: string;
};

export function exportNominasPdf(
  empresa: {
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  },
  nominas: NominaPdfRow[]
) {
  const doc = new jsPDF("landscape");

  doc.setFontSize(18);
  doc.text(empresa.nombre || "NominaPro RD", 14, 18);

  doc.setFontSize(10);
  doc.text(`RNC: ${empresa.rnc || "-"}`, 14, 25);
  doc.text(empresa.direccion || "-", 14, 31);
  doc.text(`Tel.: ${empresa.telefono || "-"}`, 14, 37);

  doc.setFontSize(14);
  doc.text("Reporte de nóminas", 14, 48);

  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleString("es-DO")}`, 14, 54);

  autoTable(doc, {
    startY: 60,
    head: [["Período", "Estado", "Total bruto", "Deducciones", "Total neto", "Fecha generación"]],
    body: nominas.map((n) => [
      n.periodo,
      n.estado,
      `RD$${n.totalBruto.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`,
      `RD$${n.totalDeducciones.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`,
      `RD$${n.totalNeto.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`,
      new Date(n.fechaGeneracion).toLocaleString("es-DO"),
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
    didDrawPage: () => {
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.text(
        `Página ${pageNumber}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });

  doc.save("reporte-nominas.pdf");
}

// ============================================
// 2. EXPORTAR EMPLEADOS PDF
// ============================================
type EmpleadoPdfRow = {
  nombre: string;
  cedula: string;
  correo: string;
  departamento: string;
  puesto: string;
  salario: number;
  estado: string;
};

export function exportEmpleadosPdf(
  empresa: {
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  },
  empleados: EmpleadoPdfRow[]
) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(empresa.nombre || "NominaPro RD", 14, 18);

  doc.setFontSize(10);
  doc.text(`RNC: ${empresa.rnc || "-"}`, 14, 25);
  doc.text(empresa.direccion || "-", 14, 31);
  doc.text(`Tel.: ${empresa.telefono || "-"}`, 14, 37);

  doc.setFontSize(14);
  doc.text("Reporte de empleados", 14, 48);

  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleString("es-DO")}`, 14, 54);

  autoTable(doc, {
    startY: 60,
    head: [["Nombre", "Cédula", "Correo", "Departamento", "Puesto", "Salario", "Estado"]],
    body: empleados.map((e) => [
      e.nombre,
      e.cedula,
      e.correo,
      e.departamento,
      e.puesto,
      `RD$${e.salario.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`,
      e.estado,
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [37, 99, 235] },
    didDrawPage: () => {
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.text(
        `Página ${pageNumber}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });

  doc.save("reporte-empleados.pdf");
}

// ============================================
// 3. EXPORTAR AUDITORÍA PDF
// ============================================
type AuditoriaPdfRow = {
  fecha: string;
  usuario: string;
  modulo: string;
  accion: string;
  descripcion: string;
  ip?: string | null;
};

export function exportAuditoriaPdf(
  empresa: {
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  },
  auditorias: AuditoriaPdfRow[]
) {
  const doc = new jsPDF("landscape");

  doc.setFontSize(18);
  doc.text(empresa.nombre || "NominaPro RD", 14, 18);

  doc.setFontSize(10);
  doc.text(`RNC: ${empresa.rnc || "-"}`, 14, 25);
  doc.text(empresa.direccion || "-", 14, 31);
  doc.text(`Tel.: ${empresa.telefono || "-"}`, 14, 37);

  doc.setFontSize(14);
  doc.text("Reporte de auditoría", 14, 48);

  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleString("es-DO")}`, 14, 54);

  autoTable(doc, {
    startY: 60,
    head: [["Fecha", "Usuario", "Módulo", "Acción", "Descripción", "IP"]],
    body: auditorias.map((a) => [
      new Date(a.fecha).toLocaleString("es-DO"),
      a.usuario,
      a.modulo,
      a.accion,
      a.descripcion,
      a.ip ?? "-",
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 34 },
      1: { cellWidth: 45 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 110 },
      5: { cellWidth: 28 },
    },
    headStyles: { fillColor: [37, 99, 235] },
    didDrawPage: () => {
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.text(
        `Página ${pageNumber}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });

  doc.save("reporte-auditoria.pdf");
}

// ============================================
// 4. EXPORTAR USUARIOS PDF
// ============================================
type UsuarioPdfRow = {
  nombre: string;
  email: string;
  rol: string;
  estado: string;
};

export function exportUsuariosPdf(
  empresa: {
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  },
  usuarios: UsuarioPdfRow[]
) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(empresa.nombre || "NominaPro RD", 14, 18);

  doc.setFontSize(10);
  doc.text(`RNC: ${empresa.rnc || "-"}`, 14, 25);
  doc.text(empresa.direccion || "-", 14, 31);
  doc.text(`Tel.: ${empresa.telefono || "-"}`, 14, 37);

  doc.setFontSize(14);
  doc.text("Reporte de usuarios", 14, 48);

  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleString("es-DO")}`, 14, 54);

  autoTable(doc, {
    startY: 60,
    head: [["Nombre", "Correo", "Rol", "Estado"]],
    body: usuarios.map((u) => [
      u.nombre,
      u.email,
      u.rol,
      u.estado,
    ]),
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [37, 99, 235] },
    didDrawPage: () => {
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.text(
        `Página ${pageNumber}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });

  doc.save("reporte-usuarios.pdf");
}

// ============================================
// 5. EXPORTAR NOTIFICACIONES PDF
// ============================================
type NotificacionPdfRow = {
  fecha: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  estado: string;
};

export function exportNotificacionesPdf(
  empresa: {
    nombre: string;
    rnc: string;
    direccion: string;
    telefono: string;
  },
  notificaciones: NotificacionPdfRow[]
) {
  const doc = new jsPDF("landscape");

  doc.setFontSize(18);
  doc.text(empresa.nombre || "NominaPro RD", 14, 18);

  doc.setFontSize(10);
  doc.text(`RNC: ${empresa.rnc || "-"}`, 14, 25);
  doc.text(empresa.direccion || "-", 14, 31);
  doc.text(`Tel.: ${empresa.telefono || "-"}`, 14, 37);

  doc.setFontSize(14);
  doc.text("Reporte de notificaciones", 14, 48);

  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleString("es-DO")}`, 14, 54);

  autoTable(doc, {
    startY: 60,
    head: [["Fecha", "Título", "Mensaje", "Tipo", "Estado"]],
    body: notificaciones.map((n) => [
      new Date(n.fecha).toLocaleString("es-DO"),
      n.titulo,
      n.mensaje,
      n.tipo,
      n.estado,
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 55 },
      2: { cellWidth: 120 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
    },
    headStyles: { fillColor: [37, 99, 235] },
    didDrawPage: () => {
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.text(
        `Página ${pageNumber}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });

  doc.save("reporte-notificaciones.pdf");
}