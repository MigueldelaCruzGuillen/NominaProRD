using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IEmpleadoRepository
{
    Task<List<Empleado>> GetAllAsync();
    Task<Empleado?> GetByIdAsync(Guid id);
    Task<Empleado> CreateAsync(Empleado empleado);
    Task UpdateAsync(Empleado empleado);
    Task DeleteAsync(Empleado empleado);
}