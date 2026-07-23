using MediatR;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.Application.Features.Departamentos.Queries;

public class GetDepartamentosQueryHandler
    : IRequestHandler<GetDepartamentosQuery, List<DepartamentoDto>>
{
    private readonly IDepartamentoRepository _repository;
    private readonly ICurrentUserService _currentUser;

    public GetDepartamentosQueryHandler(
        IDepartamentoRepository repository,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _currentUser = currentUser;
    }

    public async Task<List<DepartamentoDto>> Handle(
        GetDepartamentosQuery request,
        CancellationToken cancellationToken)
    {
        var departamentos = await _repository.GetAllAsync();

        return departamentos
            .Where(d => d.EmpresaId == _currentUser.EmpresaId)
            .Select(d => new DepartamentoDto
            {
                Id = d.Id,
                Nombre = d.Nombre,
                Descripcion = d.Descripcion,
                EmpresaId = d.EmpresaId,
                Activo = d.Activo,
                TotalEmpleados = d.Empleados.Count(e => e.Activo)
            })
            .ToList();
    }
}
