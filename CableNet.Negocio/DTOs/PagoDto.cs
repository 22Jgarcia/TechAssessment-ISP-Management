namespace CableNet.Business.DTOs;

public record PagoDto(
    int IdPago,
    int IdFactura,
    DateTime FechaPago,
    decimal Monto,
    string MetodoPago,
    string? Referencia,

    string? NumeroFactura,
    string? Serie,
    byte? MesCobro,
    short? AnioCobro
);

public record ResumenPagoFacturaDto(
    int IdFactura,
    string NumeroFactura,
    string Serie,
    decimal TotalFactura,
    decimal TotalPagado,
    decimal SaldoPendiente,
    byte IdEstado,
    string EstadoNombre,
    IEnumerable<PagoDto> Pagos
);

public record RegistrarPagoRequest(
    int IdFactura,
    decimal Monto,
    string MetodoPago,
    string? Referencia
);