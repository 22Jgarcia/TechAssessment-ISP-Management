using CableNet.Domain.Entities;

namespace CableNet.Domain.Interfaces;

public interface IUpgradeRepository
{
    Task<IEnumerable<ClienteElegibleUpgrade>> DetectarElegiblesAsync(DateTime? fechaCorte);
    Task<int> AplicarClienteAsync(int idCliente);
    Task<int> AplicarMasivoAsync(DateTime? fechaCorte);
}