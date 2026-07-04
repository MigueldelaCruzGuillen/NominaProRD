namespace NominaPro.Application.DTOs;

public class RegisterDto
{
    public string EmpresaNombre { get; set; } = string.Empty;
    public string Rnc { get; set; } = string.Empty;
    public string NombreUsuario { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}