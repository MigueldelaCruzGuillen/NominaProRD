using NominaPro.Application.DTOs;
using NominaPro.Application.Interfaces;
using NominaPro.Domain.Entities;

namespace NominaPro.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _repository;
    private readonly IAuditoriaService _auditoriaService;
    private readonly ICurrentUserService _currentUser;

    public UsuarioService(
        IUsuarioRepository repository,
        IAuditoriaService auditoriaService,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _auditoriaService = auditoriaService;
        _currentUser = currentUser;
    }

    public async Task<List<UsuarioDto>> GetAllAsync()
    {
        var usuarios = await _repository.GetAllAsync();

        return usuarios.Select(u => new UsuarioDto
        {
            Id = u.Id,
            Nombre = u.Nombre,
            Email = u.Email,
            Rol = u.Rol,
            EmpresaId = u.EmpresaId,
            Activo = u.Activo
        }).ToList();
    }

    public async Task<UsuarioDto?> GetByIdAsync(Guid id)
    {
        var u = await _repository.GetByIdAsync(id);

        if (u is null) return null;

        return new UsuarioDto
        {
            Id = u.Id,
            Nombre = u.Nombre,
            Email = u.Email,
            Rol = u.Rol,
            EmpresaId = u.EmpresaId,
            Activo = u.Activo
        };
    }

    public async Task<UsuarioDto> CreateAsync(CreateUsuarioDto dto)
    {
        // Validar que no exista un usuario con el mismo email
        var existente = await _repository.GetByEmailAsync(dto.Email);

        if (existente is not null)
        {
            throw new InvalidOperationException(
                "Ya existe un usuario con ese correo."
            );
        }

        var usuario = new Usuario
        {
            Nombre = dto.Nombre,
            Email = dto.Email,
            Rol = dto.Rol,
            EmpresaId = dto.EmpresaId,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Activo = true
        };

        await _repository.CreateAsync(usuario);

        // Registrar auditoría
        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email ?? "Sistema",
            "Usuarios",
            "Crear",
            $"Creó el usuario {usuario.Email} con rol {usuario.Rol}"
        );

        return new UsuarioDto
        {
            Id = usuario.Id,
            Nombre = usuario.Nombre,
            Email = usuario.Email,
            Rol = usuario.Rol,
            EmpresaId = usuario.EmpresaId,
            Activo = usuario.Activo
        };
    }

    public async Task<UsuarioDto?> UpdateAsync(Guid id, UpdateUsuarioDto dto)
    {
        var usuario = await _repository.GetByIdAsync(id);

        if (usuario is null) return null;

        // Validar que no exista otro usuario con el mismo email
        var existente = await _repository.GetByEmailAsync(dto.Email);

        if (existente is not null && existente.Id != id)
        {
            throw new InvalidOperationException(
                "Ya existe otro usuario con ese correo."
            );
        }

        // Guardar el estado anterior antes de modificar
        var estabaActivo = usuario.Activo;
        var emailAnterior = usuario.Email;
        var rolAnterior = usuario.Rol;

        usuario.Nombre = dto.Nombre;
        usuario.Email = dto.Email;
        usuario.Rol = dto.Rol;
        usuario.Activo = dto.Activo;

        await _repository.UpdateAsync(usuario);

        // Registrar auditoría según el cambio
        if (!estabaActivo && usuario.Activo)
        {
            await _auditoriaService.RegistrarAsync(
                _currentUser.UsuarioId,
                _currentUser.Email ?? "Sistema",
                "Usuarios",
                "Reactivar",
                $"Reactivó el usuario {usuario.Email}"
            );
        }
        else
        {
            await _auditoriaService.RegistrarAsync(
                _currentUser.UsuarioId,
                _currentUser.Email ?? "Sistema",
                "Usuarios",
                "Editar",
                $"Actualizó el usuario {usuario.Email}. Rol anterior: {rolAnterior}, Rol nuevo: {usuario.Rol}"
            );
        }

        return new UsuarioDto
        {
            Id = usuario.Id,
            Nombre = usuario.Nombre,
            Email = usuario.Email,
            Rol = usuario.Rol,
            EmpresaId = usuario.EmpresaId,
            Activo = usuario.Activo
        };
    } 

    public async Task<bool> CambiarPasswordAsync(
        Guid id,
        CambiarPasswordUsuarioDto dto)
    {
        var usuario = await _repository.GetByIdAsync(id);

        if (usuario is null)
            return false;

        // Validar que el usuario no intente cambiar su propia contraseña
        if (id == _currentUser.UsuarioId)
        {
            throw new InvalidOperationException(
                "No puedes cambiar tu propia contraseña desde la administración de usuarios."
            );
        }

        if (dto.NuevaPassword.Length < 6)
            throw new InvalidOperationException(
                "La contraseña debe tener al menos 6 caracteres."
            );

        usuario.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(dto.NuevaPassword);

        await _repository.UpdateAsync(usuario);

        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email ?? "Sistema",
            "Usuarios",
            "Cambiar contraseña",
            $"Cambió la contraseña del usuario {usuario.Email}"
        );

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        // Validar que el usuario no intente desactivarse a sí mismo
        if (id == _currentUser.UsuarioId)
        {
            throw new InvalidOperationException(
                "No puedes desactivar tu propio usuario."
            );
        }

        var usuario = await _repository.GetByIdAsync(id);

        if (usuario is null) return false;

        usuario.Activo = false;
        await _repository.UpdateAsync(usuario);

        // Registrar auditoría
        await _auditoriaService.RegistrarAsync(
            _currentUser.UsuarioId,
            _currentUser.Email ?? "Sistema",
            "Usuarios",
            "Desactivar",
            $"Desactivó el usuario {usuario.Email}"
        );

        return true;
    }

    public async Task CambiarMiPasswordAsync(CambiarMiPasswordDto dto)
{
    var usuario = await _repository.GetByIdAsync(_currentUser.UsuarioId);

    if (usuario is null)
        throw new InvalidOperationException("Usuario no encontrado.");

    if (!BCrypt.Net.BCrypt.Verify(dto.PasswordActual, usuario.PasswordHash))
        throw new InvalidOperationException("La contraseña actual es incorrecta.");

    if (dto.NuevaPassword.Length < 6)
        throw new InvalidOperationException(
            "La nueva contraseña debe tener al menos 6 caracteres."
        );

    usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NuevaPassword);

    await _repository.UpdateAsync(usuario);

    await _auditoriaService.RegistrarAsync(
        _currentUser.UsuarioId,
        _currentUser.Email,
        "Usuarios",
        "Cambiar mi contraseña",
        "Cambió su propia contraseña"
    );
}
public async Task<UsuarioDto> ActualizarMiPerfilAsync(
    ActualizarMiPerfilDto dto)
{
    var usuario = await _repository.GetByIdAsync(_currentUser.UsuarioId);

    if (usuario is null)
        throw new InvalidOperationException("Usuario no encontrado.");

    if (string.IsNullOrWhiteSpace(dto.Nombre))
        throw new InvalidOperationException("El nombre es obligatorio.");

    usuario.Nombre = dto.Nombre.Trim();

    await _repository.UpdateAsync(usuario);

    await _auditoriaService.RegistrarAsync(
        _currentUser.UsuarioId,
        _currentUser.Email,
        "Usuarios",
        "Editar perfil",
        "Actualizó su perfil"
    );

    return new UsuarioDto
    {
        Id = usuario.Id,
        Nombre = usuario.Nombre,
        Email = usuario.Email,
        Rol = usuario.Rol,
        EmpresaId = usuario.EmpresaId,
        Activo = usuario.Activo
    };
}
}