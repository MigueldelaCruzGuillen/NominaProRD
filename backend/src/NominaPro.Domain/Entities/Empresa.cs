using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class Empresa : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;

    public string Rnc { get; set; } = string.Empty;

    public string Direccion { get; set; } = string.Empty;

    public string Telefono { get; set; } = string.Empty;

    public string Correo { get; set; } = string.Empty;

    public bool Activa { get; set; } = true;

    public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    public ICollection<Departamento> Departamentos { get; set; } = new List<Departamento>();
    public ICollection<Puesto> Puestos { get; set; } = new List<Puesto>();
    public ICollection<Empleado> Empleados { get; set; } = new List<Empleado>();
    public ICollection<PeriodoNomina> PeriodosNomina { get; set; } = new List<PeriodoNomina>();
    public ICollection<Nomina> Nominas { get; set; } = new List<Nomina>();
    
}