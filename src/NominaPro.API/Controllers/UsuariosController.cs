using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "SoloAdmin")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _service;

    public UsuariosController(IUsuarioService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<UsuarioDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UsuarioDto>> GetById(Guid id)
    {
        var usuario = await _service.GetByIdAsync(id);

        if (usuario is null)
            return NotFound();

        return Ok(usuario);
    }

    [HttpPost]
    public async Task<ActionResult<UsuarioDto>> Create(CreateUsuarioDto dto)
    {
        var usuario = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = usuario.Id },
            usuario
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UsuarioDto>> Update(
        Guid id,
        UpdateUsuarioDto dto)
    {
        var usuario = await _service.UpdateAsync(id, dto);

        if (usuario is null)
            return NotFound();

        return Ok(usuario);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var eliminado = await _service.DeleteAsync(id);

        if (!eliminado)
            return NotFound();

        return NoContent();
    }

    [HttpPut("{id:guid}/password")]
public async Task<IActionResult> CambiarPassword(
    Guid id,
    CambiarPasswordUsuarioDto dto)
{
    var actualizado = await _service.CambiarPasswordAsync(id, dto);

    if (!actualizado)
        return NotFound();

    return NoContent();
}

[HttpPut("mi-password")]
public async Task<IActionResult> CambiarMiPassword(CambiarMiPasswordDto dto)
{
    await _service.CambiarMiPasswordAsync(dto);
    return NoContent();
}

[HttpPut("mi-perfil")]
public async Task<ActionResult<UsuarioDto>> ActualizarMiPerfil(
    ActualizarMiPerfilDto dto)
{
    return Ok(await _service.ActualizarMiPerfilAsync(dto));
}
}