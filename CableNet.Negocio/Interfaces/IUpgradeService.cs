using CableNet.Business.DTOs;

namespace CableNet.Business.Interfaces;

public interface IUpgradeService
{
    Task<IEnumerable<ClienteElegibleUpgradeDto>> DetectarElegiblesAsync(DateTime? fechaCorte);
    Task<ResultadoUpgradeDto> AplicarClienteAsync(int idCliente);
    Task<ResultadoUpgradeMasivoDto> AplicarMasivoAsync(DateTime? fechaCorte);
}