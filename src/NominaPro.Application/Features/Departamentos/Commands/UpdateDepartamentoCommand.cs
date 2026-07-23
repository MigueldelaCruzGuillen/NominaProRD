using MediatR;
using NominaPro.Application.DTOs;

namespace NominaPro.Application.Features.Departamentos.Commands;

public class UpdateDepartamentoCommand : IRequest<DepartamentoDto?>
{
    public Guid Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public bool Activo { get; set; } = true;
}