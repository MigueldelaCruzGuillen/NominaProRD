using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface IAsistenciaRepository
{
    Task<decimal> GetHorasExtrasPeriodoAsync(
        Guid empleadoId,
        DateTime fechaInicio,
        DateTime fechaFin);
}