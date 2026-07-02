using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class EmpleadoService : IEmpleadoService
{
    private readonly IEmpleadoRepository _repository;

    public EmpleadoService(IEmpleadoRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<EmpleadoDto>> GetAllAsync()
    {
        var empleados = await _repository.GetAllAsync();

        return empleados.Select(e => new EmpleadoDto
        {
            Id = e.Id,
            Nombre = e.Nombre,
            Apellido = e.Apellido,
            Cedula = e.Cedula,
            Telefono = e.Telefono,
            Correo = e.Correo,
            FechaIngreso = e.FechaIngreso,
            SalarioBase = e.SalarioBase,
            Estado = e.Estado,
            TipoContrato = e.TipoContrato,
            EmpresaId = e.EmpresaId,
            DepartamentoId = e.DepartamentoId,
            PuestoId = e.PuestoId
        }).ToList();
    }

    public async Task<EmpleadoDto?> GetByIdAsync(Guid id)
    {
        var e = await _repository.GetByIdAsync(id);

        if (e is null)
            return null;

        return new EmpleadoDto
        {
            Id = e.Id,
            Nombre = e.Nombre,
            Apellido = e.Apellido,
            Cedula = e.Cedula,
            Telefono = e.Telefono,
            Correo = e.Correo,
            FechaIngreso = e.FechaIngreso,
            SalarioBase = e.SalarioBase,
            Estado = e.Estado,
            TipoContrato = e.TipoContrato,
            EmpresaId = e.EmpresaId,
            DepartamentoId = e.DepartamentoId,
            PuestoId = e.PuestoId
        };
    }

    public async Task<EmpleadoDto> CreateAsync(CreateEmpleadoDto dto)
    {
        var empleado = new Empleado
        {
            Nombre = dto.Nombre,
            Apellido = dto.Apellido,
            Cedula = dto.Cedula,
            FechaNacimiento = dto.FechaNacimiento,
            Telefono = dto.Telefono,
            Correo = dto.Correo,
            Direccion = dto.Direccion,
            FechaIngreso = dto.FechaIngreso,
            SalarioBase = dto.SalarioBase,
            TipoContrato = dto.TipoContrato,
            EmpresaId = dto.EmpresaId,
            DepartamentoId = dto.DepartamentoId,
            PuestoId = dto.PuestoId
        };

        await _repository.CreateAsync(empleado);

        return new EmpleadoDto
        {
            Id = empleado.Id,
            Nombre = empleado.Nombre,
            Apellido = empleado.Apellido,
            Cedula = empleado.Cedula,
            Telefono = empleado.Telefono,
            Correo = empleado.Correo,
            FechaIngreso = empleado.FechaIngreso,
            SalarioBase = empleado.SalarioBase,
            Estado = empleado.Estado,
            TipoContrato = empleado.TipoContrato,
            EmpresaId = empleado.EmpresaId,
            DepartamentoId = empleado.DepartamentoId,
            PuestoId = empleado.PuestoId
        };
    }
}