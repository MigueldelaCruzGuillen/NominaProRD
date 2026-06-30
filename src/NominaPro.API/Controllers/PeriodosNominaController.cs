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
        var fechaInicio = DateTime.SpecifyKind(dto.FechaInicio, DateTimeKind.Utc);
        var fechaFin = DateTime.SpecifyKind(dto.FechaFin, DateTimeKind.Utc);

        if (string.IsNullOrWhiteSpace(dto.Nombre))
            throw new InvalidOperationException("El nombre del período es obligatorio.");

        if (fechaInicio == default || fechaFin == default)
            throw new InvalidOperationException("Las fechas del período son obligatorias.");

        if (fechaFin <= fechaInicio)
            throw new InvalidOperationException("La fecha fin debe ser mayor que la fecha inicio.");

        var periodos = await _repository.GetAllAsync();

        var existe = periodos.Any(p =>
            p.EmpresaId == _currentUser.EmpresaId &&
            p.FechaInicio == fechaInicio &&
            p.FechaFin == fechaFin);

        if (existe)
            throw new InvalidOperationException("Ya existe un período para ese rango de fechas.");

        var periodo = new PeriodoNomina
        {
            Nombre = dto.Nombre,
            FechaInicio = fechaInicio,
            FechaFin = fechaFin,
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

    [HttpGet]
    public async Task<ActionResult<List<PeriodoNominaDto>>> GetAll()
    {
        var periodos = await _repository.GetAllAsync();

        var result = periodos
            .Where(p => p.EmpresaId == _currentUser.EmpresaId)
            .OrderByDescending(p => p.FechaInicio)
            .Select(p => new PeriodoNominaDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                FechaInicio = p.FechaInicio,
                FechaFin = p.FechaFin,
                Tipo = p.Tipo,
                Estado = p.Estado
            })
            .ToList();

        return Ok(result);
    }
}