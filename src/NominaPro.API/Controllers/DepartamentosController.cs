using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Features.Departamentos.Commands;
using NominaPro.Application.Features.Departamentos.Queries;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartamentosController : ControllerBase
{
    private readonly IMediator _mediator;

    public DepartamentosController(IMediator mediator)
    {
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
        var departamento = await _mediator.Send(new GetDepartamentoByIdQuery(id));

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

    [Authorize(Policy = "RRHH")]
[HttpPut("{id:guid}")]
public async Task<ActionResult<DepartamentoDto>> Update(
    Guid id,
    UpdateDepartamentoCommand command)
{
    command.Id = id;

    var actualizado = await _mediator.Send(command);

    if (actualizado is null)
    {
        return NotFound(new
        {
            message = "Departamento no encontrado."
        });
    }

    return Ok(actualizado);
}

[Authorize(Policy = "RRHH")]
[HttpPatch("{id:guid}/desactivar")]
public async Task<IActionResult> Desactivar(Guid id)
{
    var resultado = await _mediator.Send(
        new DeactivateDepartamentoCommand
        {
            Id = id
        }
    );

    if (!resultado)
    {
        return NotFound(new
        {
            message = "Departamento no encontrado."
        });
    }

    return NoContent();
}

[Authorize(Policy = "RRHH")]
[HttpPatch("{id:guid}/reactivar")]
public async Task<IActionResult> Reactivar(Guid id)
{
    var resultado = await _mediator.Send(
        new ReactivateDepartamentoCommand
        {
            Id = id
        }
    );

    if (!resultado)
    {
        return NotFound(new
        {
            message = "Departamento no encontrado."
        });
    }

    return NoContent();
}
}