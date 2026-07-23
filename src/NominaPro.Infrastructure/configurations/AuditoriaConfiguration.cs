using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NominaPro.Domain.Entities;

namespace NominaPro.Infrastructure.Configurations;

public class AuditoriaConfiguration : IEntityTypeConfiguration<Auditoria>
{
    public void Configure(EntityTypeBuilder<Auditoria> builder)
    {
        builder.Property(x => x.Usuario)
            .HasMaxLength(150);

        builder.Property(x => x.Modulo)
            .HasMaxLength(80);

        builder.Property(x => x.Accion)
            .HasMaxLength(80);

        builder.Property(x => x.Descripcion)
            .HasMaxLength(500);

        builder.Property(x => x.Ip)
            .HasMaxLength(50);
    }
}