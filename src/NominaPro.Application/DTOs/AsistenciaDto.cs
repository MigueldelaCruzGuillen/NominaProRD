namespace NominaPro.Application.DTOs;

public class AsistenciaDto
{
    public Guid Id { get; set; }
    public Guid EmpleadoId { get; set; }
    public DateTime Fecha { get; set; }
    public DateTime HoraEntrada { get; set; }
    public DateTime? HoraSalida { get; set; }
    public decimal HorasTrabajadas { get; set; }
    public decimal HorasExtras { get; set; }
    public string Estado { get; set; } = string.Empty;
}