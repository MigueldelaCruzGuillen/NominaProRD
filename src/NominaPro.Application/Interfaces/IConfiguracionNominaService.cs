using NominaPro.Application.DTOs;

namespace NominaPro.Application.Interfaces;

public interface IConfiguracionNominaService
{
    Task<ConfiguracionNominaDto> GetAsync();
    Task<ConfiguracionNominaDto> UpdateAsync(ConfiguracionNominaDto dto);
}