namespace NominaPro.Application.DTOs;

public class NominaDto
{
    public Guid Id { get; set; }
    public Guid PeriodoNominaId { get; set; }
    public decimal TotalBruto { get; set; }
    public decimal TotalDeducciones { get; set; }
    public decimal TotalNeto { get; set; }
    public string Estado { get; set; } = string.Empty;
    public DateTime FechaGeneracion { get; set; }

    public List<NominaDetalleDto> Detalles { get; set; } = new();
}