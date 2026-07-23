using NominaPro.Application.DTOs;

namespace NominaPro.Application.Interfaces;

public interface IUsuarioService
{
    Task<List<UsuarioDto>> GetAllAsync();
    Task<UsuarioDto?> GetByIdAsync(Guid id);
    Task<UsuarioDto> CreateAsync(CreateUsuarioDto dto);
    Task<UsuarioDto?> UpdateAsync(Guid id, UpdateUsuarioDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> CambiarPasswordAsync(Guid id, CambiarPasswordUsuarioDto dto);
    Task CambiarMiPasswordAsync(CambiarMiPasswordDto dto);
    Task<UsuarioDto> ActualizarMiPerfilAsync(ActualizarMiPerfilDto dto);
}