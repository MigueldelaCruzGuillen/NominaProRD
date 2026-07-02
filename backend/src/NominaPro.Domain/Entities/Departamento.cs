using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class Departamento : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public Guid EmpresaId { get; set; }

    public Empresa Empresa { get; set; } = null!;
    public ICollection<Empleado> Empleados { get; set; } = new List<Empleado>();
}