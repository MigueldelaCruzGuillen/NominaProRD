using Microsoft.EntityFrameworkCore;
using NominaPro.Domain.Entities;

namespace NominaPro.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Empresa> Empresas => Set<Empresa>();
}