using MediatR;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.Application.Features.Departamentos.Commands;

public class UpdateDepartamentoCommandHandler
    : IRequestHandler<UpdateDepartamentoCommand, DepartamentoDto?>
{
    private readonly IDepartamentoRepository _repository;
    private readonly ICurrentUserService _currentUser;

    public UpdateDepartamentoCommandHandler(
        IDepartamentoRepository repository,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<DepartamentoDto?> Handle(
        UpdateDepartamentoCommand request,
        CancellationToken cancellationToken)
    {
        var departamento = await _repository.GetByIdAsync(request.Id);

        if (departamento is null)
            return null;

        var nombre = request.Nombre.Trim();

        if (string.IsNullOrWhiteSpace(nombre))
            throw new InvalidOperationException(
                "El nombre del departamento es obligatorio."
            );

        var duplicado = await _repository.ExistsByNombreAsync(
            nombre,
            _currentUser.EmpresaId,
            request.Id
        );

        if (duplicado)
            throw new InvalidOperationException(
                "Ya existe otro departamento con ese nombre."
            );

        departamento.Nombre = nombre;
        departamento.Descripcion = request.Descripcion?.Trim() ?? string.Empty;

        if (!request.Activo && departamento.Empleados.Any(e => e.Activo))
        {
            throw new InvalidOperationException(
                "No se puede desactivar un departamento que tiene empleados activos."
            );
        }

        departamento.Activo = request.Activo;

        await _repository.UpdateAsync(departamento);

        return new DepartamentoDto
        {
            Id = departamento.Id,
            Nombre = departamento.Nombre,
            Descripcion = departamento.Descripcion,
            EmpresaId = departamento.EmpresaId,
            Activo = departamento.Activo,
            TotalEmpleados = departamento.Empleados.Count(e => e.Activo)
        };
    }
}
