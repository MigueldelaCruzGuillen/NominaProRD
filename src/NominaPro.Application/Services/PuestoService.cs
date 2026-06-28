using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class PuestoService : IPuestoService
{
    private readonly IPuestoRepository _repository;

    public PuestoService(IPuestoRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<PuestoDto>> GetAllAsync()
    {
        var puestos = await _repository.GetAllAsync();

        return puestos.Select(p => new PuestoDto
        {
            Id = p.Id,
            Nombre = p.Nombre,
            Descripcion = p.Descripcion,
            EmpresaId = p.EmpresaId
        }).ToList();
    }

    public async Task<PuestoDto?> GetByIdAsync(Guid id)
    {
        var puesto = await _repository.GetByIdAsync(id);

        if (puesto == null)
            return null;

        return new PuestoDto
        {
            Id = puesto.Id,
            Nombre = puesto.Nombre,
            Descripcion = puesto.Descripcion,
            EmpresaId = puesto.EmpresaId
        };
    }

    public async Task<PuestoDto> CreateAsync(CreatePuestoDto dto)
    {
        var puesto = new Puesto
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            EmpresaId = dto.EmpresaId
        };

        await _repository.CreateAsync(puesto);

        return new PuestoDto
        {
            Id = puesto.Id,
            Nombre = puesto.Nombre,
            Descripcion = puesto.Descripcion,
            EmpresaId = puesto.EmpresaId
        };
    }
}