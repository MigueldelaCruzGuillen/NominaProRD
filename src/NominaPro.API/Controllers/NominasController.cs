using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NominasController : ControllerBase
{
    private readonly INominaService _service;

    public NominasController(INominaService service)
    {
        _service = service;
    }

    [HttpPost("generar")]
    public async Task<IActionResult> Generar(GenerarNominaDto dto)
    {
        var nomina = await _service.GenerarNominaAsync(dto);

        return Ok(new
        {
            nomina.Id,
            nomina.EmpresaId,
            nomina.PeriodoNominaId,
            nomina.TotalBruto,
            nomina.TotalDeducciones,
            nomina.TotalNeto,
            nomina.Estado,
            Detalles = nomina.Detalles.Select(d => new
            {
                d.EmpleadoId,
                d.SalarioBase,
                d.Afp,
                d.Sfs,
                d.Isr,
                d.TotalIngresos,
                d.TotalDeducciones,
                d.NetoPagar
            })
        });
    }

    [HttpGet]
    public async Task<ActionResult<List<NominaResumenDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NominaDto>> GetById(Guid id)
    {
        var nomina = await _service.GetByIdAsync(id);

        if (nomina is null)
            return NotFound();

        return Ok(nomina);
    }
}