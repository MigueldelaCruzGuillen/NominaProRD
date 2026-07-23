using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IAsistenciaRepository
{
    Task<List<Asistencia>> GetAllAsync();

    Task<Asistencia?> GetByIdAsync(Guid id);

    Task<List<Asistencia>> GetByEmpleadoAsync(Guid empleadoId);

    Task<Asistencia?> GetAsistenciaAbiertaAsync(Guid empleadoId);

    Task<bool> ExistsByEmpleadoAndFechaAsync(
        Guid empleadoId,
        DateTime fecha);

    Task CreateAsync(Asistencia asistencia);

    Task UpdateAsync(Asistencia asistencia);

    Task<decimal> GetHorasExtrasPeriodoAsync(
        Guid empleadoId,
        DateTime fechaInicio,
        DateTime fechaFin);
}