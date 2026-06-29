using MediatR;
using NominaPro.Application.DTOs;

namespace NominaPro.Application.Features.Departamentos.Queries;

public record GetDepartamentoByIdQuery(Guid Id) : IRequest<DepartamentoDto?>;