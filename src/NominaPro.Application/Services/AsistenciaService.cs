using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class AsistenciaService : IAsistenciaService
{
    private const decimal HorasJornadaRegular = 8m;

    private readonly IAsistenciaRepository _repository;
    private readonly IEmpleadoRepository _empleadoRepository;

    public AsistenciaService(
        IAsistenciaRepository repository,
        IEmpleadoRepository empleadoRepository)
    {
        _repository = repository;
        _empleadoRepository = empleadoRepository;
    }

    public async Task<List<AsistenciaDto>> GetAllAsync()
    {
        var asistencias = await _repository.GetAllAsync();

        return asistencias
            .Select(MapToDto)
            .ToList();
    }

    public async Task<List<AsistenciaDto>> GetByEmpleadoAsync(
        Guid empleadoId)
    {
        var empleado = await _empleadoRepository.GetByIdAsync(
            empleadoId);

        if (empleado is null)
            throw new KeyNotFoundException(
                "El empleado no existe.");

        var asistencias =
            await _repository.GetByEmpleadoAsync(empleadoId);

        return asistencias
            .Select(MapToDto)
            .ToList();
    }

    public async Task<AsistenciaDto> CheckInAsync(CheckInDto dto)
    {
        var empleado = await _empleadoRepository.GetByIdAsync(
            dto.EmpleadoId);

        if (empleado is null)
            throw new KeyNotFoundException(
                "El empleado no existe.");

        if (empleado.Estado != "Activo")
            throw new InvalidOperationException(
                "No se puede registrar asistencia para un empleado inactivo.");

        var asistenciaAbierta =
            await _repository.GetAsistenciaAbiertaAsync(
                dto.EmpleadoId);

        if (asistenciaAbierta is not null)
            throw new InvalidOperationException(
                "El empleado ya tiene una entrada sin salida registrada.");

        var ahora = DateTime.UtcNow;

        var existeHoy =
            await _repository.ExistsByEmpleadoAndFechaAsync(
                dto.EmpleadoId,
                ahora.Date);

        if (existeHoy)
            throw new InvalidOperationException(
                "El empleado ya tiene una asistencia registrada hoy.");

        var asistencia = new Asistencia
        {
            EmpleadoId = dto.EmpleadoId,
            Fecha = ahora.Date,
            HoraEntrada = ahora,
            Estado = "EntradaRegistrada",
            HorasTrabajadas = 0,
            HorasExtras = 0
        };

        await _repository.CreateAsync(asistencia);

        asistencia.Empleado = empleado;

        return MapToDto(asistencia);
    }

    public async Task<AsistenciaDto> CheckOutAsync(
        CheckOutDto dto)
    {
        var asistencia =
            await _repository.GetByIdAsync(dto.AsistenciaId);

        if (asistencia is null)
            throw new KeyNotFoundException(
                "La asistencia no existe.");

        if (asistencia.HoraSalida is not null)
            throw new InvalidOperationException(
                "La salida ya fue registrada.");

        var ahora = DateTime.UtcNow;

        if (ahora <= asistencia.HoraEntrada)
            throw new InvalidOperationException(
                "La hora de salida debe ser mayor que la hora de entrada.");

        AplicarCalculos(asistencia, ahora);

        await _repository.UpdateAsync(asistencia);

        return MapToDto(asistencia);
    }

    public async Task<AsistenciaDto> CreateManualAsync(
        CreateAsistenciaManualDto dto)
    {
        var empleado = await _empleadoRepository.GetByIdAsync(
            dto.EmpleadoId);

        if (empleado is null)
            throw new KeyNotFoundException(
                "El empleado no existe.");

        if (empleado.Estado != "Activo")
            throw new InvalidOperationException(
                "No se puede registrar asistencia para un empleado inactivo.");

        var horaEntrada = DateTime.SpecifyKind(
            dto.HoraEntrada,
            DateTimeKind.Utc);

        var horaSalida = DateTime.SpecifyKind(
            dto.HoraSalida,
            DateTimeKind.Utc);

        if (horaSalida <= horaEntrada)
            throw new ArgumentException(
                "La hora de salida debe ser mayor que la hora de entrada.");

        var existe =
            await _repository.ExistsByEmpleadoAndFechaAsync(
                dto.EmpleadoId,
                horaEntrada.Date);

        if (existe)
            throw new InvalidOperationException(
                "El empleado ya tiene una asistencia registrada en esa fecha.");

        var asistencia = new Asistencia
        {
            EmpleadoId = dto.EmpleadoId,
            Fecha = horaEntrada.Date,
            HoraEntrada = horaEntrada,
            Estado = "SalidaRegistrada"
        };

        AplicarCalculos(asistencia, horaSalida);

        await _repository.CreateAsync(asistencia);

        asistencia.Empleado = empleado;

        return MapToDto(asistencia);
    }

    private static void AplicarCalculos(
        Asistencia asistencia,
        DateTime horaSalida)
    {
        asistencia.HoraSalida = horaSalida;

        var totalHoras = (decimal)
            (horaSalida - asistencia.HoraEntrada).TotalHours;

        asistencia.HorasTrabajadas =
            Math.Round(totalHoras, 2);

        asistencia.HorasExtras =
            asistencia.HorasTrabajadas > HorasJornadaRegular
                ? Math.Round(
                    asistencia.HorasTrabajadas -
                    HorasJornadaRegular,
                    2)
                : 0;

        asistencia.Estado = "SalidaRegistrada";
    }

  private static AsistenciaDto MapToDto(Asistencia asistencia)
{
    return new AsistenciaDto
    {
        Id = asistencia.Id,

        EmpleadoId = asistencia.EmpleadoId,
        EmpleadoNombre = asistencia.Empleado is not null
            ? $"{asistencia.Empleado.Nombre} {asistencia.Empleado.Apellido}"
            : string.Empty,

        DepartamentoId = asistencia.Empleado?.DepartamentoId,
        DepartamentoNombre =
            asistencia.Empleado?.Departamento?.Nombre ?? string.Empty,

        PuestoId = asistencia.Empleado?.PuestoId,
        PuestoNombre =
            asistencia.Empleado?.Puesto?.Nombre ?? string.Empty,

        Fecha = asistencia.Fecha,
        HoraEntrada = asistencia.HoraEntrada,
        HoraSalida = asistencia.HoraSalida,
        HorasTrabajadas = asistencia.HorasTrabajadas,
        HorasExtras = asistencia.HorasExtras,
        Estado = asistencia.Estado
    };
}
}