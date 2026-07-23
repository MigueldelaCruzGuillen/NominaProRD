using NominaPro.Application.DTOs;

namespace NominaPro.Application.Interfaces;

public interface IConfiguracionSistemaService
{
    Task<ConfiguracionSistemaDto> GetAsync();
    Task<ConfiguracionSistemaDto> UpdateAsync(ConfiguracionSistemaDto dto);
}