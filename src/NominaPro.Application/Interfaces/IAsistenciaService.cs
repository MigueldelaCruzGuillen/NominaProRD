using NominaPro.Application.DTOs;

namespace NominaPro.Application.Interfaces;

public interface IAsistenciaService
{
    Task<List<AsistenciaDto>> GetAllAsync();

    Task<List<AsistenciaDto>> GetByEmpleadoAsync(Guid empleadoId);

    Task<AsistenciaDto> CheckInAsync(CheckInDto dto);

    Task<AsistenciaDto> CheckOutAsync(CheckOutDto dto);

    Task<AsistenciaDto> CreateManualAsync(
        CreateAsistenciaManualDto dto);
}