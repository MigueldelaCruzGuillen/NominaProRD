using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IConfiguracionNominaRepository
{
    Task<ConfiguracionNomina?> GetByEmpresaAsync(Guid empresaId);
    Task CreateAsync(ConfiguracionNomina configuracion);
    Task UpdateAsync(ConfiguracionNomina configuracion);
}