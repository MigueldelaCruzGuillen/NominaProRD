using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class Nomina : BaseEntity
{
    public Guid EmpresaId { get; set; }
    public Empresa Empresa { get; set; } = null!;

    public Guid PeriodoNominaId { get; set; }
    public PeriodoNomina PeriodoNomina { get; set; } = null!;

    public DateTime FechaGeneracion { get; set; } = DateTime.UtcNow;

    public decimal TotalBruto { get; set; }
    public decimal TotalDeducciones { get; set; }
    public decimal TotalNeto { get; set; }

    public string Estado { get; set; } = "Generada";

    public ICollection<NominaDetalle> Detalles { get; set; } = new List<NominaDetalle>();
}