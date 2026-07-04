using NominaPro.Application.DTOs;

namespace NominaPro.Application.Interfaces;

public interface IDepartamentoService
{
    Task<List<DepartamentoDto>> GetAllAsync();
    Task<DepartamentoDto?> GetByIdAsync(Guid id);
    Task<DepartamentoDto> CreateAsync(CreateDepartamentoDto dto);
}