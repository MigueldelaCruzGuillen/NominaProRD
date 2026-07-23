using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class Puesto : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public bool Activo { get; set; } = true;

    public Guid EmpresaId { get; set; }

    public Empresa Empresa { get; set; } = null!;

    public Guid DepartamentoId { get; set; }

    public Departamento Departamento { get; set; } = null!;

    public ICollection<Empleado> Empleados { get; set; } = new List<Empleado>();
}