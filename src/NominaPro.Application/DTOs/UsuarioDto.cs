namespace NominaPro.Application.DTOs;

public class UsuarioDto
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public Guid EmpresaId { get; set; }
    public bool Activo { get; set; }
}