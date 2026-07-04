using CableNet.Domain.Enums;

namespace CableNet.Business.DTOs;


public record FacturaListaDto(
    int IdFactura,
    string NumeroFactura,
    string Serie,
    DateTime Fecha,
    int IdCliente,
    string? CodigoCliente,
    string? NombreCliente,
    byte MesCobro,
    short AnioCobro,
    decimal Subtotal,
    decimal MontoDescuento,
    decimal Total,
    EstadoFactura IdEstado,
    string? EstadoNombre,
    bool EsPagoAnticipado,
    byte MesesPagados
);


public record FacturaCompletaDto(
    int IdFactura,
    string NumeroFactura,
    string Serie,
    DateTime Fecha,
    int IdCliente,
    string? CodigoCliente,
    string? NombreCliente,
    string? Direccion,
    string? Correo,
    string? Telefono,
    byte MesCobro,
    short AnioCobro,
    decimal Subtotal,
    decimal MontoDescuento,
    decimal Total,
    EstadoFactura IdEstado,
    string? EstadoNombre,
    bool EsPagoAnticipado,
    byte MesesPagados,
    IEnumerable<DetalleFacturaDto> Detalle,
    IEnumerable<DescuentoFacturaDto> Descuentos
);

public record DetalleFacturaDto(
    int IdDetalleFactura,
    int IdServicio,
    string TipoServicio,
    decimal CostoMensual,
    byte Cantidad,
    decimal Subtotal
);

public record DescuentoFacturaDto(
    int IdDescuentoFactura,
    string TipoDescuento,
    decimal Porcentaje,
    decimal MontoDescuento
);

public record GenerarFacturaRequest(
    int IdCliente,
    byte MesCobro,
    short AnioCobro,
    string? Serie,
    bool EsPagoAnticipado
);

public record CoberturaAnticipadaDto(
    int IdFactura,
    string NumeroFactura,
    string Serie,
    DateTime Fecha,
    byte MesInicio,
    short AnioInicio,
    byte MesesPagados,
    DateTime FechaInicio,
    DateTime FechaFin,
    decimal Total,
    byte IdEstado,
    string EstadoNombre
);
