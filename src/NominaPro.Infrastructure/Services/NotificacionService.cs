using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Infrastructure.Services;

public class NotificacionService : INotificacionService
{
    private readonly INotificacionRepository _repository;
    private readonly ICurrentUserService _currentUser;

    public NotificacionService(
        INotificacionRepository repository,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<List<Notificacion>> GetAllAsync()
    {
        return await _repository.GetAllAsync(_currentUser.EmpresaId);
    }

    public async Task CrearAsync(
        string titulo,
        string mensaje,
        string tipo = "Info",
        Guid? usuarioId = null)
    {
        var notificacion = new Notificacion
        {
            Titulo = titulo,
            Mensaje = mensaje,
            Tipo = tipo,
            Leida = false,
            Fecha = DateTime.UtcNow,
            EmpresaId = _currentUser.EmpresaId,
            UsuarioId = usuarioId
        };

        await _repository.CreateAsync(notificacion);
    }

    public async Task<bool> MarcarComoLeidaAsync(Guid id)
    {
        var notificacion = await _repository.GetByIdAsync(id);

        if (notificacion is null ||
            notificacion.EmpresaId != _currentUser.EmpresaId)
            return false;

        notificacion.Leida = true;

        await _repository.UpdateAsync(notificacion);

        return true;
    }

    public async Task MarcarTodasComoLeidasAsync()
    {
        var notificaciones = await _repository.GetAllAsync(_currentUser.EmpresaId);

        foreach (var notificacion in notificaciones.Where(x => !x.Leida))
        {
            notificacion.Leida = true;
            await _repository.UpdateAsync(notificacion);
        }
    }

    public async Task<bool> EliminarAsync(Guid id)
    {
        var notificacion = await _repository.GetByIdAsync(id);

        if (notificacion is null ||
            notificacion.EmpresaId != _currentUser.EmpresaId)
            return false;

        await _repository.DeleteAsync(notificacion);

        return true;
    }
}