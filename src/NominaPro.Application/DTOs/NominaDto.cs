namespace NominaPro.Application.DTOs;

public class NominaDto
{
    public Guid Id { get; set; }
    public Guid PeriodoNominaId { get; set; }
    public decimal TotalBruto { get; set; }
    public decimal TotalDeducciones { get; set; }
    public decimal TotalNeto { get; set; }
    public string Estado { get; set; } = string.Empty;
    public DateTime FechaGeneracion { get; set; }
    public Guid? PagadaPorUsuarioId { get; set; }
    public DateTime? FechaPago { get; set; }

    public List<NominaDetalleDto> Detalles { get; set; } = new();
    public string EmpresaNombre { get; set; } = string.Empty;
    public string EmpresaRnc { get; set; } = string.Empty;
    public string EmpresaDireccion { get; set; } = string.Empty;
    public string EmpresaTelefono { get; set; } = string.Empty;
    public string PeriodoNombre { get; set; } = string.Empty;
    public string? PagadaPorUsuario { get; set; }
}