using NominaPro.Application.DTOs;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IEmpleadoService
{
    Task<List<EmpleadoDto>> GetAllAsync();
    Task<EmpleadoDto?> GetByIdAsync(Guid id);
    Task<EmpleadoDto> CreateAsync(CreateEmpleadoDto dto);
    Task<Empleado?> GetEntityByIdForUpdateAsync(Guid id);
    Task DeleteAsync(Empleado empleado);
    Task<EmpleadoDto?> UpdateAsync(Guid id, CreateEmpleadoDto dto);
}