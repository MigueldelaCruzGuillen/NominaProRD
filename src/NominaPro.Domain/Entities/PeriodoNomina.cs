using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class PeriodoNomina : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public string Tipo { get; set; } = "Mensual";
    public string Estado { get; set; } = "Abierto";

    public Guid EmpresaId { get; set; }
    public Empresa Empresa { get; set; } = null!;
}