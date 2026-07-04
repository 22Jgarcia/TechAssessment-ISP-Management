using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using CableNet.Domain.Interfaces;

namespace CableNet.Business.Services;

public class UpgradeService : IUpgradeService
{
    private readonly IUpgradeRepository _repo;

    public UpgradeService(IUpgradeRepository repo) => _repo = repo;

    public async Task<IEnumerable<ClienteElegibleUpgradeDto>> DetectarElegiblesAsync(DateTime? fechaCorte)
    {
        var lista = await _repo.DetectarElegiblesAsync(fechaCorte);
        return lista.Select(c => new ClienteElegibleUpgradeDto(
            c.IdCliente, c.Codigo, c.Nombre, c.IdServicioInternet,
            c.VelocidadActual, c.VelocidadNueva, c.FechaContratacion,
            c.AniosCompletos, c.TotalFacturas, c.FacturasATiempo,
            c.EstadoElegibilidad
        ));
    }

    public async Task<ResultadoUpgradeDto> AplicarClienteAsync(int idCliente)
    {
        var nueva = await _repo.AplicarClienteAsync(idCliente);
        return new ResultadoUpgradeDto(
            nueva,
            $"Velocidad actualizada a {nueva} Mbps."
        );
    }

    public async Task<ResultadoUpgradeMasivoDto> AplicarMasivoAsync(DateTime? fechaCorte)
    {
        var n = await _repo.AplicarMasivoAsync(fechaCorte);
        var msg = n == 0
            ? "No hay clientes elegibles para upgrade en este momento."
            : $"Se aplicó upgrade a {n} cliente(s).";
        return new ResultadoUpgradeMasivoDto(n, msg);
    }
}