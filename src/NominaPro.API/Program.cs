using Microsoft.EntityFrameworkCore;
using NominaPro.Infrastructure.Data;
using NominaPro.Application.Interfaces;
using NominaPro.Application.Services;
using NominaPro.Infrastructure.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using NominaPro.Application.Validators;
using NominaPro.Application.Mappings;

var builder = WebApplication.CreateBuilder(args);

// Base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Servicios
builder.Services.AddOpenApi();
builder.Services.AddScoped<IEmpresaRepository, EmpresaRepository>();
builder.Services.AddScoped<IEmpresaService, EmpresaService>();
builder.Services.AddSingleton<AutoMapper.IMapper>(provider =>
{
    var loggerFactory = provider.GetRequiredService<ILoggerFactory>();

    var config = new AutoMapper.MapperConfiguration(cfg =>
    {
        cfg.AddProfile<EmpresaProfile>();
    }, loggerFactory);

    return config.CreateMapper();
});

builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateEmpresaDtoValidator>();

var app = builder.Build();

// OpenAPI
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();