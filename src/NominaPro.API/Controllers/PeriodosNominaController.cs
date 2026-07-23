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
    private readonly IAuditoriaService _auditoriaService;

    public PeriodosNominaController(
        IRepository<PeriodoNomina> repository,
        ICurrentUserService currentUser,
        IAuditoriaService auditoriaService)
    {
        _repository = repository;
        _currentUser = currentUser;
        _auditoriaService = auditoriaService;
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

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Períodos",
            "Crear",
            $"Creó el período {periodo.Nombre}"
        );

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

    [Authorize(Policy = "Contabilidad")]
    [HttpPut("{id:guid}/cerrar")]
    public async Task<ActionResult<PeriodoNominaDto>> Cerrar(Guid id)
    {
        var periodos = await _repository.GetAllAsync();

        var periodo = periodos.FirstOrDefault(p =>
            p.Id == id &&
            p.EmpresaId == _currentUser.EmpresaId
        );

        if (periodo is null)
            return NotFound(new { message = "Período no encontrado." });

        if (periodo.Estado == "Cerrado")
            return BadRequest(new { message = "El período ya está cerrado." });

        periodo.Estado = "Cerrado";

        await _repository.UpdateAsync(periodo);

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Períodos",
            "Cerrar",
            $"Cerró el período {periodo.Nombre}"
        );

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