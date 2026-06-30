using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class Empleado : BaseEntity
{
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Cedula { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }

    public string Telefono { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;

    public DateTime FechaIngreso { get; set; }
    public decimal SalarioBase { get; set; }

    public string Estado { get; set; } = "Activo";
    public string TipoContrato { get; set; } = "Indefinido";

    public Guid EmpresaId { get; set; }
    public Empresa Empresa { get; set; } = null!;

    public Guid DepartamentoId { get; set; }
    public Departamento Departamento { get; set; } = null!;

    public Guid PuestoId { get; set; }
    public Puesto Puesto { get; set; } = null!;
    public ICollection<NominaDetalle> NominaDetalles { get; set; } = new List<NominaDetalle>();
    public ICollection<Asistencia> Asistencias { get; set; } = new List<Asistencia>();
}