using MediatR;

namespace NominaPro.Application.Features.Departamentos.Commands;

public class ReactivateDepartamentoCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}