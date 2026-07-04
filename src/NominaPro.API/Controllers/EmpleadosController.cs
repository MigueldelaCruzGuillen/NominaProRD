using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmpleadosController : ControllerBase
{
    private readonly IEmpleadoService _service;

    public EmpleadosController(IEmpleadoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<EmpleadoDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EmpleadoDto>> GetById(Guid id)
    {
        var empleado = await _service.GetByIdAsync(id);

        if (empleado is null)
            return NotFound();

        return Ok(empleado);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var empleado = await _service.GetEntityByIdForUpdateAsync(id);

        if (empleado is null)
            return NotFound();

        await _service.DeleteAsync(empleado);

        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<EmpleadoDto>> Create(CreateEmpleadoDto dto)
    {
        var empleado = await _service.CreateAsync(dto);

        return CreatedAtAction(nameof(GetById), new { id = empleado.Id }, empleado);
    }
}