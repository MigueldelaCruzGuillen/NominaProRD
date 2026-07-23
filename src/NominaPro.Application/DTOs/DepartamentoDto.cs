namespace NominaPro.Application.DTOs;

public class DepartamentoDto
{
    public Guid Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public Guid EmpresaId { get; set; }
    public bool Activo { get; set; }
    public int TotalEmpleados { get; set; }
}

