using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class PuestoRepository : IPuestoRepository
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public PuestoRepository(AppDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<Puesto>> GetAllAsync()
    {
        return await _context.Puestos
            .Include(p => p.Departamento)
            .Include(p => p.Empleados)
            .Where(p => p.EmpresaId == _currentUser.EmpresaId)
            .ToListAsync();
    }

    public async Task<Puesto?> GetByIdAsync(Guid id)
    {
        return await _context.Puestos
            .Include(p => p.Departamento)
            .Include(p => p.Empleados)
            .FirstOrDefaultAsync(p => p.Id == id && p.EmpresaId == _currentUser.EmpresaId);
    }

    public async Task<Puesto> CreateAsync(Puesto puesto)
    {
        _context.Puestos.Add(puesto);
        await _context.SaveChangesAsync();

        return puesto;
    }

    public async Task<bool> ExistsByNombreAsync(
        string nombre,
        Guid empresaId,
        Guid? excluirId = null)
    {
        var query = _context.Puestos.Where(p =>
            p.EmpresaId == empresaId &&
            p.Nombre.ToLower() == nombre.ToLower());

        if (excluirId.HasValue)
            query = query.Where(p => p.Id != excluirId.Value);

        return await query.AnyAsync();
    }

    public async Task UpdateAsync(Puesto puesto)
    {
        _context.Puestos.Update(puesto);
        await _context.SaveChangesAsync();
    }
    
}