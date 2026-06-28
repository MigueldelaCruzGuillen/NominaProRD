using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class Puesto : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public Guid EmpresaId { get; set; }

    public Empresa Empresa { get; set; } = null!;
}