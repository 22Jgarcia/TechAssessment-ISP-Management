using CableNet.Domain.Entities;

namespace CableNet.Domain.Interfaces;

public interface IAsignacionRepository
{
    Task AsignarInternetAsync(int idCliente, int idServicio);
    Task AsignarCableAsync(int idCliente, int idServicio, string? direccionInstalacion);
    Task QuitarInternetAsync(int idCliente);
    Task QuitarCableAsync(int idCliente);
    Task<ClienteConServicios?> GetServiciosByClienteAsync(int idCliente);
}