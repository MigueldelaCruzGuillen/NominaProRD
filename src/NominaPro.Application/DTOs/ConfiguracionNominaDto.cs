namespace NominaPro.Application.DTOs;

public class ConfiguracionNominaDto
{
    public decimal PorcentajeAfp { get; set; } = 2.87m;
    public decimal PorcentajeSfs { get; set; } = 3.04m;
    public bool AplicarIsr { get; set; } = true;
    public int DiaPago { get; set; } = 30;
    public int Decimales { get; set; } = 2;
}