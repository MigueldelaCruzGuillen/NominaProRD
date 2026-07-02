using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IPuestoRepository
{
    Task<List<Puesto>> GetAllAsync();
    Task<Puesto?> GetByIdAsync(Guid id);
    Task<Puesto> CreateAsync(Puesto puesto);
}