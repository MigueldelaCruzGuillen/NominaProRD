using AutoMapper;
using MediatR;
using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;

namespace NominaPro.Application.Features.Departamentos.Queries;

public class GetDepartamentoByIdQueryHandler
    : IRequestHandler<GetDepartamentoByIdQuery, DepartamentoDto?>
{
    private readonly IDepartamentoRepository _repository;
    private readonly ICurrentUserService _currentUser;
    private readonly IMapper _mapper;

    public GetDepartamentoByIdQueryHandler(
        IDepartamentoRepository repository,
        ICurrentUserService currentUser,
        IMapper mapper)
    {
        _repository = repository;
        _currentUser = currentUser;
        _mapper = mapper;
    }

    public async Task<DepartamentoDto?> Handle(
        GetDepartamentoByIdQuery request,
        CancellationToken cancellationToken)
    {
        var departamento = await _repository.GetByIdAsync(request.Id);

        if (departamento == null)
            return null;

        if (departamento.EmpresaId != _currentUser.EmpresaId)
            return null;

        return _mapper.Map<DepartamentoDto>(departamento);
    }
}