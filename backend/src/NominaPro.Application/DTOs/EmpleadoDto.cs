namespace NominaPro.Application.DTOs;

public class EmpleadoDto
{
    public Guid Id { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Cedula { get; set; } = string.Empty;

    public string Telefono { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;

    public DateTime FechaIngreso { get; set; }
    public decimal SalarioBase { get; set; }

    public string Estado { get; set; } = string.Empty;
    public string TipoContrato { get; set; } = string.Empty;

    public Guid EmpresaId { get; set; }
    public Guid DepartamentoId { get; set; }
    public Guid PuestoId { get; set; }
}