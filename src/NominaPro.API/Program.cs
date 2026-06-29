using NominaPro.API.Extensions;
using NominaPro.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddNominaProServices(builder.Configuration);

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