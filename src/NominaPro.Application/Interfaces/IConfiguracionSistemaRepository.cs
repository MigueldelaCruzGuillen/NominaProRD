using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IConfiguracionSistemaRepository
{
    Task<ConfiguracionSistema?> GetByEmpresaAsync(Guid empresaId);
    Task CreateAsync(ConfiguracionSistema configuracion);
    Task UpdateAsync(ConfiguracionSistema configuracion);
}