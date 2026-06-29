using AutoMapper;
using NominaPro.Application.DTOs;
using NominaPro.Application.Features.Departamentos.Commands;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Empresa
        CreateMap<Empresa, EmpresaDto>().ReverseMap();

        // Departamento
        CreateMap<Departamento, DepartamentoDto>();
        CreateMap<CreateDepartamentoCommand, Departamento>();

        // Puesto
        CreateMap<Puesto, PuestoDto>();
        CreateMap<CreatePuestoDto, Puesto>();

        // Empleado
        CreateMap<Empleado, EmpleadoDto>();
        CreateMap<CreateEmpleadoDto, Empleado>();
    }
}