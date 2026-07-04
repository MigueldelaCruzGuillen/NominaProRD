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
}