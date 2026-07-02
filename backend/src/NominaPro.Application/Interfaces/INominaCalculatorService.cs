using NominaPro.Domain.Entities;

namespace NominaPro.Application.Interfaces;

public interface INominaCalculatorService
{
    NominaDetalle CalcularDetalle(Empleado empleado, decimal horasExtras);
}