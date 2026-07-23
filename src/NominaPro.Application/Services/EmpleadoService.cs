using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class EmpleadoService : IEmpleadoService
{
    private readonly IEmpleadoRepository _repository;
    private readonly IAuditoriaService _auditoriaService;
    private readonly ICurrentUserService _currentUser;

    public EmpleadoService(
        IEmpleadoRepository repository,
        IAuditoriaService auditoriaService,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _auditoriaService = auditoriaService;
        _currentUser = currentUser;
    }

    public async Task<Empleado?> GetEntityByIdForUpdateAsync(Guid id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task DeleteAsync(Empleado empleado)
    {
        empleado.Activo = false;
        empleado.Estado = "Inactivo";

        await _repository.UpdateAsync(empleado);

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Empleados",
            "Desactivar",
            $"Desactivó el empleado {empleado.Nombre} {empleado.Apellido}"
        );
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
            FechaNacimiento = e.FechaNacimiento,
            Direccion = e.Direccion,
            FechaIngreso = e.FechaIngreso,
            SalarioBase = e.SalarioBase,
            Estado = e.Estado,
            TipoContrato = e.TipoContrato,
            EmpresaId = e.EmpresaId,
            EmpresaNombre = e.Empresa?.Nombre ?? string.Empty,
            DepartamentoId = e.DepartamentoId,
            DepartamentoNombre = e.Departamento?.Nombre ?? string.Empty,
            PuestoId = e.PuestoId,
            PuestoNombre = e.Puesto?.Nombre ?? string.Empty
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
            FechaNacimiento = e.FechaNacimiento,
            Direccion = e.Direccion,
            FechaIngreso = e.FechaIngreso,
            SalarioBase = e.SalarioBase,
            Estado = e.Estado,
            TipoContrato = e.TipoContrato,
            EmpresaId = e.EmpresaId,
            EmpresaNombre = e.Empresa?.Nombre ?? string.Empty,
            DepartamentoId = e.DepartamentoId,
            DepartamentoNombre = e.Departamento?.Nombre ?? string.Empty,
            PuestoId = e.PuestoId,
            PuestoNombre = e.Puesto?.Nombre ?? string.Empty
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
            PuestoId = dto.PuestoId,
            Estado = "Activo",
            Activo = true
        };

        await _repository.CreateAsync(empleado);

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Empleados",
            "Crear",
            $"Se creó el empleado {empleado.Nombre} {empleado.Apellido}"
        );

        // Cargar las relaciones para el DTO
        var empleadoConRelaciones = await _repository.GetByIdAsync(empleado.Id);

        return new EmpleadoDto
        {
            Id = empleado.Id,
            Nombre = empleado.Nombre,
            Apellido = empleado.Apellido,
            Cedula = empleado.Cedula,
            Telefono = empleado.Telefono,
            Correo = empleado.Correo,
            FechaNacimiento = empleado.FechaNacimiento,
            Direccion = empleado.Direccion,
            FechaIngreso = empleado.FechaIngreso,
            SalarioBase = empleado.SalarioBase,
            Estado = empleado.Estado,
            TipoContrato = empleado.TipoContrato,
            EmpresaId = empleado.EmpresaId,
            EmpresaNombre = empleadoConRelaciones?.Empresa?.Nombre ?? string.Empty,
            DepartamentoId = empleado.DepartamentoId,
            DepartamentoNombre = empleadoConRelaciones?.Departamento?.Nombre ?? string.Empty,
            PuestoId = empleado.PuestoId,
            PuestoNombre = empleadoConRelaciones?.Puesto?.Nombre ?? string.Empty
        };
    }

    public async Task<EmpleadoDto?> UpdateAsync(Guid id, CreateEmpleadoDto dto)
    {
        var empleado = await _repository.GetByIdAsync(id);

        if (empleado is null)
            return null;

        empleado.Nombre = dto.Nombre;
        empleado.Apellido = dto.Apellido;
        empleado.Cedula = dto.Cedula;
        empleado.FechaNacimiento = dto.FechaNacimiento;
        empleado.Telefono = dto.Telefono;
        empleado.Correo = dto.Correo;
        empleado.Direccion = dto.Direccion;
        empleado.FechaIngreso = dto.FechaIngreso;
        empleado.SalarioBase = dto.SalarioBase;
        empleado.TipoContrato = dto.TipoContrato;
        empleado.DepartamentoId = dto.DepartamentoId;
        empleado.PuestoId = dto.PuestoId;

        await _repository.UpdateAsync(empleado);

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Empleados",
            "Editar",
            $"Actualizó el empleado {empleado.Nombre} {empleado.Apellido}"
        );

        // Recargar para obtener las relaciones
        var empleadoActualizado = await _repository.GetByIdAsync(id);

        return new EmpleadoDto
        {
            Id = empleado.Id,
            Nombre = empleado.Nombre,
            Apellido = empleado.Apellido,
            Cedula = empleado.Cedula,
            Telefono = empleado.Telefono,
            Correo = empleado.Correo,
            FechaNacimiento = empleado.FechaNacimiento,
            Direccion = empleado.Direccion,
            FechaIngreso = empleado.FechaIngreso,
            SalarioBase = empleado.SalarioBase,
            Estado = empleado.Estado,
            TipoContrato = empleado.TipoContrato,
            EmpresaId = empleado.EmpresaId,
            EmpresaNombre = empleadoActualizado?.Empresa?.Nombre ?? string.Empty,
            DepartamentoId = empleado.DepartamentoId,
            DepartamentoNombre = empleadoActualizado?.Departamento?.Nombre ?? string.Empty,
            PuestoId = empleado.PuestoId,
            PuestoNombre = empleadoActualizado?.Puesto?.Nombre ?? string.Empty
        };
    }
}