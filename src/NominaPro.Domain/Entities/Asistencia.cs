using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class Asistencia : BaseEntity
{
    public Guid EmpleadoId { get; set; }
    public Empleado Empleado { get; set; } = null!;

    public DateTime Fecha { get; set; }
    public DateTime HoraEntrada { get; set; }
    public DateTime? HoraSalida { get; set; }

    public decimal HorasTrabajadas { get; set; }
    public decimal HorasExtras { get; set; }

    public string Estado { get; set; } = "EntradaRegistrada";
}