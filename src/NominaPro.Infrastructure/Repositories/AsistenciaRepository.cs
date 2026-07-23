using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class AsistenciaRepository : IAsistenciaRepository
{
    private readonly AppDbContext _context;

    public AsistenciaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Asistencia>> GetAllAsync()
    {
        return await _context.Asistencias
            .AsNoTracking()
            .Include(a => a.Empleado)
                .ThenInclude(e => e.Departamento)
            .Include(a => a.Empleado)
                .ThenInclude(e => e.Puesto)
            .OrderByDescending(a => a.Fecha)
            .ThenByDescending(a => a.HoraEntrada)
            .ToListAsync();
    }

    public async Task<Asistencia?> GetByIdAsync(Guid id)
    {
        return await _context.Asistencias
            .Include(a => a.Empleado)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<List<Asistencia>> GetByEmpleadoAsync(
    Guid empleadoId)
    {
        return await _context.Asistencias
            .AsNoTracking()
            .Include(a => a.Empleado)
                .ThenInclude(e => e.Departamento)
            .Include(a => a.Empleado)
                .ThenInclude(e => e.Puesto)
            .Where(a => a.EmpleadoId == empleadoId)
            .OrderByDescending(a => a.Fecha)
            .ThenByDescending(a => a.HoraEntrada)
            .ToListAsync();
    }

    public async Task<Asistencia?> GetAsistenciaAbiertaAsync(
        Guid empleadoId)
    {
        return await _context.Asistencias
            .Where(a =>
                a.EmpleadoId == empleadoId &&
                a.HoraSalida == null)
            .OrderByDescending(a => a.HoraEntrada)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> ExistsByEmpleadoAndFechaAsync(
        Guid empleadoId,
        DateTime fecha)
    {
        var inicio = fecha.Date;
        var fin = inicio.AddDays(1);

        return await _context.Asistencias.AnyAsync(a =>
            a.EmpleadoId == empleadoId &&
            a.Fecha >= inicio &&
            a.Fecha < fin);
    }

    public async Task CreateAsync(Asistencia asistencia)
    {
        await _context.Asistencias.AddAsync(asistencia);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Asistencia asistencia)
    {
        _context.Asistencias.Update(asistencia);
        await _context.SaveChangesAsync();
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