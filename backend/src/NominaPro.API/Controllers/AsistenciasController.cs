using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AsistenciasController : ControllerBase
{
    private readonly IRepository<Asistencia> _repository;

    public AsistenciasController(IRepository<Asistencia> repository)
    {
        _repository = repository;
    }

    [HttpPost("check-in")]
    public async Task<IActionResult> CheckIn(CheckInDto dto)
    {
        var ahora = DateTime.UtcNow;

        var asistencia = new Asistencia
        {
            EmpleadoId = dto.EmpleadoId,
            Fecha = ahora.Date,
            HoraEntrada = ahora,
            Estado = "EntradaRegistrada"
        };

        await _repository.CreateAsync(asistencia);

        return Ok(new
        {
            asistencia.Id,
            asistencia.EmpleadoId,
            asistencia.Fecha,
            asistencia.HoraEntrada,
            asistencia.Estado
        });
    }

    [HttpPost("check-out")]
    public async Task<IActionResult> CheckOut(CheckOutDto dto)
    {
        var asistencia = await _repository.GetByIdAsync(dto.AsistenciaId);

        if (asistencia is null)
            return NotFound();

        if (asistencia.HoraSalida is not null)
            return BadRequest(new { message = "La salida ya fue registrada." });

        var ahora = DateTime.UtcNow;

        asistencia.HoraSalida = ahora;

        var horas = (decimal)(ahora - asistencia.HoraEntrada).TotalHours;
        asistencia.HorasTrabajadas = Math.Round(horas, 2);

        asistencia.HorasExtras = asistencia.HorasTrabajadas > 8
            ? Math.Round(asistencia.HorasTrabajadas - 8, 2)
            : 0;

        asistencia.Estado = "SalidaRegistrada";

        await _repository.UpdateAsync(asistencia);

        return Ok(new
        {
            asistencia.Id,
            asistencia.EmpleadoId,
            asistencia.Fecha,
            asistencia.HoraEntrada,
            asistencia.HoraSalida,
            asistencia.HorasTrabajadas,
            asistencia.HorasExtras,
            asistencia.Estado
        });
    }

    [HttpPost("manual")]
    public async Task<IActionResult> CrearManual(CreateAsistenciaManualDto dto)
    {
        if (dto.HoraSalida <= dto.HoraEntrada)
            return BadRequest(new { message = "La hora de salida debe ser mayor que la hora de entrada." });

        var horas = (decimal)(dto.HoraSalida - dto.HoraEntrada).TotalHours;
        var horasTrabajadas = Math.Round(horas, 2);

        var asistencia = new Asistencia
        {
            EmpleadoId = dto.EmpleadoId,
            Fecha = DateTime.SpecifyKind(dto.HoraEntrada.Date, DateTimeKind.Utc),
            HoraEntrada = DateTime.SpecifyKind(dto.HoraEntrada, DateTimeKind.Utc),
            HoraSalida = DateTime.SpecifyKind(dto.HoraSalida, DateTimeKind.Utc),
            HorasTrabajadas = horasTrabajadas,
            HorasExtras = horasTrabajadas > 8 ? Math.Round(horasTrabajadas - 8, 2) : 0,
            Estado = "SalidaRegistrada"
        };

        await _repository.CreateAsync(asistencia);

        return Ok(new
        {
            asistencia.Id,
            asistencia.EmpleadoId,
            asistencia.Fecha,
            asistencia.HoraEntrada,
            asistencia.HoraSalida,
            asistencia.HorasTrabajadas,
            asistencia.HorasExtras,
            asistencia.Estado
        });
    }

    [HttpGet("empleado/{empleadoId:guid}")]
    public async Task<IActionResult> GetByEmpleado(Guid empleadoId)
    {
        var asistencias = await _repository.GetAllAsync();

        var result = asistencias
            .Where(a => a.EmpleadoId == empleadoId)
            .OrderByDescending(a => a.Fecha)
            .Select(a => new AsistenciaDto
            {
                Id = a.Id,
                EmpleadoId = a.EmpleadoId,
                Fecha = a.Fecha,
                HoraEntrada = a.HoraEntrada,
                HoraSalida = a.HoraSalida,
                HorasTrabajadas = a.HorasTrabajadas,
                HorasExtras = a.HorasExtras,
                Estado = a.Estado
            })
            .ToList();

        return Ok(result);
    }
}