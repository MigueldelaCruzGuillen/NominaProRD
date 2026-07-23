using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace NominaPro.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmpresasController : ControllerBase
{
    private readonly IEmpresaService _service;

    public EmpresasController(IEmpresaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<EmpresaDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EmpresaDto>> GetById(Guid id)
    {
        var empresa = await _service.GetByIdAsync(id);

        if (empresa is null)
            return NotFound();

        return Ok(empresa);
    }

    [HttpPost]
    public async Task<ActionResult<EmpresaDto>> Create(CreateEmpresaDto dto)
    {
        var empresa = await _service.CreateAsync(dto);

        return CreatedAtAction(nameof(GetById), new { id = empresa.Id }, empresa);
    }

    [HttpPut("{id:guid}")]
public async Task<ActionResult<EmpresaDto>> Update(Guid id, CreateEmpresaDto dto)
{
    var empresa = await _service.GetEntityByIdForUpdateAsync(id);

    if (empresa is null)
        return NotFound();

    empresa.Nombre = dto.Nombre;
    empresa.Rnc = dto.Rnc;
    empresa.Direccion = dto.Direccion;
    empresa.Telefono = dto.Telefono;
    empresa.Correo = dto.Correo;

    await _service.UpdateAsync(empresa);

    return Ok(new EmpresaDto
    {
        Id = empresa.Id,
        Nombre = empresa.Nombre,
        Rnc = empresa.Rnc,
        Direccion = empresa.Direccion,
        Telefono = empresa.Telefono,
        Correo = empresa.Correo,
        Activa = empresa.Activa
    });
}
}