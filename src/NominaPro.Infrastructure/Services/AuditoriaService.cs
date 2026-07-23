using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Infrastructure.Services;

public class AuditoriaService : IAuditoriaService
{
    private readonly IAuditoriaRepository _repository;
    private readonly INotificacionService _notificacionService;

    public AuditoriaService(
        IAuditoriaRepository repository,
        INotificacionService notificacionService)
    {
        _repository = repository;
        _notificacionService = notificacionService;
    }

    public async Task RegistrarAsync(
        Guid usuarioId,
        string usuario,
        string modulo,
        string accion,
        string descripcion,
        string? ip = null)
    {
        var auditoria = new Auditoria
        {
            UsuarioId = usuarioId,
            Usuario = usuario,
            Modulo = modulo,
            Accion = accion,
            Descripcion = descripcion,
            Fecha = DateTime.UtcNow,
            Ip = ip
        };

        await _repository.CreateAsync(auditoria);

        // Crear notificación
        await _notificacionService.CrearAsync(
            $"{modulo} · {accion}",
            descripcion,
            ObtenerTipo(accion),
            usuarioId
        );
    }

    public async Task<List<Auditoria>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    private static string ObtenerTipo(string accion)
    {
        return accion.ToLower() switch
        {
            "crear" => "Success",
            "generar" => "Success",
            "pagar" => "Success",
            "editar" => "Info",
            "reactivar" => "Info",
            "cerrar" => "Warning",
            "desactivar" => "Warning",
            "eliminar" => "Error",
            _ => "Info"
        };
    }
}