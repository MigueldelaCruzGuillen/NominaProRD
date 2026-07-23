using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using NominaPro.Application.DTOs;

namespace NominaPro.API.Services;

public class PdfService
{
    public byte[] GenerarReciboNomina(NominaDto nomina, NominaDetalleDto detalle)
    {
        var empresaNombre = string.IsNullOrWhiteSpace(nomina.EmpresaNombre)
            ? "NominaPro RD"
            : nomina.EmpresaNombre;

        var empresaRnc = string.IsNullOrWhiteSpace(nomina.EmpresaRnc)
            ? "N/A"
            : nomina.EmpresaRnc;

        var empresaDireccion = string.IsNullOrWhiteSpace(nomina.EmpresaDireccion)
            ? ""
            : nomina.EmpresaDireccion;

        var empresaTelefono = string.IsNullOrWhiteSpace(nomina.EmpresaTelefono)
            ? ""
            : nomina.EmpresaTelefono;

        QuestPDF.Settings.License = LicenseType.Community;

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(40);
                page.Size(PageSizes.A4);

                // ✅ UN SOLO HEADER con toda la información
                page.Header().Column(header =>
                {
                    header.Item().Text(empresaNombre)
                        .FontSize(18)
                        .Bold()
                        .AlignCenter();

                    if (!string.IsNullOrWhiteSpace(empresaDireccion))
                    {
                        header.Item().Text(empresaDireccion)
                            .FontSize(10)
                            .AlignCenter();
                    }

                    if (!string.IsNullOrWhiteSpace(empresaTelefono))
                    {
                        header.Item().Text($"Tel: {empresaTelefono}")
                            .FontSize(10)
                            .AlignCenter();
                    }

                    header.Item().Text($"RNC: {empresaRnc}")
                        .FontSize(10)
                        .AlignCenter();

                    header.Item().PaddingTop(10)
                        .Text("RECIBO DE PAGO")
                        .FontSize(14)
                        .Bold()
                        .AlignCenter();
                });

                // ✅ CONTENIDO PRINCIPAL
                page.Content().Column(col =>
                {
                    col.Spacing(10);

                    col.Item().PaddingTop(10).Text($"Nómina ID: {nomina.Id}");
                    col.Item().Text($"Empleado: {detalle.EmpleadoNombre}");
                    col.Item().Text($"Departamento: {detalle.Departamento}");
                    col.Item().Text($"Puesto: {detalle.Puesto}");
                    col.Item().Text($"Fecha generación: {nomina.FechaGeneracion:dd/MM/yyyy}");

                    col.Item().LineHorizontal(1);

                    col.Item().Text($"Salario base: RD${detalle.SalarioBase:N2}");
                    col.Item().Text($"AFP: RD${detalle.Afp:N2}");
                    col.Item().Text($"SFS: RD${detalle.Sfs:N2}");
                    col.Item().Text($"ISR: RD${detalle.Isr:N2}");

                    col.Item().LineHorizontal(1);

                    col.Item().Text($"Total ingresos: RD${detalle.TotalIngresos:N2}");
                    col.Item().Text($"Total deducciones: RD${detalle.TotalDeducciones:N2}");
                    col.Item().Text($"Neto a pagar: RD${detalle.NetoPagar:N2}")
                        .FontSize(16)
                        .Bold();
                });

                // ✅ OPCIONAL: FOOTER CON NÚMERO DE PÁGINA
                page.Footer().Text(text =>
                {
                    text.Span("Página ");
                    text.CurrentPageNumber();
                    text.Span(" de ");
                    text.TotalPages();
                });
            });
        }).GeneratePdf();
    }
}