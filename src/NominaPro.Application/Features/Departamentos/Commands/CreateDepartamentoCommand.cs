using MediatR;
using NominaPro.Application.DTOs;

namespace NominaPro.Application.Features.Departamentos.Commands;

public class CreateDepartamentoCommand : IRequest<DepartamentoDto>
{
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
}