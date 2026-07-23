using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class AuditoriaRepository : IAuditoriaRepository
{
    private readonly AppDbContext _context;

    public AuditoriaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(Auditoria auditoria)
    {
        _context.Auditorias.Add(auditoria);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Auditoria>> GetAllAsync()
    {
        return await _context.Auditorias
            .OrderByDescending(a => a.Fecha)
            .ToListAsync();
    }
}