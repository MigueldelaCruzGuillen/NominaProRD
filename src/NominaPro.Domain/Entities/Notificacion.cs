using NominaPro.Domain.Common;

namespace NominaPro.Domain.Entities;

public class Notificacion : BaseEntity
{
    public string Titulo { get; set; } = string.Empty;

    public string Mensaje { get; set; } = string.Empty;

    // Info, Success, Warning, Error
    public string Tipo { get; set; } = "Info";

    public bool Leida { get; set; }

    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    public Guid EmpresaId { get; set; }
    public Empresa Empresa { get; set; } = null!;

    public Guid? UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
}