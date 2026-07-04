using CableNet.Business.DTOs;

namespace CableNet.Business.Interfaces;

public interface IAsignacionService
{
    Task AsignarInternetAsync(AsignarInternetRequest req);
    Task AsignarCableAsync(AsignarCableRequest req);
    Task QuitarInternetAsync(int idCliente);
    Task QuitarCableAsync(int idCliente);
    Task<ResumenContratoDto> GetResumenAsync(int idCliente);
}