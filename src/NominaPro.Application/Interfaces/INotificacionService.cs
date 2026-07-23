using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface INotificacionService
{
    Task<List<Notificacion>> GetAllAsync();
    Task CrearAsync(
        string titulo,
        string mensaje,
        string tipo = "Info",
        Guid? usuarioId = null
    );

    Task<bool> MarcarComoLeidaAsync(Guid id);
    Task MarcarTodasComoLeidasAsync();
    Task<bool> EliminarAsync(Guid id);
}