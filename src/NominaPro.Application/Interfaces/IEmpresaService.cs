using NominaPro.Application.DTOs;

namespace NominaPro.Application.Interfaces;

public interface IEmpresaService
{
    Task<List<EmpresaDto>> GetAllAsync();
    Task<EmpresaDto?> GetByIdAsync(Guid id);
    Task<EmpresaDto> CreateAsync(CreateEmpresaDto dto);
}