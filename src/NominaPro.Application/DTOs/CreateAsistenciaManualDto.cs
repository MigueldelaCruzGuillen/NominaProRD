namespace NominaPro.Application.DTOs;

public class CreateAsistenciaManualDto
{
    public Guid EmpleadoId { get; set; }
    public DateTime HoraEntrada { get; set; }
    public DateTime HoraSalida { get; set; }
}