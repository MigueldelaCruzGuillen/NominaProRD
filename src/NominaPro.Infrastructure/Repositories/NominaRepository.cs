using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class NominaRepository : INominaRepository
{
    private readonly AppDbContext _context;

    public NominaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Nomina>> GetAllByEmpresaAsync(Guid empresaId)
    {
        return await _context.Nominas
            .Where(n => n.EmpresaId == empresaId)
            .OrderByDescending(n => n.FechaGeneracion)
            .ToListAsync();
    }

    public async Task<Nomina?> GetByIdWithDetallesAsync(Guid id, Guid empresaId)
    {
        return await _context.Nominas
            .Include(n => n.Empresa)
            .Include(n => n.PeriodoNomina)
            .Include(n => n.PagadaPorUsuario)
            .Include(n => n.Detalles)
                .ThenInclude(d => d.Empleado)
                    .ThenInclude(e => e.Departamento)
            .Include(n => n.Detalles)
                .ThenInclude(d => d.Empleado)
                    .ThenInclude(e => e.Puesto)
            .FirstOrDefaultAsync(n => n.Id == id && n.EmpresaId == empresaId);
    }

    public async Task<Nomina> CreateAsync(Nomina nomina)
    {
        _context.Nominas.Add(nomina);
        await _context.SaveChangesAsync();
        return nomina;
    }

    public async Task<List<Nomina>> GetAllAsync(Guid empresaId)
{
    return await _context.Nominas
        .Where(n => n.EmpresaId == empresaId)
        .OrderByDescending(n => n.FechaGeneracion)
        .ToListAsync();
}

    public async Task<bool> ExisteNominaPorPeriodoAsync(Guid empresaId, Guid periodoNominaId)
    {
        return await _context.Nominas
            .AnyAsync(n =>
                n.EmpresaId == empresaId &&
                n.PeriodoNominaId == periodoNominaId);
    }

    public async Task UpdateAsync(Nomina nomina)
    {
        _context.Nominas.Update(nomina);
        await _context.SaveChangesAsync();
    }
}