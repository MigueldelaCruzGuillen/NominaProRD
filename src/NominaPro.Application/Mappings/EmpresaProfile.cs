using AutoMapper;
using NominaPro.Application.DTOs;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Mappings;

public class EmpresaProfile : Profile
{
    public EmpresaProfile()
    {
        CreateMap<Empresa, EmpresaDto>();

        CreateMap<CreateEmpresaDto, Empresa>();
    }
}