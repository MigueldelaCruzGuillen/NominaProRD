namespace NominaPro.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id { get; set; }

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public bool Activo { get; set; } = true;
}