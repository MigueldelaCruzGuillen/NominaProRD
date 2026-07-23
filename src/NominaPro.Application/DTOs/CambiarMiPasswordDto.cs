namespace NominaPro.Application.DTOs;

public class CambiarMiPasswordDto
{
    public string PasswordActual { get; set; } = string.Empty;
    public string NuevaPassword { get; set; } = string.Empty;
}