namespace NominaPro.Domain.Entities;

public class Empresa
{
    public Guid Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Rnc { get; set; } = string.Empty;

    public string Direccion { get; set; } = string.Empty;

    public string Telefono { get; set; } = string.Empty;

    public string Correo { get; set; } = string.Empty;

    public bool Activa { get; set; } = true;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}