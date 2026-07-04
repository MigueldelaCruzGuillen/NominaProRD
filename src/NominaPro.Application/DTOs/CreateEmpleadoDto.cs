namespace NominaPro.Application.DTOs;

public class CreateEmpleadoDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Cedula { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }

    public string Telefono { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;

    public DateTime FechaIngreso { get; set; }
    public decimal SalarioBase { get; set; }

    public string TipoContrato { get; set; } = "Indefinido";

    public Guid EmpresaId { get; set; }
    public Guid DepartamentoId { get; set; }
    public Guid PuestoId { get; set; }
}