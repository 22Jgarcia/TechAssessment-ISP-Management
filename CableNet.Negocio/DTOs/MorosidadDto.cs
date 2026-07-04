namespace CableNet.Business.DTOs;

public record ClienteMorosoDto(
    int IdCliente,
    string Codigo,
    string Nombre,
    string? Telefono,
    string? Correo,
    string EstadoActual,
    int MesesAdeudados,
    decimal DeudaTotal,
    DateTime PrimerMesDeuda,
    DateTime UltimoMesDeuda,
    string AccionRequerida
);

public record ResultadoSuspensionDto(
    int ClientesAfectados,
    string Mensaje
);