using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByEmailAsync(string email);
    Task<Usuario> CreateAsync(Usuario usuario);
}