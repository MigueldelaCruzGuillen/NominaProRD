using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;


namespace NominaPro.Infrastructure.Repositories;

public class EmpresaRepository : IEmpresaRepository
{
    private readonly AppDbContext _context;

    public EmpresaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Empresa>> GetAllAsync()
    {
        return await _context.Empresas.ToListAsync();
    }

    public async Task<Empresa?> GetByIdAsync(Guid id)
    {
        return await _context.Empresas.FindAsync(id);
    }
    public async Task UpdateAsync(Empleado empleado)
    {
        _context.Empleados.Update(empleado);
        await _context.SaveChangesAsync();
    }



    public async Task<Empresa> CreateAsync(Empresa empresa)
    {
        _context.Empresas.Add(empresa);

        await _context.SaveChangesAsync();

        return empresa;
    }

    public async Task UpdateAsync(Empresa empresa)
{
    _context.Empresas.Update(empresa);
    await _context.SaveChangesAsync();
}
}