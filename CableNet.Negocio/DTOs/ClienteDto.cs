using CableNet.Domain.Enums;

namespace CableNet.Business.DTOs
{
    public record ClienteDto(
        int IdCliente,
        string Codigo,
        string Nombre,
        DateTime FechaAlta,
        string? Direccion,
        string? Correo,
        string? Telefono,
        EstadoCliente Estado,
        string? EstadoNombre,
        bool activo
    );

    public record CrearClienteRequest(
        string Codigo,
        string Nombre,
        DateTime? FechaAlta,
        string? Direccion,
        string? Correo,
        string? Telefono
    );

    public record ActualizarClienteRequest(

        string Nombre,
        string? Direccion,
        string? Correo,
        string? Telefono,
        EstadoCliente Estado

    );


}