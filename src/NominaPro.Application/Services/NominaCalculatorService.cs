using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class NominaCalculatorService : INominaCalculatorService
{
    private readonly IConfiguracionNominaRepository _configuracionRepository;
    private readonly ICurrentUserService _currentUser;

    public NominaCalculatorService(
        IConfiguracionNominaRepository configuracionRepository,
        ICurrentUserService currentUser)
    {
        _configuracionRepository = configuracionRepository;
        _currentUser = currentUser;
    }

    public async Task<NominaDetalle> CalcularDetalleAsync(Empleado empleado, decimal horasExtras)
    {
        // Cargar configuración de nómina
        var configuracion = await _configuracionRepository.GetByEmpresaAsync(
            _currentUser.EmpresaId
        );

        var porcentajeAfp = configuracion?.PorcentajeAfp ?? 2.87m;
        var porcentajeSfs = configuracion?.PorcentajeSfs ?? 3.04m;
        var aplicarIsr = configuracion?.AplicarIsr ?? true;
        var decimales = configuracion?.Decimales ?? 2;

        var salarioBase = empleado.SalarioBase;

        var valorHora = salarioBase / 23.83m / 8;
        var montoHorasExtras = valorHora * horasExtras * 1.35m;

        var totalIngresos = salarioBase + montoHorasExtras;

        // Calcular deducciones con porcentajes de configuración
        var afp = totalIngresos * (porcentajeAfp / 100m);
        var sfs = totalIngresos * (porcentajeSfs / 100m);
        var isr = aplicarIsr
            ? CalcularIsr(totalIngresos)
            : 0m;

        // Redondear según configuración
        afp = Math.Round(afp, decimales);
        sfs = Math.Round(sfs, decimales);
        isr = Math.Round(isr, decimales);

        var totalDeducciones = afp + sfs + isr;
        var netoPagar = totalIngresos - totalDeducciones;

        return new NominaDetalle
        {
            HorasExtras = Math.Round(montoHorasExtras, decimales),
            EmpleadoId = empleado.Id,
            SalarioBase = salarioBase,
            Afp = afp,
            Sfs = sfs,
            Isr = isr,
            TotalIngresos = Math.Round(totalIngresos, decimales),
            TotalDeducciones = Math.Round(totalDeducciones, decimales),
            NetoPagar = Math.Round(netoPagar, decimales),
            PorcentajeAfpAplicado = porcentajeAfp,
            PorcentajeSfsAplicado = porcentajeSfs,
            IsrAplicado = aplicarIsr,
            DecimalesAplicados = decimales,
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