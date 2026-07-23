using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class NotificacionRepository : INotificacionRepository
{
    private readonly AppDbContext _context;

    public NotificacionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Notificacion>> GetAllAsync(Guid empresaId)
    {
        return await _context.Notificaciones
            .Where(x => x.EmpresaId == empresaId)
            .OrderByDescending(x => x.Fecha)
            .ToListAsync();
    }

    public async Task<Notificacion?> GetByIdAsync(Guid id)
    {
        return await _context.Notificaciones
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task CreateAsync(Notificacion notificacion)
    {
        _context.Notificaciones.Add(notificacion);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Notificacion notificacion)
    {
        _context.Notificaciones.Update(notificacion);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Notificacion notificacion)
    {
        _context.Notificaciones.Remove(notificacion);
        await _context.SaveChangesAsync();
    }
}