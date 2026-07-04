namespace NominaPro.Application.Interfaces;

public interface ICurrentUserService
{
    Guid EmpresaId { get; }
    Guid UsuarioId { get; }
    string Email { get; }
    string Rol { get; }
}