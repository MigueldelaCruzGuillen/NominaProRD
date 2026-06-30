using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class NominaService : INominaService
{
    private readonly IRepository<Empleado> _empleadoRepository;
    private readonly INominaRepository _nominaRepository;
    private readonly INominaCalculatorService _calculator;
    private readonly ICurrentUserService _currentUser;
    private readonly IRepository<PeriodoNomina> _periodoRepository;
    private readonly IAsistenciaRepository _asistenciaRepository;

    public NominaService(
        IRepository<Empleado> empleadoRepository,
        INominaRepository nominaRepository,
        INominaCalculatorService calculator,
        ICurrentUserService currentUser,
        IRepository<PeriodoNomina> periodoRepository,
        IAsistenciaRepository asistenciaRepository)
    {
        _empleadoRepository = empleadoRepository;
        _nominaRepository = nominaRepository;
        _calculator = calculator;
        _currentUser = currentUser;
        _periodoRepository = periodoRepository;
        _asistenciaRepository = asistenciaRepository;
    }

    public async Task<Nomina> GenerarNominaAsync(GenerarNominaDto dto)
    {
        var empresaId = _currentUser.EmpresaId;

        var yaExiste = await _nominaRepository.ExisteNominaPorPeriodoAsync(
            empresaId,
            dto.PeriodoNominaId);

        if (yaExiste)
            throw new InvalidOperationException("Ya existe una nómina generada para este período.");

        var periodo = await _periodoRepository.GetByIdAsync(dto.PeriodoNominaId);

        if (periodo is null || periodo.EmpresaId != empresaId)
            throw new InvalidOperationException("El período de nómina no existe.");

        if (periodo.Estado == "Cerrado")
            throw new InvalidOperationException("Este período ya está cerrado.");

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
            var horasExtras = await _asistenciaRepository.GetHorasExtrasPeriodoAsync(
                empleado.Id,
                periodo.FechaInicio,
                periodo.FechaFin);

            var detalle = _calculator.CalcularDetalle(empleado, horasExtras);
            nomina.Detalles.Add(detalle);
        }

        nomina.TotalBruto = nomina.Detalles.Sum(d => d.TotalIngresos);
        nomina.TotalDeducciones = nomina.Detalles.Sum(d => d.TotalDeducciones);
        nomina.TotalNeto = nomina.Detalles.Sum(d => d.NetoPagar);

        await _nominaRepository.CreateAsync(nomina);

        periodo.Estado = "Cerrado";
        await _periodoRepository.UpdateAsync(periodo);

        return nomina;
    }

    public async Task<List<NominaResumenDto>> GetAllAsync()
    {
        var empresaId = _currentUser.EmpresaId;

        var nominas = await _nominaRepository.GetAllByEmpresaAsync(empresaId);

        return nominas
            .OrderByDescending(n => n.FechaGeneracion)
            .Select(n => new NominaResumenDto
            {
                Id = n.Id,
                PeriodoNominaId = n.PeriodoNominaId,
                TotalBruto = n.TotalBruto,
                TotalDeducciones = n.TotalDeducciones,
                TotalNeto = n.TotalNeto,
                Estado = n.Estado,
                FechaGeneracion = n.FechaGeneracion
            })
            .ToList();
    }

    public async Task<NominaDto?> GetByIdAsync(Guid id)
    {
        var empresaId = _currentUser.EmpresaId;

        var nomina = await _nominaRepository.GetByIdWithDetallesAsync(id, empresaId);

        if (nomina is null)
            return null;

        return new NominaDto
        {
            Id = nomina.Id,
            PeriodoNominaId = nomina.PeriodoNominaId,
            TotalBruto = nomina.TotalBruto,
            TotalDeducciones = nomina.TotalDeducciones,
            TotalNeto = nomina.TotalNeto,
            Estado = nomina.Estado,
            FechaGeneracion = nomina.FechaGeneracion,
            Detalles = nomina.Detalles.Select(d => new NominaDetalleDto
            {
                EmpleadoId = d.EmpleadoId,
                EmpleadoNombre = $"{d.Empleado.Nombre} {d.Empleado.Apellido}",
                Departamento = d.Empleado.Departamento.Nombre,
                Puesto = d.Empleado.Puesto.Nombre,
                SalarioBase = d.SalarioBase,
                Afp = d.Afp,
                Sfs = d.Sfs,
                Isr = d.Isr,
                TotalIngresos = d.TotalIngresos,
                TotalDeducciones = d.TotalDeducciones,
                NetoPagar = d.NetoPagar
            }).ToList()
        };
    }
}