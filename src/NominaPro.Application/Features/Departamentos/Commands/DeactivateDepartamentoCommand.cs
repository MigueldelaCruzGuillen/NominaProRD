using MediatR;

namespace NominaPro.Application.Features.Departamentos.Commands;

public class DeactivateDepartamentoCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}