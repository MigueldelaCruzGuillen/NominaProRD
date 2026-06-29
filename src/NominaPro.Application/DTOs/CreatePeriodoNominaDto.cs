namespace NominaPro.Application.DTOs;

public class CreatePeriodoNominaDto
{
    public string Nombre { get; set; } = string.Empty;
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public string Tipo { get; set; } = "Mensual";
}