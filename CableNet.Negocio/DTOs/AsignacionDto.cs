namespace CableNet.Business.DTOs;

public record AsignarInternetRequest(int IdCliente, int IdServicio);

public record AsignarCableRequest(
    int IdCliente,
    int IdServicio,
    string? DireccionInstalacion
);

public record ResumenContratoDto(
    int IdCliente,
    string Codigo,
    string Nombre,
    string? EstadoNombre,


    ServicioContratadoDto? Internet,
    ServicioContratadoDto? Cable,

    decimal Subtotal,
    bool TieneDescuentoPaquete,
    decimal PorcentajeDescuento,
    decimal MontoDescuento,
    decimal Total
);

public record ServicioContratadoDto(
    int IdServicio,
    string NombreServicio,
    int? VelocidadMbps,
    string? DireccionInstalacion,
    decimal CostoMensual,
    DateTime FechaContratacion
);