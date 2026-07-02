using System.Security.Claims;
using NominaPro.Application.Interfaces;

namespace NominaPro.API.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid EmpresaId
    {
        get
        {
            var value = _httpContextAccessor.HttpContext?.User.FindFirst("empresaId")?.Value;

            if (string.IsNullOrWhiteSpace(value))
                throw new UnauthorizedAccessException("No se encontró empresaId en el token.");

            return Guid.Parse(value);
        }
    }

    public Guid UsuarioId
    {
        get
        {
            var value = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(value))
                throw new UnauthorizedAccessException("No se encontró usuarioId en el token.");

            return Guid.Parse(value);
        }
    }

    public string Email =>
        _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty;

    public string Rol =>
        _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
}