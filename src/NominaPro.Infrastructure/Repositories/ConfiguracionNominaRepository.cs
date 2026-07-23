using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class ConfiguracionNominaRepository : IConfiguracionNominaRepository
{
    private readonly AppDbContext _context;

    public ConfiguracionNominaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ConfiguracionNomina?> GetByEmpresaAsync(Guid empresaId)
    {
        return await _context.ConfiguracionesNomina
            .FirstOrDefaultAsync(x => x.EmpresaId == empresaId);
    }

    public async Task CreateAsync(ConfiguracionNomina configuracion)
    {
        _context.ConfiguracionesNomina.Add(configuracion);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(ConfiguracionNomina configuracion)
    {
        _context.ConfiguracionesNomina.Update(configuracion);
        await _context.SaveChangesAsync();
    }
}