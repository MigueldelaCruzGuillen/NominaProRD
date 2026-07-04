namespace NominaPro.Application.DTOs;

public class PuestoDto
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public Guid EmpresaId { get; set; }
}