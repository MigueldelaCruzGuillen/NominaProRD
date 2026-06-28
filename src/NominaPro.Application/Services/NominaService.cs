using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class NominaService : INominaService
{
    private readonly IRepository<Empleado> _empleadoRepository;
    private readonly IRepository<Nomina> _nominaRepository;
    private readonly INominaCalculatorService _calculator;

    public NominaService(
        IRepository<Empleado> empleadoRepository,
        IRepository<Nomina> nominaRepository,
        INominaCalculatorService calculator)
    {
        _empleadoRepository = empleadoRepository;
        _nominaRepository = nominaRepository;
        _calculator = calculator;
    }

    public async Task<Nomina> GenerarNominaAsync(GenerarNominaDto dto)
    {
        var empleados = await _empleadoRepository.GetAllAsync();

        var empleadosEmpresa = empleados
            .Where(e => e.EmpresaId == dto.EmpresaId && e.Estado == "Activo")
            .ToList();

        var nomina = new Nomina
        {
            EmpresaId = dto.EmpresaId,
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