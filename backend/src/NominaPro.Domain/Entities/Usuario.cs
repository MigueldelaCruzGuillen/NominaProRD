using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class Usuario : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Rol { get; set; } = "Empleado";

    public Guid EmpresaId { get; set; }

    public Empresa Empresa { get; set; } = null!;
}