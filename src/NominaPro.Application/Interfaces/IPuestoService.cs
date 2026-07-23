using NominaPro.Application.DTOs;

namespace NominaPro.Application.Interfaces;

public interface IPuestoService
{
    Task<List<PuestoDto>> GetAllAsync();

    Task<PuestoDto?> GetByIdAsync(Guid id);

    Task<PuestoDto> CreateAsync(CreatePuestoDto dto);

    Task<PuestoDto> UpdateAsync(
        Guid id,
        UpdatePuestoDto dto);

    Task DeactivateAsync(Guid id);

    Task ReactivateAsync(Guid id);
}