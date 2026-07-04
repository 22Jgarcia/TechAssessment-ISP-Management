using CableNet.Business.DTOs;

namespace CableNet.Business.Interfaces;

public interface IMorosidadService
{
    Task<IEnumerable<ClienteMorosoDto>> DetectarAsync(DateTime? fechaCorte);
    Task<ResultadoSuspensionDto> AplicarSuspensionAsync(DateTime? fechaCorte);
    Task ReactivarClienteAsync(int idCliente);
}