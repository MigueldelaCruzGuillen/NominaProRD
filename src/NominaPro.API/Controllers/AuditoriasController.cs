using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/auditorias")]
[Authorize(Policy = "SoloAdmin")]
public class AuditoriasController : ControllerBase
{
    private readonly IAuditoriaService _service;

    public AuditoriasController(IAuditoriaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var auditorias = await _service.GetAllAsync();

        return Ok(auditorias.Select(a => new
        {
            a.Id,
            a.UsuarioId,
            a.Usuario,
            a.Modulo,
            a.Accion,
            a.Descripcion,
            a.Fecha,
            a.Ip
        }));
    }
}