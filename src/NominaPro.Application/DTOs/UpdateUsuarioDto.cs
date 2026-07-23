namespace NominaPro.Application.DTOs;

public class UpdateUsuarioDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = "Consulta";
    public bool Activo { get; set; }
}