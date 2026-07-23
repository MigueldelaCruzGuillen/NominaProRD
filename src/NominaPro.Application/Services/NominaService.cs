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
    private readonly IAuditoriaService _auditoriaService;

    public NominaService(
        IRepository<Empleado> empleadoRepository,
        INominaRepository nominaRepository,
        INominaCalculatorService calculator,
        ICurrentUserService currentUser,
        IRepository<PeriodoNomina> periodoRepository,
        IAsistenciaRepository asistenciaRepository,
        IAuditoriaService auditoriaService)
    {
        _empleadoRepository = empleadoRepository;
        _nominaRepository = nominaRepository;
        _calculator = calculator;
        _currentUser = currentUser;
        _periodoRepository = periodoRepository;
        _asistenciaRepository = asistenciaRepository;
        _auditoriaService = auditoriaService;
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

        // Validar que el período no esté cerrado
        if (periodo.Estado == "Cerrado")
        {
            throw new InvalidOperationException(
                "No se puede generar una nómina para un período cerrado."
            );
        }

        // Validar que el período pertenezca a la empresa actual
        if (periodo.EmpresaId != _currentUser.EmpresaId)
        {
            throw new UnauthorizedAccessException(
                "El período no pertenece a la empresa actual."
            );
        }

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

            var detalle = await _calculator.CalcularDetalleAsync(empleado, horasExtras);
            nomina.Detalles.Add(detalle);
        }

        nomina.TotalBruto = nomina.Detalles.Sum(d => d.TotalIngresos);
        nomina.TotalDeducciones = nomina.Detalles.Sum(d => d.TotalDeducciones);
        nomina.TotalNeto = nomina.Detalles.Sum(d => d.NetoPagar);

        await _nominaRepository.CreateAsync(nomina);

        //  Auditoría inmediatamente después de guardar la nómina
        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Nóminas",
            "Generar",
            $"Generó la nómina {nomina.Id} para el período {periodo.Nombre}"
        );

        periodo.Estado = "Cerrado";
        await _periodoRepository.UpdateAsync(periodo);

        return nomina;
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
            PeriodoNombre = nomina.PeriodoNomina.Nombre,
            PeriodoNominaId = nomina.PeriodoNominaId,
            TotalBruto = nomina.TotalBruto,
            TotalDeducciones = nomina.TotalDeducciones,
            TotalNeto = nomina.TotalNeto,
            Estado = nomina.Estado,
            FechaGeneracion = nomina.FechaGeneracion,
            PagadaPorUsuarioId = nomina.PagadaPorUsuarioId,
            FechaPago = nomina.FechaPago,
            PagadaPorUsuario = nomina.PagadaPorUsuario?.Email,  // ✅ Agregado
            EmpresaNombre = nomina.Empresa.Nombre,
            EmpresaRnc = nomina.Empresa.Rnc,
            EmpresaDireccion = nomina.Empresa.Direccion,
            EmpresaTelefono = nomina.Empresa.Telefono,
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
    public async Task<List<NominaResumenDto>> GetAllAsync()
    {
        var nominas = await _nominaRepository.GetAllAsync(_currentUser.EmpresaId);

        return nominas.Select(n => new NominaResumenDto
        {
            Id = n.Id,
            PeriodoNominaId = n.PeriodoNominaId,
            TotalBruto = n.TotalBruto,
            TotalDeducciones = n.TotalDeducciones,
            TotalNeto = n.TotalNeto,
            Estado = n.Estado,
            FechaGeneracion = n.FechaGeneracion
        }).ToList();
    }

    public async Task<Nomina?> GetEntityByIdForUpdateAsync(Guid id)
    {
        var empresaId = _currentUser.EmpresaId;

        return await _nominaRepository.GetByIdWithDetallesAsync(id, empresaId);
    }

    public async Task UpdateAsync(Nomina nomina)
    {
        await _nominaRepository.UpdateAsync(nomina);

        if (nomina.Estado == "Pagada")
        {
            await _auditoriaService.RegistrarAsync(
                _currentUser.UsuarioId,
                _currentUser.Email,
                "Nóminas",
                "Pagar",
                $"Marcó como pagada la nómina {nomina.Id}"
            );
        }
    }
}