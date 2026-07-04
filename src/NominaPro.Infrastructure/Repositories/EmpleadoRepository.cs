using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class EmpleadoRepository : IEmpleadoRepository
{
    private readonly AppDbContext _context;

    public EmpleadoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Empleado>> GetAllAsync()
    {
        return await _context.Empleados.ToListAsync();
    }

    public async Task<Empleado?> GetByIdAsync(Guid id)
    {
        return await _context.Empleados.FindAsync(id);
    }

    public async Task DeleteAsync(Empleado empleado)
    {
        _context.Empleados.Remove(empleado);
        await _context.SaveChangesAsync();
    }
    public async Task UpdateAsync(Empleado empleado)
    {
        _context.Empleados.Update(empleado);
        await _context.SaveChangesAsync();
    }

    public async Task<Empleado> CreateAsync(Empleado empleado)
    {
        _context.Empleados.Add(empleado);
        await _context.SaveChangesAsync();

        return empleado;
    }
}