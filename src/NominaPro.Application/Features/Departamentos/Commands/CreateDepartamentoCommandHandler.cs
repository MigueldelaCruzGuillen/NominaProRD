using MediatR;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Features.Departamentos.Commands;

public class CreateDepartamentoCommandHandler 
    : IRequestHandler<CreateDepartamentoCommand, DepartamentoDto>
{
    private readonly IDepartamentoRepository _repository;
    private readonly ICurrentUserService _currentUser;

    public CreateDepartamentoCommandHandler(
        IDepartamentoRepository repository,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<DepartamentoDto> Handle(
        CreateDepartamentoCommand request,
        CancellationToken cancellationToken)
    {
        var existe = await _repository.ExistsByNombreAsync(request.Nombre, _currentUser.EmpresaId);

       if (existe)
       throw new InvalidOperationException("Ya existe un departamento con ese nombre.");
        var departamento = new Departamento
        {
            Nombre = request.Nombre,
            Descripcion = request.Descripcion,
            EmpresaId = _currentUser.EmpresaId
        };

        await _repository.CreateAsync(departamento);

        return new DepartamentoDto
        {
            Id = departamento.Id,
            Nombre = departamento.Nombre,
            Descripcion = departamento.Descripcion,
            EmpresaId = departamento.EmpresaId
        };
    }
}