using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class DepartamentoService : IDepartamentoService
{
    private readonly IDepartamentoRepository _repository;
private readonly ICurrentUserService _currentUser;

public DepartamentoService(
    IDepartamentoRepository repository,
    ICurrentUserService currentUser)
{
    _repository = repository;
    _currentUser = currentUser;
}

    public async Task<List<DepartamentoDto>> GetAllAsync()
    {
        var departamentos = await _repository.GetAllAsync();

        return departamentos.Select(d => new DepartamentoDto
        {
            Id = d.Id,
            Nombre = d.Nombre,
            Descripcion = d.Descripcion,
            EmpresaId = d.EmpresaId
        }).ToList();
    }

    public async Task<DepartamentoDto?> GetByIdAsync(Guid id)
    {
        var d = await _repository.GetByIdAsync(id);

        if (d is null)
            return null;

        return new DepartamentoDto
        {
            Id = d.Id,
            Nombre = d.Nombre,
            Descripcion = d.Descripcion,
            EmpresaId = d.EmpresaId
        };
    }

    public async Task<DepartamentoDto> CreateAsync(CreateDepartamentoDto dto)
    {
        var departamento = new Departamento
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
           EmpresaId = _currentUser.EmpresaId
        };

        await _repository.CreateAsync(departamento);

        return new DepartamentoDto
        {
            Id = departamento.Id,
            Nombre = departamento.Nombre,
            Descripcion = departamento.Descripcion,
            EmpresaId = departamento.EmpresaId
        };
    }
}