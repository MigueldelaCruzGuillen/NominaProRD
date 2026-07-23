using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface INominaCalculatorService
{
    Task<NominaDetalle> CalcularDetalleAsync(
        Empleado empleado,
        decimal horasExtras
    );
}