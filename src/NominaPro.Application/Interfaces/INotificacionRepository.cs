using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface INotificacionRepository
{
    Task<List<Notificacion>> GetAllAsync(Guid empresaId);

    Task<Notificacion?> GetByIdAsync(Guid id);

    Task CreateAsync(Notificacion notificacion);

    Task UpdateAsync(Notificacion notificacion);

    Task DeleteAsync(Notificacion notificacion);
}