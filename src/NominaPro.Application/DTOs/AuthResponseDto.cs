namespace NominaPro.Application.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public Guid EmpresaId { get; set; }
}