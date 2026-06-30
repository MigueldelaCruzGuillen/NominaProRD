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
}