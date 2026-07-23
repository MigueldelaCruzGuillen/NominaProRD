using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IAuditoriaService
{
    Task RegistrarAsync(
        Guid usuarioId,
        string usuario,
        string modulo,
        string accion,
        string descripcion,
        string? ip = null);

    Task<List<Auditoria>> GetAllAsync();
}