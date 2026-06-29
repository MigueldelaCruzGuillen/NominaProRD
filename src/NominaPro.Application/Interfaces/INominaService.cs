using NominaPro.Application.DTOs;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface INominaService
{
    Task<Nomina> GenerarNominaAsync(GenerarNominaDto dto);
    Task<List<NominaResumenDto>> GetAllAsync();
    Task<NominaDto?> GetByIdAsync(Guid id);
}