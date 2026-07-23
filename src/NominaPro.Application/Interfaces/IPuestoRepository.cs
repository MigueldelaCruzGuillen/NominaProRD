using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IPuestoRepository
{
    Task<List<Puesto>> GetAllAsync();
    Task<Puesto?> GetByIdAsync(Guid id);
    Task<Puesto> CreateAsync(Puesto puesto);

    Task<bool> ExistsByNombreAsync(
    string nombre,
    Guid empresaId,
    Guid? excluirId = null);

Task UpdateAsync(Puesto puesto);
}