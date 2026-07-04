namespace CableNet.Business.DTOs;

public record ServicioDto(
    int IdServicio,
    byte IdTipoServicio,
    string? TipoServicioNombre,
    string Nombre,
    string? Descripcion,
    int? VelocidadMbps,
    byte? TipoServicioCable,
    int? NumeroCanales,
    decimal CostoBase,
    bool Activo
);

public record CrearServicioRequest(
    byte IdTipoServicio,
    string Nombre,
    string? Descripcion,
    int? VelocidadMbps,
    byte? TipoServicioCable,
    int? NumeroCanales,
    decimal CostoBase
);

public record ActualizarServicioRequest(
    string Nombre,
    string? Descripcion,
    int? VelocidadMbps,
    byte? TipoServicioCable,
    int? NumeroCanales,
    decimal CostoBase
);
