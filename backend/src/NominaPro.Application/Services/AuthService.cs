using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class AuthService : IAuthService
{
    private readonly IEmpresaRepository _empresaRepository;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly ITokenService _tokenService;

    public AuthService(
        IEmpresaRepository empresaRepository,
        IUsuarioRepository usuarioRepository,
        ITokenService tokenService)
    {
        _empresaRepository = empresaRepository;
        _usuarioRepository = usuarioRepository;
        _tokenService = tokenService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var empresa = new Empresa
        {
            Nombre = dto.EmpresaNombre,
            Rnc = dto.Rnc,
            Direccion = "",
            Telefono = "",
            Correo = dto.Email
        };

        await _empresaRepository.CreateAsync(empresa);

        var usuario = new Usuario
        {
            Nombre = dto.NombreUsuario,
            Email = dto.Email,
            PasswordHash = global::BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Rol = "Admin",
            EmpresaId = empresa.Id
        };

        await _usuarioRepository.CreateAsync(usuario);

        var token = _tokenService.CreateToken(usuario);

        return new AuthResponseDto
        {
            Token = token,
            Email = usuario.Email,
            Rol = usuario.Rol,
            EmpresaId = usuario.EmpresaId
        };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var usuario = await _usuarioRepository.GetByEmailAsync(dto.Email);

        if (usuario is null)
            return null;

        var passwordValida = global::BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash);

        if (!passwordValida)
            return null;

        var token = _tokenService.CreateToken(usuario);

        return new AuthResponseDto
        {
            Token = token,
            Email = usuario.Email,
            Rol = usuario.Rol,
            EmpresaId = usuario.EmpresaId
        };
    }
}