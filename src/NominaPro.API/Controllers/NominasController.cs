using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.API.Services;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NominasController : ControllerBase
{
    private readonly INominaService _service;
    private readonly PdfService _pdfService;
    private readonly ICurrentUserService _currentUser;

    public NominasController(
        INominaService service,
        PdfService pdfService,
        ICurrentUserService currentUser)
    {
        _service = service;
        _pdfService = pdfService;
        _currentUser = currentUser;
    }

    [Authorize(Policy = "Contabilidad")]
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

    [Authorize(Policy = "SoloLectura")]
    [HttpGet]
    public async Task<ActionResult<List<NominaResumenDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [Authorize(Policy = "SoloLectura")]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NominaDto>> GetById(Guid id)
    {
        var nomina = await _service.GetByIdAsync(id);

        if (nomina is null)
            return NotFound();

        return Ok(nomina);
    }

    [Authorize(Policy = "Contabilidad")]
    [HttpPut("{id:guid}/pagar")]
    public async Task<IActionResult> MarcarComoPagada(Guid id)
    {
        var nomina = await _service.GetEntityByIdForUpdateAsync(id);

        if (nomina is null)
            return NotFound();

        if (nomina.Estado == "Pagada")
            return BadRequest(new { message = "La nómina ya está pagada." });

        // Actualizar propiedades de pago
        nomina.Estado = "Pagada";
        nomina.PagadaPorUsuarioId = _currentUser.UsuarioId;
        nomina.FechaPago = DateTime.UtcNow;

        await _service.UpdateAsync(nomina);

        return Ok(new
        {
            nomina.Id,
            nomina.Estado,
            message = "Nómina marcada como pagada correctamente."
        });
    }

    [Authorize(Policy = "SoloLectura")]
    [HttpGet("{nominaId:guid}/recibo/{empleadoId:guid}")]
    public async Task<IActionResult> DescargarRecibo(
        Guid nominaId,
        Guid empleadoId)
    {
        var nomina = await _service.GetByIdAsync(nominaId);

        if (nomina is null)
            return NotFound();

        var detalle = nomina.Detalles
            .FirstOrDefault(x => x.EmpleadoId == empleadoId);

        if (detalle is null)
            return NotFound();

        var pdf = _pdfService.GenerarReciboNomina(nomina, detalle);
        Console.WriteLine($"PDF generado: {pdf.Length} bytes");

        return File(
            pdf,
            "application/pdf");
    }
}