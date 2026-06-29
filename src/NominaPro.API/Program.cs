using Microsoft.EntityFrameworkCore;
using NominaPro.Infrastructure.Data;
using NominaPro.Application.Interfaces;
using NominaPro.Application.Services;
using NominaPro.Infrastructure.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using NominaPro.Application.Validators;
using NominaPro.Application.Mappings;
using NominaPro.Infrastructure.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using NominaPro.API.Services;
using MediatR;
using NominaPro.API.Middleware;
using NominaPro.Domain.Entities; // Asegurar que exista

var builder = WebApplication.CreateBuilder(args);

// ============ CONFIGURACIÓN DE SERVICIOS ============

// 1. Base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.")));

// 2. MediatR - CORREGIDO: Usar ensamblado correcto
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(NominaService).Assembly)); // O usar Assembly.GetExecutingAssembly()

// Alternativa más segura para MediatR:
// builder.Services.AddMediatR(cfg =>
//     cfg.RegisterServicesFromAssemblyContaining<Program>());

// 3. Servicios de infraestructura
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// 4. OpenAPI
builder.Services.AddOpenApi();

// 5. Autenticación JWT - MEJORADA
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["Jwt:Key"]
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

        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync("{\"error\":\"No autorizado\"}");
            }
        };
    });

// 6. AutoMapper
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
});

// 7. Repositorios y Servicios - CORREGIDO: Orden y dependencias
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Repositorios
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IEmpresaRepository, EmpresaRepository>();
builder.Services.AddScoped<IDepartamentoRepository, DepartamentoRepository>();
builder.Services.AddScoped<IPuestoRepository, PuestoRepository>();
builder.Services.AddScoped<IEmpleadoRepository, EmpleadoRepository>();

// Servicios
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmpresaService, EmpresaService>();
builder.Services.AddScoped<IDepartamentoService, DepartamentoService>();
builder.Services.AddScoped<IPuestoService, PuestoService>();
builder.Services.AddScoped<IEmpleadoService, EmpleadoService>();
builder.Services.AddScoped<INominaCalculatorService, NominaCalculatorService>();
builder.Services.AddScoped<INominaService, NominaService>();

// 8. Controladores
builder.Services.AddControllers();

// 9. FluentValidation - CORREGIDO
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateEmpresaDtoValidator>();
// También agregar validadores adicionales si existen
builder.Services.AddValidatorsFromAssembly(typeof(CreateEmpresaDtoValidator).Assembly);

// 10. Configuración adicional - Recomendado
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// 11. Configurar Swagger/OpenAPI para autenticación
builder.Services.AddEndpointsApiExplorer();
// Si usas Swagger, agregar:
// builder.Services.AddSwaggerGen(c =>
// {
//     c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//     {
//         In = ParameterLocation.Header,
//         Description = "Please enter JWT with Bearer",
//         Name = "Authorization",
//         Type = SecuritySchemeType.ApiKey,
//         Scheme = "Bearer"
//     });
// });

// ============ CONFIGURACIÓN DE LA APLICACIÓN ============
var app = builder.Build();

// Middleware - CORREGIDO: Orden correcto
app.UseHttpsRedirection();

// CORS - Recomendado
app.UseCors("AllowAll");

app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// OpenAPI - Solo en desarrollo o siempre si se necesita
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // Si usas Swagger UI:
    // app.UseSwagger();
    // app.UseSwaggerUI();
}
else
{
    // En producción, podrías querer redirigir a HTTPS
    app.UseHsts();
}

// Mapeo de controladores
app.MapControllers();

// Ejecutar migraciones automáticamente (opcional)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // dbContext.Database.Migrate(); // Descomentar para migraciones automáticas
}

app.Run();