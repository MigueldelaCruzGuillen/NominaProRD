using MediatR;
using NominaPro.Application.Interfaces;

namespace NominaPro.Application.Features.Departamentos.Commands;

public class ReactivateDepartamentoCommandHandler
    : IRequestHandler<ReactivateDepartamentoCommand, bool>
{
    private readonly IDepartamentoRepository _repository;

    public ReactivateDepartamentoCommandHandler(
        IDepartamentoRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        ReactivateDepartamentoCommand request,
        CancellationToken cancellationToken)
    {
        var departamento = await _repository.GetByIdAsync(request.Id);

        if (departamento is null)
            return false;

        if (departamento.Activo)
            return true;

        departamento.Activo = true;

        await _repository.UpdateAsync(departamento);

        return true;
    }
}