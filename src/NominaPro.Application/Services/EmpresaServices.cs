using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class EmpresaService : IEmpresaService
{
    private readonly IEmpresaRepository _repository;
    private readonly IAuditoriaService _auditoriaService;
    private readonly ICurrentUserService _currentUser;
    

    public EmpresaService(
        IEmpresaRepository repository,
        IAuditoriaService auditoriaService,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _auditoriaService = auditoriaService;
        _currentUser = currentUser;
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

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Empresas",
            "Crear",
            $"Se creó la empresa {empresa.Nombre}"
        );

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

    public async Task<Empresa?> GetEntityByIdForUpdateAsync(Guid id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task UpdateAsync(Empresa empresa)
    {
        await _repository.UpdateAsync(empresa);

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Empresas",
            "Editar",
            $"Actualizó la información de la empresa {empresa.Nombre}"
        );
    }

    public async Task DeleteAsync(Empresa empresa)
    {
        empresa.Activa = false;

        await _repository.UpdateAsync(empresa);

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Empresas",
            "Desactivar",
            $"Desactivó la empresa {empresa.Nombre}"
        );
    }
}