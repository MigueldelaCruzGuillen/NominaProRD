using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IEmpresaRepository
{
    Task<List<Empresa>> GetAllAsync();
    Task<Empresa?> GetByIdAsync(Guid id);
    Task<Empresa> CreateAsync(Empresa empresa);
}