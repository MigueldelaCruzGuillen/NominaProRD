using NominaPro.API.Extensions;
using NominaPro.API.Middleware;
using NominaPro.Application.Behaviors;
using MediatR;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using NominaPro.Application.Interfaces;
using NominaPro.Infrastructure.Repositories;
using NominaPro.Infrastructure.Services;
using NominaPro.Application.Interfaces;
using NominaPro.Infrastructure.Services;
using NominaPro.Application.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddNominaProServices(builder.Configuration);
builder.Services.AddScoped<INotificacionService, NotificacionService>();
builder.Services.AddScoped<IAsistenciaRepository,AsistenciaRepository>();
builder.Services.AddScoped<IAsistenciaService,AsistenciaService>();
builder.Services.AddScoped<INotificacionRepository, NotificacionRepository>();
builder.Services.AddScoped<IConfiguracionSistemaRepository,ConfiguracionSistemaRepository>();
builder.Services.AddScoped<IConfiguracionSistemaService,ConfiguracionSistemaService>();
builder.Services.AddScoped<IConfiguracionSistemaService, ConfiguracionSistemaService>();
builder.Services.AddScoped<IConfiguracionNominaRepository, ConfiguracionNominaRepository>();
builder.Services.AddScoped<IConfiguracionNominaService, ConfiguracionNominaService>();
builder.Services.AddScoped<IConfiguracionSistemaRepository, ConfiguracionSistemaRepository>();
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errores = context.ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .SelectMany(x => x.Value!.Errors)
            .Select(x => x.ErrorMessage)
            .ToList();

        return new BadRequestObjectResult(new
        {
            status = 400,
            message = errores.FirstOrDefault() ?? "Solicitud inválida.",
            errors = errores
        });
    };
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();