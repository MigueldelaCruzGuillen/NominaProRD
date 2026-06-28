using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class PuestoRepository : IPuestoRepository
{
    private readonly AppDbContext _context;

    public PuestoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Puesto>> GetAllAsync()
    {
        return await _context.Puestos.ToListAsync();
    }

    public async Task<Puesto?> GetByIdAsync(Guid id)
    {
        return await _context.Puestos.FindAsync(id);
    }

    public async Task<Puesto> CreateAsync(Puesto puesto)
    {
        _context.Puestos.Add(puesto);
        await _context.SaveChangesAsync();

        return puesto;
    }
}