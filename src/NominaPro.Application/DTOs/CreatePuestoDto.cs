namespace NominaPro.Application.DTOs;

public class CreatePuestoDto
{
    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public Guid EmpresaId { get; set; }

    public Guid DepartamentoId { get; set; }
}