using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface INominaRepository
{
    Task<List<Nomina>> GetAllByEmpresaAsync(Guid empresaId);
    Task<Nomina?> GetByIdWithDetallesAsync(Guid id, Guid empresaId);
    Task<bool> ExisteNominaPorPeriodoAsync(Guid empresaId, Guid periodoNominaId);
    Task<Nomina> CreateAsync(Nomina nomina);
    Task UpdateAsync(Nomina nomina);
    Task<List<Nomina>> GetAllAsync(Guid empresaId);

}