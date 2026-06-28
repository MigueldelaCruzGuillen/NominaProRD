using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartamentosController : ControllerBase
{
    private readonly IDepartamentoService _service;

    public DepartamentosController(IDepartamentoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<DepartamentoDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DepartamentoDto>> GetById(Guid id)
    {
        var departamento = await _service.GetByIdAsync(id);

        if (departamento is null)
            return NotFound();

        return Ok(departamento);
    }

    [HttpPost]
    public async Task<ActionResult<DepartamentoDto>> Create(CreateDepartamentoDto dto)
    {
        var departamento = await _service.CreateAsync(dto);

        return CreatedAtAction(nameof(GetById), new { id = departamento.Id }, departamento);
    }
}