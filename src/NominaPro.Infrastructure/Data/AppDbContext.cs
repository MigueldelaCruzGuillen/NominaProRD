using Microsoft.EntityFrameworkCore;
using NominaPro.Domain.Entities;
using NominaPro.Infrastructure.Configurations;

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
    public DbSet<Puesto> Puestos => Set<Puesto>();
    public DbSet<Empleado> Empleados => Set<Empleado>();
    public DbSet<PeriodoNomina> PeriodosNomina => Set<PeriodoNomina>();
    public DbSet<Nomina> Nominas => Set<Nomina>();
    public DbSet<NominaDetalle> NominaDetalles => Set<NominaDetalle>();
    public DbSet<Asistencia> Asistencias => Set<Asistencia>();
    public DbSet<Auditoria> Auditorias => Set<Auditoria>();
    public DbSet<Notificacion> Notificaciones => Set<Notificacion>();
    public DbSet<ConfiguracionSistema> ConfiguracionesSistema =>
    Set<ConfiguracionSistema>();
    public DbSet<ConfiguracionNomina> ConfiguracionesNomina =>
    Set<ConfiguracionNomina>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new AuditoriaConfiguration());
        base.OnModelCreating(modelBuilder);

        // ✅ Índice único para Asistencia (empleado + fecha)
        modelBuilder.Entity<Asistencia>()
            .HasIndex(a => new
            {
                a.EmpleadoId,
                a.Fecha
            })
            .IsUnique();

        modelBuilder.Entity<Usuario>()
            .HasOne(u => u.Empresa)
            .WithMany(e => e.Usuarios)
            .HasForeignKey(u => u.EmpresaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Departamento>()
            .HasOne(d => d.Empresa)
            .WithMany(e => e.Departamentos)
            .HasForeignKey(d => d.EmpresaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Puesto>()
            .HasOne(p => p.Empresa)
            .WithMany(e => e.Puestos)
            .HasForeignKey(p => p.EmpresaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Empleado>()
            .HasOne(e => e.Empresa)
            .WithMany(e => e.Empleados)
            .HasForeignKey(e => e.EmpresaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Empleado>()
            .HasOne(e => e.Departamento)
            .WithMany(d => d.Empleados)
            .HasForeignKey(e => e.DepartamentoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Empleado>()
            .HasOne(e => e.Puesto)
            .WithMany(p => p.Empleados)
            .HasForeignKey(e => e.PuestoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PeriodoNomina>()
            .HasOne(p => p.Empresa)
            .WithMany(e => e.PeriodosNomina)
            .HasForeignKey(p => p.EmpresaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Nomina>()
            .HasOne(n => n.Empresa)
            .WithMany(e => e.Nominas)
            .HasForeignKey(n => n.EmpresaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Nomina>()
            .HasOne(n => n.PeriodoNomina)
            .WithMany()
            .HasForeignKey(n => n.PeriodoNominaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<NominaDetalle>()
            .HasOne(d => d.Nomina)
            .WithMany(n => n.Detalles)
            .HasForeignKey(d => d.NominaId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NominaDetalle>()
            .HasOne(d => d.Empleado)
            .WithMany(e => e.NominaDetalles)
            .HasForeignKey(d => d.EmpleadoId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Asistencia>()
            .HasOne(a => a.Empleado)
            .WithMany(e => e.Asistencias)
            .HasForeignKey(a => a.EmpleadoId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Puesto>()
            .HasOne(p => p.Departamento)
            .WithMany(d => d.Puestos)
            .HasForeignKey(p => p.DepartamentoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}