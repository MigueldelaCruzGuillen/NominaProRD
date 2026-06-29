namespace NominaPro.Application.DTOs;

public class NominaDetalleDto
{
    public Guid EmpleadoId { get; set; }
    public decimal SalarioBase { get; set; }
    public decimal Afp { get; set; }
    public decimal Sfs { get; set; }
    public decimal Isr { get; set; }
    public decimal TotalIngresos { get; set; }
    public decimal TotalDeducciones { get; set; }
    public decimal NetoPagar { get; set; }
}