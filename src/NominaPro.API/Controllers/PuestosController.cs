using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PuestosController : ControllerBase
{
    private readonly IPuestoService _service;

    public PuestosController(IPuestoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<PuestoDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PuestoDto>> GetById(Guid id)
    {
        var puesto = await _service.GetByIdAsync(id);

        if (puesto == null)
            return NotFound();

        return Ok(puesto);
    }

    [HttpPost]
    public async Task<ActionResult<PuestoDto>> Create(CreatePuestoDto dto)
    {
        var puesto = await _service.CreateAsync(dto);

        return CreatedAtAction(nameof(GetById), new { id = puesto.Id }, puesto);
    }
}