using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class ConfiguracionSistema : BaseEntity
{
    public Guid EmpresaId { get; set; }
    public Empresa Empresa { get; set; } = null!;

    public string Idioma { get; set; } = "es-DO";
    public string ZonaHoraria { get; set; } = "America/Santo_Domingo";
    public string FormatoFecha { get; set; } = "dd/MM/yyyy";
    public string Moneda { get; set; } = "DOP";
}