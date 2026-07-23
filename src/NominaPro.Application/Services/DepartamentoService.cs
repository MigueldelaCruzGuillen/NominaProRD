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
            EmpresaId = d.EmpresaId,
            TotalEmpleados = d.Empleados?.Count(e => e.Activo) ?? 0
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
            EmpresaId = d.EmpresaId,
            TotalEmpleados = d.Empleados?.Count(e => e.Activo) ?? 0
        };
    }

    public async Task<DepartamentoDto> CreateAsync(CreateDepartamentoDto dto)
    {
        // Validar nombre único
        var existe = await _repository.ExistsByNombreAsync(
            dto.Nombre,
            _currentUser.EmpresaId
        );

        if (existe)
        {
            throw new InvalidOperationException("Ya existe un departamento con ese nombre.");
        }

        var departamento = new Departamento
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            EmpresaId = _currentUser.EmpresaId,
            Activo = true
        };

        await _repository.CreateAsync(departamento);

        return new DepartamentoDto
        {
            Id = departamento.Id,
            Nombre = departamento.Nombre,
            Descripcion = departamento.Descripcion,
            EmpresaId = departamento.EmpresaId,
            TotalEmpleados = 0
        };
    }

    public async Task<DepartamentoDto?> UpdateAsync(
    Guid id,
    UpdateDepartamentoDto dto)
{
    var departamento = await _repository.GetByIdAsync(id);

    if (departamento is null)
        return null;

    var duplicado = await _repository.ExistsByNombreAsync(
        dto.Nombre.Trim(),
        _currentUser.EmpresaId,
        id
    );

    if (duplicado)
        throw new InvalidOperationException(
            "Ya existe otro departamento con ese nombre."
        );

    departamento.Nombre = dto.Nombre.Trim();
    departamento.Descripcion = dto.Descripcion?.Trim() ?? "";
    departamento.Activo = dto.Activo;

    await _repository.UpdateAsync(departamento);

    return new DepartamentoDto
    {
        Id = departamento.Id,
        Nombre = departamento.Nombre,
        Descripcion = departamento.Descripcion,
        EmpresaId = departamento.EmpresaId,
        Activo = departamento.Activo,
        TotalEmpleados = departamento.Empleados.Count(e => e.Activo)
    };
}
}