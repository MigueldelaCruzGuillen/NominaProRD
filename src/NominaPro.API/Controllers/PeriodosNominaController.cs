using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/periodos-nomina")]
[Authorize]
public class PeriodosNominaController : ControllerBase
{
    private readonly IRepository<PeriodoNomina> _repository;
    private readonly ICurrentUserService _currentUser;

    public PeriodosNominaController(
        IRepository<PeriodoNomina> repository,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    [HttpPost]
    public async Task<ActionResult<PeriodoNominaDto>> Create(CreatePeriodoNominaDto dto)
    {
        var periodo = new PeriodoNomina
        {
            Nombre = dto.Nombre,
            FechaInicio = DateTime.SpecifyKind(dto.FechaInicio, DateTimeKind.Utc),
            FechaFin = DateTime.SpecifyKind(dto.FechaFin, DateTimeKind.Utc),
            Tipo = dto.Tipo,
            Estado = "Abierto",
            EmpresaId = _currentUser.EmpresaId
        };

        await _repository.CreateAsync(periodo);

        return Ok(new PeriodoNominaDto
        {
            Id = periodo.Id,
            Nombre = periodo.Nombre,
            FechaInicio = periodo.FechaInicio,
            FechaFin = periodo.FechaFin,
            Tipo = periodo.Tipo,
            Estado = periodo.Estado
        });
    }
}