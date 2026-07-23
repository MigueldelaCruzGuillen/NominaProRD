namespace NominaPro.Application.DTOs;

public class UpdatePuestoDto
{
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public Guid DepartamentoId { get; set; }
}