using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class DepartamentoRepository : IDepartamentoRepository
{
    private readonly AppDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DepartamentoRepository(
        AppDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<Departamento>> GetAllAsync()
    {
        return await _context.Departamentos
            .Include(d => d.Empleados)
            .Where(d => d.EmpresaId == _currentUser.EmpresaId)
            .ToListAsync();
    }

    public async Task<bool> ExistsByNombreAsync(
        string nombre,
        Guid empresaId,
        Guid? excluirId = null)
    {
        var nombreNormalizado = nombre.Trim().ToLower();

        return await _context.Departamentos.AnyAsync(d =>
            d.EmpresaId == empresaId &&
            d.Nombre.ToLower() == nombreNormalizado &&
            (!excluirId.HasValue || d.Id != excluirId.Value)
        );
    }

    public async Task<Departamento?> GetByIdAsync(Guid id)
    {
        return await _context.Departamentos
            .Include(d => d.Empleados)
            .FirstOrDefaultAsync(d =>
                d.Id == id &&
                d.EmpresaId == _currentUser.EmpresaId
            );
    }

    public async Task<Departamento> CreateAsync(
        Departamento departamento)
    {
        _context.Departamentos.Add(departamento);
        await _context.SaveChangesAsync();

        return departamento;
    }

    public async Task UpdateAsync(Departamento departamento)
    {
        _context.Departamentos.Update(departamento);
        await _context.SaveChangesAsync();
    }
}