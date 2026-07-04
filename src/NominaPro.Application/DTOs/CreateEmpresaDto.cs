namespace NominaPro.Application.DTOs;

public class CreateEmpresaDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Rnc { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
}