using NominaPro.Application.DTOs;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IEmpresaService
{
    Task<List<EmpresaDto>> GetAllAsync();
    Task<EmpresaDto?> GetByIdAsync(Guid id);
    Task<EmpresaDto> CreateAsync(CreateEmpresaDto dto);

    Task<Empresa?> GetEntityByIdForUpdateAsync(Guid id);
    Task UpdateAsync(Empresa empresa);
}