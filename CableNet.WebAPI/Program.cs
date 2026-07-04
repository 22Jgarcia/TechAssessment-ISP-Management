using CableNet.Business;
using CableNet.DataAccess;
using CableNet.DataAccess.Context;
using CableNet.WebApi.Middleware;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errores = context.ModelState
            .Where(e => e.Value?.Errors.Count > 0)
            .ToDictionary(
                e => e.Key,
                e => e.Value!.Errors.Select(x => x.ErrorMessage).ToArray()
            );

        var problem = new ValidationProblemDetails(context.ModelState)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Datos inválidos",
            Detail = "Uno o más campos fallaron la validación.",
            Instance = context.HttpContext.Request.Path
        };

        foreach (var (campo, mensajes) in errores)
            problem.Errors[campo] = mensajes;

        return new BadRequestObjectResult(problem);
    };
});

var connectionString = builder.Configuration.GetConnectionString("CableNetDb")!;

builder.Services.AddDataAccess(connectionString);
builder.Services.AddBusiness();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();
app.UseHttpsRedirection();


app.UseCors("PermitirFrontend");

app.UseAuthorization();
app.MapControllers();

app.MapGet("/health/db", (ISqlConnectionFactory factory) =>
{
    using var conn = factory.CreateConnection();
    conn.Open();
    return Results.Ok(new { status = "OK", db = conn.Database });
});

app.Run();