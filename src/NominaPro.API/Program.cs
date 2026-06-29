using NominaPro.API.Extensions;
using NominaPro.API.Middleware;
using NominaPro.Application.Behaviors;
using MediatR;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddNominaProServices(builder.Configuration);
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();