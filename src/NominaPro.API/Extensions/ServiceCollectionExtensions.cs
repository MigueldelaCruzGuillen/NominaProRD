using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NominaPro.API.Services;
using NominaPro.Application.Interfaces;
using NominaPro.Application.Mappings;
using NominaPro.Application.Services;
using NominaPro.Application.Validators;
using NominaPro.Infrastructure.Data;
using NominaPro.Infrastructure.Repositories;
using NominaPro.Infrastructure.Services;


namespace NominaPro.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddNominaProServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
        
        services.AddScoped<INominaRepository, NominaRepository>();
        services.AddScoped<PdfService>();

        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(NominaService).Assembly));

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        services.AddOpenApi();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                var key = configuration["Jwt:Key"]
                    ?? throw new InvalidOperationException("JWT Key not configured.");

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(key)),
                    ClockSkew = TimeSpan.Zero
                };
            });

        services.AddAutoMapper(cfg =>
        {
            cfg.AddProfile<MappingProfile>();
        });

        services.AddControllers();

        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<CreateEmpresaDtoValidator>();

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IEmpresaRepository, EmpresaRepository>();
        services.AddScoped<IDepartamentoRepository, DepartamentoRepository>();
        services.AddScoped<IPuestoRepository, PuestoRepository>();
        services.AddScoped<IEmpleadoRepository, EmpleadoRepository>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IEmpresaService, EmpresaService>();
        services.AddScoped<IDepartamentoService, DepartamentoService>();
        services.AddScoped<IPuestoService, PuestoService>();
        services.AddScoped<IEmpleadoService, EmpleadoService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<INominaCalculatorService, NominaCalculatorService>();
        services.AddScoped<INominaService, NominaService>();

        return services;
    }
}