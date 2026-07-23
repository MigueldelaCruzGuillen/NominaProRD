using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IDepartamentoRepository
{
    Task<List<Departamento>> GetAllAsync();

    Task<Departamento?> GetByIdAsync(Guid id);

    Task<Departamento> CreateAsync(Departamento departamento);

    Task UpdateAsync(Departamento departamento);

    Task<bool> ExistsByNombreAsync(
        string nombre,
        Guid empresaId,
        Guid? excluirId = null
    );
}