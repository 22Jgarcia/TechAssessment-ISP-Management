using CableNet.Domain.Entities;

namespace CableNet.Domain.Interfaces;

public interface IMorosidadRepository
{
    Task<IEnumerable<ClienteMoroso>> DetectarAsync(DateTime? fechaCorte);
    Task<int> AplicarSuspensionAsync(DateTime? fechaCorte);
    Task ReactivarClienteAsync(int idCliente);
}