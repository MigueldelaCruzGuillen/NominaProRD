namespace NominaPro.Application.DTOs;

public class PuestoDto
{
    public Guid Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public Guid EmpresaId { get; set; }

    public Guid DepartamentoId { get; set; }

    public string DepartamentoNombre { get; set; } = string.Empty;

    public bool Activo { get; set; }

    public int TotalEmpleados { get; set; }
}