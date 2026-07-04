using CableNet.Domain.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace CableNet.WebApi.Middleware;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        => _logger = logger;

    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken cancellationToken)
    {
        // Mapear cada tipo de excepción a su código HTTP correcto
        var (statusCode, titulo) = exception switch
        {
            NotFoundException => (HttpStatusCode.NotFound, "Recurso no encontrado"),
            BusinessRuleException => (HttpStatusCode.UnprocessableEntity, "Regla de negocio violada"),
            ConflictException => (HttpStatusCode.Conflict, "Conflicto de datos"),
            ArgumentException => (HttpStatusCode.BadRequest, "Solicitud inválida"),
            KeyNotFoundException => (HttpStatusCode.NotFound, "Recurso no encontrado"),
            _ => (HttpStatusCode.InternalServerError, "Error interno del servidor")
        };

        // Logear solo los errores inesperados (500)
        if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(exception, "Error no controlado: {Message}", exception.Message);
        else
            _logger.LogWarning("Error controlado [{Status}]: {Message}",
                               (int)statusCode, exception.Message);

        // Respuesta estándar ProblemDetails (RFC 7807) — formato JSON consistente
        var problem = new ProblemDetails
        {
            Status = (int)statusCode,
            Title = titulo,
            Detail = exception.Message,
            Instance = context.Request.Path
        };

        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/problem+json";

        await context.Response.WriteAsJsonAsync(problem, cancellationToken);
        return true; // true = excepción manejada, no propagar
    }
}