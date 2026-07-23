using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/configuracion-nomina")]
[Authorize(Roles = "Administrador")]
public class ConfiguracionNominaController : ControllerBase
{
    private readonly IConfiguracionNominaService _service;

    public ConfiguracionNominaController(
        IConfiguracionNominaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ConfiguracionNominaDto>> Get()
    {
        return Ok(await _service.GetAsync());
    }

    [HttpPut]
    public async Task<ActionResult<ConfiguracionNominaDto>> Update(
        ConfiguracionNominaDto dto)
    {
        return Ok(await _service.UpdateAsync(dto));
    }
}