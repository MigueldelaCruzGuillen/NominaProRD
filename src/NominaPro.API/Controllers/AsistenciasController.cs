using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AsistenciasController : ControllerBase
{
    private readonly IAsistenciaService _service;

    public AsistenciasController(
        IAsistenciaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<AsistenciaDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("empleado/{empleadoId:guid}")]
    public async Task<ActionResult<List<AsistenciaDto>>> GetByEmpleado(
        Guid empleadoId)
    {
        return Ok(
            await _service.GetByEmpleadoAsync(empleadoId));
    }

    [HttpPost("check-in")]
    public async Task<ActionResult<AsistenciaDto>> CheckIn(
        CheckInDto dto)
    {
        var asistencia =
            await _service.CheckInAsync(dto);

        return Ok(asistencia);
    }

    [HttpPost("check-out")]
    public async Task<ActionResult<AsistenciaDto>> CheckOut(
        CheckOutDto dto)
    {
        var asistencia =
            await _service.CheckOutAsync(dto);

        return Ok(asistencia);
    }

    [HttpPost("manual")]
    public async Task<ActionResult<AsistenciaDto>> CreateManual(
        CreateAsistenciaManualDto dto)
    {
        var asistencia =
            await _service.CreateManualAsync(dto);

        return Ok(asistencia);
    }
}