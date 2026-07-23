using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Infrastructure.Services;

public class ConfiguracionNominaService : IConfiguracionNominaService
{
    private readonly IConfiguracionNominaRepository _repository;
    private readonly ICurrentUserService _currentUser;
    private readonly IAuditoriaService _auditoriaService;

    public ConfiguracionNominaService(
        IConfiguracionNominaRepository repository,
        ICurrentUserService currentUser,
        IAuditoriaService auditoriaService)
    {
        _repository = repository;
        _currentUser = currentUser;
        _auditoriaService = auditoriaService;
    }

    public async Task<ConfiguracionNominaDto> GetAsync()
    {
        var configuracion =
            await _repository.GetByEmpresaAsync(_currentUser.EmpresaId);

        if (configuracion is null)
        {
            configuracion = new ConfiguracionNomina
            {
                EmpresaId = _currentUser.EmpresaId
            };

            await _repository.CreateAsync(configuracion);
        }

        return Mapear(configuracion);
    }

    public async Task<ConfiguracionNominaDto> UpdateAsync(
        ConfiguracionNominaDto dto)
    {
        var configuracion =
            await _repository.GetByEmpresaAsync(_currentUser.EmpresaId);

        if (configuracion is null)
        {
            configuracion = new ConfiguracionNomina
            {
                EmpresaId = _currentUser.EmpresaId
            };
        }

        configuracion.PorcentajeAfp = dto.PorcentajeAfp;
        configuracion.PorcentajeSfs = dto.PorcentajeSfs;
        configuracion.AplicarIsr = dto.AplicarIsr;
        configuracion.DiaPago = dto.DiaPago;
        configuracion.Decimales = dto.Decimales;

        if (configuracion.Id == Guid.Empty)
            await _repository.CreateAsync(configuracion);
        else
            await _repository.UpdateAsync(configuracion);

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Configuración",
            "Editar",
            "Actualizó la configuración de nómina"
        );

        return Mapear(configuracion);
    }

    private static ConfiguracionNominaDto Mapear(
        ConfiguracionNomina configuracion)
    {
        return new ConfiguracionNominaDto
        {
            PorcentajeAfp = configuracion.PorcentajeAfp,
            PorcentajeSfs = configuracion.PorcentajeSfs,
            AplicarIsr = configuracion.AplicarIsr,
            DiaPago = configuracion.DiaPago,
            Decimales = configuracion.Decimales
        };
    }
}