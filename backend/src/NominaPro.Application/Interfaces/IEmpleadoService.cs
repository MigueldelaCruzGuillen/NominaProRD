using NominaPro.Application.DTOs;

namespace NominaPro.Application.Interfaces;

public interface IEmpleadoService
{
    Task<List<EmpleadoDto>> GetAllAsync();
    Task<EmpleadoDto?> GetByIdAsync(Guid id);
    Task<EmpleadoDto> CreateAsync(CreateEmpleadoDto dto);
}