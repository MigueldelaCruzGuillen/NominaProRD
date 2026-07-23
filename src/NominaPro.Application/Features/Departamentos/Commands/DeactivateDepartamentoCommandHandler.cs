using MediatR;
using NominaPro.Application.Interfaces;

namespace NominaPro.Application.Features.Departamentos.Commands;

public class DeactivateDepartamentoCommandHandler
    : IRequestHandler<DeactivateDepartamentoCommand, bool>
{
    private readonly IDepartamentoRepository _repository;

    public DeactivateDepartamentoCommandHandler(
        IDepartamentoRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        DeactivateDepartamentoCommand request,
        CancellationToken cancellationToken)
    {
        var departamento = await _repository.GetByIdAsync(request.Id);

        if (departamento is null)
            return false;

        if (departamento.Empleados.Any(e => e.Activo))
        {
            throw new InvalidOperationException(
                "No se puede desactivar un departamento que tiene empleados activos."
            );
        }

        if (!departamento.Activo)
            return true;

        departamento.Activo = false;

        await _repository.UpdateAsync(departamento);

        return true;
    }
}
