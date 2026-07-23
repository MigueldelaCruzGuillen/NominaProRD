using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class Auditoria : BaseEntity
{
    public Guid UsuarioId { get; set; }

    public string Usuario { get; set; } = string.Empty;

    public string Modulo { get; set; } = string.Empty;

    public string Accion { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    public string? Ip { get; set; }
}