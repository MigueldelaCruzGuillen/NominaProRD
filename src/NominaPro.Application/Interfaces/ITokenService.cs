using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(Usuario usuario);
}