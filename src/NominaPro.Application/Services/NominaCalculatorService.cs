using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class NominaCalculatorService : INominaCalculatorService
{
    private const decimal PorcentajeAfp = 0.0287m;
    private const decimal PorcentajeSfs = 0.0304m;

    public NominaDetalle CalcularDetalle(Empleado empleado, decimal horasExtras)
    {
        var salarioBase = empleado.SalarioBase;

        var valorHora = salarioBase / 23.83m / 8;
        var montoHorasExtras = valorHora * horasExtras * 1.35m;

        var totalIngresos = salarioBase + montoHorasExtras;

        var afp = totalIngresos * PorcentajeAfp;
        var sfs = totalIngresos * PorcentajeSfs;
        var isr = CalcularIsr(totalIngresos);

        var totalDeducciones = afp + sfs + isr;
        var netoPagar = totalIngresos - totalDeducciones;

        return new NominaDetalle
        {
            HorasExtras = Math.Round(montoHorasExtras, 2),
            EmpleadoId = empleado.Id,
            SalarioBase = salarioBase,
            Afp = Math.Round(afp, 2),
            Sfs = Math.Round(sfs, 2),
            Isr = Math.Round(isr, 2),
            TotalIngresos = Math.Round(totalIngresos, 2),
            TotalDeducciones = Math.Round(totalDeducciones, 2),
            NetoPagar = Math.Round(netoPagar, 2)
        };
    }

    private decimal CalcularIsr(decimal salarioMensual)
    {
        var salarioAnual = salarioMensual * 12;

        if (salarioAnual <= 416220.00m)
            return 0;

        if (salarioAnual <= 624329.00m)
            return ((salarioAnual - 416220.01m) * 0.15m) / 12;

        if (salarioAnual <= 867123.00m)
            return (31216.00m + ((salarioAnual - 624329.01m) * 0.20m)) / 12;

        return (79776.00m + ((salarioAnual - 867123.01m) * 0.25m)) / 12;
    }
}