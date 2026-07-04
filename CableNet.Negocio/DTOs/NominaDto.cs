namespace CableNet.Business.DTOs;

public record EmpleadoDto(
    int IdEmpleado,
    string Codigo,
    string Nombres,
    string Apellidos,
    string? DPI,
    int IdTipoPuesto,
    string? NombrePuesto,
    decimal SalarioBase,
    DateTime FechaIngreso,
    bool Activo
);

public record CrearEmpleadoRequest(
    string Codigo,
    string Nombres,
    string Apellidos,
    string? DPI,
    int IdTipoPuesto,
    decimal SalarioBase,
    DateTime FechaIngreso
);

public record ActualizarEmpleadoRequest(
    string Nombres,
    string Apellidos,
    string? DPI,
    int IdTipoPuesto,
    decimal SalarioBase
);

public record NominaCalculoDto(
    int IdEmpleado,
    string Codigo,
    string NombreCompleto,
    string Puesto,
    DateTime FechaIngreso,
    decimal SalarioBase,
    decimal Bonificacion,
    decimal TotalDevengado,
    decimal CuotaIGSS,
    decimal RetencionISR,
    decimal PasivoLaboralMensual,
    decimal LiquidoAPagar
);