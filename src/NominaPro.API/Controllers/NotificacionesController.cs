using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/notificaciones")]
[Authorize]
public class NotificacionesController : ControllerBase
{
    private readonly INotificacionService _service;

    public NotificacionesController(INotificacionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var notificaciones = await _service.GetAllAsync();

        return Ok(notificaciones.Select(n => new
        {
            n.Id,
            n.Titulo,
            n.Mensaje,
            n.Tipo,
            n.Leida,
            n.Fecha,
            n.UsuarioId
        }));
    }

    [HttpPut("{id:guid}/leer")]
    public async Task<IActionResult> MarcarComoLeida(Guid id)
    {
        var actualizado = await _service.MarcarComoLeidaAsync(id);

        if (!actualizado)
            return NotFound();

        return NoContent();
    }

    [HttpPut("leer-todas")]
    public async Task<IActionResult> MarcarTodasComoLeidas()
    {
        await _service.MarcarTodasComoLeidasAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Eliminar(Guid id)
    {
        var eliminado = await _service.EliminarAsync(id);

        if (!eliminado)
            return NotFound();

        return NoContent();
    }
}