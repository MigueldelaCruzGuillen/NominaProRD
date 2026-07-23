using Microsoft.EntityFrameworkCore;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Data;

namespace NominaPro.Infrastructure.Repositories;

public class ConfiguracionSistemaRepository : IConfiguracionSistemaRepository
{
    private readonly AppDbContext _context;

    public ConfiguracionSistemaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ConfiguracionSistema?> GetByEmpresaAsync(Guid empresaId)
    {
        return await _context.ConfiguracionesSistema
            .FirstOrDefaultAsync(x => x.EmpresaId == empresaId);
    }

    public async Task CreateAsync(ConfiguracionSistema configuracion)
    {
        _context.ConfiguracionesSistema.Add(configuracion);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(ConfiguracionSistema configuracion)
    {
        _context.ConfiguracionesSistema.Update(configuracion);
        await _context.SaveChangesAsync();
    }
}