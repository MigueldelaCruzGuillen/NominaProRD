using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface INominaRepository
{
    Task<List<Nomina>> GetAllByEmpresaAsync(Guid empresaId);
    Task<Nomina?> GetByIdWithDetallesAsync(Guid id, Guid empresaId);
    Task<Nomina> CreateAsync(Nomina nomina);
}