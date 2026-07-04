namespace CableNet.Business.DTOs;

public record AlarmaCobroDto(
    int IdCliente,
    string Codigo,
    string Nombre,
    string? Telefono,
    string? Correo,
    string EstadoCliente,
    decimal MontoAPagar,
    bool TieneDescuentoPaquete,
    int? IdFactura,
    string? NumeroFactura,
    string? Serie,
    DateTime? FechaFactura,
    decimal? TotalFactura,
    decimal? SaldoPendiente,
    byte? IdEstadoFactura,
    bool CubiertoAnticipado,
    string EstadoCobro,
    int DiasVencido
);

public record ResumenMesDto(
    int ClientesTotales,
    int ClientesPagados,
    int ClientesPorFacturar,
    int ClientesPendientes,
    int ClientesBloqueados,
    decimal MontoCobrado,
    decimal MontoPendiente
);