using MediatR;
using NominaPro.Application.DTOs;

namespace NominaPro.Application.Features.Departamentos.Queries;

public class GetDepartamentosQuery : IRequest<List<DepartamentoDto>>
{
}