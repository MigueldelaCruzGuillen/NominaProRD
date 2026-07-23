namespace NominaPro.Application.DTOs;

public class ConfiguracionSistemaDto
{
    public string Idioma { get; set; } = "es-DO";
    public string ZonaHoraria { get; set; } = "America/Santo_Domingo";
    public string FormatoFecha { get; set; } = "dd/MM/yyyy";
    public string Moneda { get; set; } = "DOP";
}