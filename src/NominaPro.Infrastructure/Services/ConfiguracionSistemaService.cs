using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Infrastructure.Services;

public class ConfiguracionSistemaService : IConfiguracionSistemaService
{
    private readonly IConfiguracionSistemaRepository _repository;
    private readonly ICurrentUserService _currentUser;
    private readonly IAuditoriaService _auditoriaService;

    public ConfiguracionSistemaService(
        IConfiguracionSistemaRepository repository,
        ICurrentUserService currentUser,
        IAuditoriaService auditoriaService)
    {
        _repository = repository;
        _currentUser = currentUser;
        _auditoriaService = auditoriaService;
    }

    public async Task<ConfiguracionSistemaDto> GetAsync()
    {
        var configuracion =
            await _repository.GetByEmpresaAsync(_currentUser.EmpresaId);

        if (configuracion is null)
        {
            configuracion = new ConfiguracionSistema
            {
                EmpresaId = _currentUser.EmpresaId
            };

            await _repository.CreateAsync(configuracion);
        }

        return Mapear(configuracion);
    }

    public async Task<ConfiguracionSistemaDto> UpdateAsync(
        ConfiguracionSistemaDto dto)
    {
        var configuracion =
            await _repository.GetByEmpresaAsync(_currentUser.EmpresaId);

        if (configuracion is null)
        {
            configuracion = new ConfiguracionSistema
            {
                EmpresaId = _currentUser.EmpresaId,
                Idioma = dto.Idioma,
                ZonaHoraria = dto.ZonaHoraria,
                FormatoFecha = dto.FormatoFecha,
                Moneda = dto.Moneda
            };

            await _repository.CreateAsync(configuracion);
        }
        else
        {
            configuracion.Idioma = dto.Idioma;
            configuracion.ZonaHoraria = dto.ZonaHoraria;
            configuracion.FormatoFecha = dto.FormatoFecha;
            configuracion.Moneda = dto.Moneda;

            await _repository.UpdateAsync(configuracion);
        }

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email,
            "Configuración",
            "Editar",
            "Actualizó la configuración general del sistema"
        );

        return Mapear(configuracion);
    }

    private static ConfiguracionSistemaDto Mapear(
        ConfiguracionSistema configuracion)
    {
        return new ConfiguracionSistemaDto
        {
            Idioma = configuracion.Idioma,
            ZonaHoraria = configuracion.ZonaHoraria,
            FormatoFecha = configuracion.FormatoFecha,
            Moneda = configuracion.Moneda
        };
    }
}