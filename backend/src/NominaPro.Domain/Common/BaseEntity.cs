namespace NominaPro.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id { get; set; }

    public DateTime FechaCreacion { get; set; }

    public DateTime? FechaActualizacion { get; set; }

    public bool Activo { get; set; } = true;
}