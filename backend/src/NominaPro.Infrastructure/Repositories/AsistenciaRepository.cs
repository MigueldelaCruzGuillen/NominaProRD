using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class AsistenciaRepository : IAsistenciaRepository
{
    private readonly AppDbContext _context;

    public AsistenciaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<decimal> GetHorasExtrasPeriodoAsync(
        Guid empleadoId,
        DateTime fechaInicio,
        DateTime fechaFin)
    {
        return await _context.Asistencias
            .Where(a =>
                a.EmpleadoId == empleadoId &&
                a.Fecha >= fechaInicio &&
                a.Fecha <= fechaFin)
            .SumAsync(a => a.HorasExtras);
    }
}