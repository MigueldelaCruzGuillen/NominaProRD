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
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Departamento> Departamentos => Set<Departamento>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

         modelBuilder.Entity<Departamento>()
           .HasOne(d => d.Empresa)
           .WithMany(e => e.Departamentos)
           .HasForeignKey(d => d.EmpresaId)
           .OnDelete(DeleteBehavior.Cascade);
    }
}
