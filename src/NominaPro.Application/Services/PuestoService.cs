using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class PuestoService : IPuestoService
{
    private readonly IPuestoRepository _repository;
    private readonly IDepartamentoRepository _departamentoRepository;

    public PuestoService(
        IPuestoRepository repository,
        IDepartamentoRepository departamentoRepository)
    {
        _repository = repository;
        _departamentoRepository = departamentoRepository;
    }

    public async Task<List<PuestoDto>> GetAllAsync()
    {
        var puestos = await _repository.GetAllAsync();

        return puestos.Select(p => new PuestoDto
        {
            Id = p.Id,
            Nombre = p.Nombre,
            Descripcion = p.Descripcion,
            EmpresaId = p.EmpresaId,
            DepartamentoId = p.DepartamentoId,
            DepartamentoNombre = p.Departamento?.Nombre ?? "",
            Activo = p.Activo,
            TotalEmpleados = p.Empleados.Count(e => e.Estado == "Activo")
        }).ToList();
    }

    public async Task<PuestoDto?> GetByIdAsync(Guid id)
    {
        var puesto = await _repository.GetByIdAsync(id);

        if (puesto == null)
            return null;

        return new PuestoDto
        {
            Id = puesto.Id,
            Nombre = puesto.Nombre,
            Descripcion = puesto.Descripcion,
            EmpresaId = puesto.EmpresaId,
            DepartamentoId = puesto.DepartamentoId,
            DepartamentoNombre = puesto.Departamento?.Nombre ?? "",
            Activo = puesto.Activo,
            TotalEmpleados = puesto.Empleados.Count(e => e.Estado == "Activo")
        };
    }

    public async Task<PuestoDto> CreateAsync(CreatePuestoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            throw new ArgumentException("El nombre del puesto es obligatorio.");

        var nombre = dto.Nombre.Trim();
        var descripcion = dto.Descripcion?.Trim() ?? string.Empty;

        var departamento =
            await _departamentoRepository.GetByIdAsync(dto.DepartamentoId);

        if (departamento is null)
            throw new KeyNotFoundException("El departamento no existe.");

        if (departamento.EmpresaId != dto.EmpresaId)
            throw new InvalidOperationException(
                "El departamento no pertenece a la empresa seleccionada.");

        var existe = await _repository.ExistsByNombreAsync(
            nombre,
            dto.EmpresaId);

        if (existe)
            throw new InvalidOperationException(
                "Ya existe un puesto con ese nombre.");

        var puesto = new Puesto
        {
            Nombre = nombre,
            Descripcion = descripcion,
            EmpresaId = dto.EmpresaId,
            DepartamentoId = dto.DepartamentoId,
            Activo = true
        };

        await _repository.CreateAsync(puesto);

        return new PuestoDto
        {
            Id = puesto.Id,
            Nombre = puesto.Nombre,
            Descripcion = puesto.Descripcion,
            EmpresaId = puesto.EmpresaId,
            DepartamentoId = puesto.DepartamentoId,
            DepartamentoNombre = departamento.Nombre,
            Activo = puesto.Activo,
            TotalEmpleados = 0
        };
    }

    public async Task<PuestoDto> UpdateAsync(
        Guid id,
        UpdatePuestoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            throw new ArgumentException(
                "El nombre del puesto es obligatorio.");

        var puesto = await _repository.GetByIdAsync(id);

        if (puesto is null)
            throw new KeyNotFoundException(
                "El puesto no existe.");

        var departamento =
            await _departamentoRepository.GetByIdAsync(
                dto.DepartamentoId);

        if (departamento is null)
            throw new KeyNotFoundException(
                "El departamento no existe.");

        if (!departamento.Activo)
            throw new InvalidOperationException(
                "No se puede asignar el puesto a un departamento inactivo.");

        if (departamento.EmpresaId != puesto.EmpresaId)
            throw new InvalidOperationException(
                "El departamento no pertenece a la empresa del puesto.");

        var nombre = dto.Nombre.Trim();

        var existe = await _repository.ExistsByNombreAsync(
            nombre,
            puesto.EmpresaId,
            puesto.Id);

        if (existe)
            throw new InvalidOperationException(
                "Ya existe otro puesto con ese nombre.");

        puesto.Nombre = nombre;
        puesto.Descripcion =
            dto.Descripcion?.Trim() ?? string.Empty;

        puesto.DepartamentoId = dto.DepartamentoId;

        await _repository.UpdateAsync(puesto);

        return new PuestoDto
        {
            Id = puesto.Id,
            Nombre = puesto.Nombre,
            Descripcion = puesto.Descripcion,
            EmpresaId = puesto.EmpresaId,
            DepartamentoId = puesto.DepartamentoId,
            DepartamentoNombre = departamento.Nombre,
            Activo = puesto.Activo,
            TotalEmpleados = puesto.Empleados.Count(
                empleado => empleado.Estado == "Activo")
        };
    }

    public async Task DeactivateAsync(Guid id)
    {
        var puesto = await _repository.GetByIdAsync(id);

        if (puesto is null)
            throw new KeyNotFoundException(
                "El puesto no existe.");

        if (!puesto.Activo)
            throw new InvalidOperationException(
                "El puesto ya está desactivado.");

        var tieneEmpleadosActivos = puesto.Empleados.Any(
            empleado => empleado.Estado == "Activo");

        if (tieneEmpleadosActivos)
            throw new InvalidOperationException(
                "No se puede desactivar el puesto porque tiene empleados activos.");

        puesto.Activo = false;

        await _repository.UpdateAsync(puesto);
    }

    public async Task ReactivateAsync(Guid id)
    {
        var puesto = await _repository.GetByIdAsync(id);

        if (puesto is null)
            throw new KeyNotFoundException(
                "El puesto no existe.");

        if (puesto.Activo)
            throw new InvalidOperationException(
                "El puesto ya está activo.");

        if (puesto.Departamento is null)
            throw new InvalidOperationException(
                "El puesto no tiene un departamento asignado.");

        if (!puesto.Departamento.Activo)
            throw new InvalidOperationException(
                "No se puede reactivar el puesto porque su departamento está inactivo.");

        puesto.Activo = true;

        await _repository.UpdateAsync(puesto);
    }
}