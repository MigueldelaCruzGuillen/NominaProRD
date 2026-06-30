using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using NominaPro.Application.DTOs;

namespace NominaPro.API.Services;

public class PdfService
{
    public byte[] GenerarReciboNomina(NominaDto nomina, NominaDetalleDto detalle)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(40);
                page.Size(PageSizes.A4);

                page.Header().Text("NOMINAPRO RD - RECIBO DE PAGO")
                    .FontSize(18)
                    .Bold()
                    .AlignCenter();

                page.Content().Column(col =>
                {
                    col.Spacing(10);

                    col.Item().Text($"Nómina ID: {nomina.Id}");
                    col.Item().Text($"Empleado ID: {detalle.EmpleadoId}");
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

                page.Footer().AlignCenter().Text("Documento generado por NominaPro RD");
            });
        }).GeneratePdf();
    }
}