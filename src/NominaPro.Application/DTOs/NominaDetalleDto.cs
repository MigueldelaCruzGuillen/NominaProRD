namespace NominaPro.Application.DTOs;

public class NominaDetalleDto
{
    public Guid EmpleadoId { get; set; }
    public string EmpleadoNombre { get; set; } = string.Empty;
    public string Departamento { get; set; } = string.Empty;
    public string Puesto { get; set; } = string.Empty;

    public decimal SalarioBase { get; set; }
    public decimal Afp { get; set; }
    public decimal Sfs { get; set; }
    public decimal Isr { get; set; }
    public decimal TotalIngresos { get; set; }
    public decimal TotalDeducciones { get; set; }
    public decimal NetoPagar { get; set; }
}