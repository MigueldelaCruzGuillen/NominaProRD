using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/configuracion")]
[Authorize(Roles = "Administrador")]
public class ConfiguracionSistemaController : ControllerBase
{
    private readonly IConfiguracionSistemaService _service;

    public ConfiguracionSistemaController(
        IConfiguracionSistemaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ConfiguracionSistemaDto>> Get()
    {
        return Ok(await _service.GetAsync());
    }

    [HttpPut]
    public async Task<ActionResult<ConfiguracionSistemaDto>> Update(
        ConfiguracionSistemaDto dto)
    {
        return Ok(await _service.UpdateAsync(dto));
    }
}