namespace NominaPro.Application.DTOs;

public class AsistenciaDto
{
    public Guid Id { get; set; }

    public Guid EmpleadoId { get; set; }
    public string EmpleadoNombre { get; set; } = string.Empty;

    public Guid? DepartamentoId { get; set; }
    public string DepartamentoNombre { get; set; } = string.Empty;

    public Guid? PuestoId { get; set; }
    public string PuestoNombre { get; set; } = string.Empty;

    public DateTime Fecha { get; set; }
    public DateTime HoraEntrada { get; set; }
    public DateTime? HoraSalida { get; set; }

    public decimal HorasTrabajadas { get; set; }
    public decimal HorasExtras { get; set; }

    public string Estado { get; set; } = string.Empty;
}