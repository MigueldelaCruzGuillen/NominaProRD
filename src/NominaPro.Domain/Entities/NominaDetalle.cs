
using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class NominaDetalle : BaseEntity
{
    public Guid NominaId { get; set; }
    public Nomina Nomina { get; set; } = null!;

    public Guid EmpleadoId { get; set; }
    public Empleado Empleado { get; set; } = null!;

    public decimal SalarioBase { get; set; }

    public decimal HorasExtras { get; set; }
    public decimal Bonificaciones { get; set; }
    public decimal OtrosIngresos { get; set; }

    public decimal Afp { get; set; }
    public decimal Sfs { get; set; }
    public decimal Isr { get; set; }
    public decimal OtrosDescuentos { get; set; }

    public decimal TotalIngresos { get; set; }
    public decimal TotalDeducciones { get; set; }
    public decimal NetoPagar { get; set; }

    public decimal PorcentajeAfpAplicado { get; set; }
    public decimal PorcentajeSfsAplicado { get; set; }
    public bool IsrAplicado { get; set; }
    public int DecimalesAplicados { get; set; }
}