using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class EmpresaService : IEmpresaService
{
    private readonly IEmpresaRepository _repository;

    public EmpresaService(IEmpresaRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<EmpresaDto>> GetAllAsync()
    {
        var empresas = await _repository.GetAllAsync();

        return empresas.Select(e => new EmpresaDto
        {
            Id = e.Id,
            Nombre = e.Nombre,
            Rnc = e.Rnc,
            Direccion = e.Direccion,
            Telefono = e.Telefono,
            Correo = e.Correo,
            Activa = e.Activa
        }).ToList();
    }

    public async Task<EmpresaDto?> GetByIdAsync(Guid id)
    {
        var empresa = await _repository.GetByIdAsync(id);

        if (empresa == null)
            return null;

        return new EmpresaDto
        {
            Id = empresa.Id,
            Nombre = empresa.Nombre,
            Rnc = empresa.Rnc,
            Direccion = empresa.Direccion,
            Telefono = empresa.Telefono,
            Correo = empresa.Correo,
            Activa = empresa.Activa
        };
    }

    public async Task<EmpresaDto> CreateAsync(CreateEmpresaDto dto)
    {
        var empresa = new Empresa
        {
            Nombre = dto.Nombre,
            Rnc = dto.Rnc,
            Direccion = dto.Direccion,
            Telefono = dto.Telefono,
            Correo = dto.Correo
        };

        await _repository.CreateAsync(empresa);

        return new EmpresaDto
        {
            Id = empresa.Id,
            Nombre = empresa.Nombre,
            Rnc = empresa.Rnc,
            Direccion = empresa.Direccion,
            Telefono = empresa.Telefono,
            Correo = empresa.Correo,
            Activa = empresa.Activa
        };
    }
}