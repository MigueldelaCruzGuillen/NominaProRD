using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class NominaService : INominaService
{
    private readonly IRepository<Empleado> _empleadoRepository;
    private readonly IRepository<Nomina> _nominaRepository;
    private readonly INominaCalculatorService _calculator;
    private readonly ICurrentUserService _currentUser;

  public NominaService(
    IRepository<Empleado> empleadoRepository,
    IRepository<Nomina> nominaRepository,
    INominaCalculatorService calculator,
    ICurrentUserService currentUser)
{
    _empleadoRepository = empleadoRepository;
    _nominaRepository = nominaRepository;
    _calculator = calculator;
    _currentUser = currentUser;
}

    public async Task<Nomina> GenerarNominaAsync(GenerarNominaDto dto)
{
    var empresaId = _currentUser.EmpresaId;

    var empleados = await _empleadoRepository.GetAllAsync();

    var empleadosEmpresa = empleados
        .Where(e => e.EmpresaId == empresaId && e.Estado == "Activo")
        .ToList();

    var nomina = new Nomina
    {
        EmpresaId = empresaId,
        PeriodoNominaId = dto.PeriodoNominaId,
        Estado = "Generada"
    };

    foreach (var empleado in empleadosEmpresa)
    {
        var detalle = _calculator.CalcularDetalle(empleado);
        nomina.Detalles.Add(detalle);
    }

    nomina.TotalBruto = nomina.Detalles.Sum(d => d.TotalIngresos);
    nomina.TotalDeducciones = nomina.Detalles.Sum(d => d.TotalDeducciones);
    nomina.TotalNeto = nomina.Detalles.Sum(d => d.NetoPagar);

    await _nominaRepository.CreateAsync(nomina);

    return nomina;
}

     
    }
