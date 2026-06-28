using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using MediatR;
using NominaPro.Application.Features.Departamentos.Commands;
using NominaPro.Application.Features.Departamentos.Queries;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartamentosController : ControllerBase
{
    private readonly IDepartamentoService _service;

  private readonly IMediator _mediator;

public DepartamentosController(
    IDepartamentoService service,
    IMediator mediator)
{
    _service = service;
    _mediator = mediator;
}
   [HttpGet]
    public async Task<ActionResult<List<DepartamentoDto>>> GetAll()
   {
    return Ok(await _mediator.Send(new GetDepartamentosQuery()));
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
public async Task<ActionResult<DepartamentoDto>> Create(CreateDepartamentoCommand command)
{
    var departamento = await _mediator.Send(command);

    return CreatedAtAction(nameof(GetById), new { id = departamento.Id }, departamento);
}
}