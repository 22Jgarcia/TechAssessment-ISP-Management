using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using CableNet.Domain.Interfaces;

namespace CableNet.Business.Services;

public class AlarmaService : IAlarmaService
{
    private readonly IAlarmaRepository _repo;

    public AlarmaService(IAlarmaRepository repo) => _repo = repo;

    public async Task<IEnumerable<AlarmaCobroDto>> GetClientesPorCobrarAsync(byte? mes, short? anio)
    {
        var lista = await _repo.GetClientesPorCobrarAsync(mes, anio);
        return lista.Select(a => new AlarmaCobroDto(
            a.IdCliente, a.Codigo, a.Nombre, a.Telefono, a.Correo,
            a.EstadoCliente, a.MontoAPagar, a.TieneDescuentoPaquete,
            a.IdFactura, a.NumeroFactura, a.Serie, a.FechaFactura,
            a.TotalFactura, a.SaldoPendiente, a.IdEstadoFactura,
            a.CubiertoAnticipado, a.EstadoCobro, a.DiasVencido
        ));
    }

    public async Task<ResumenMesDto> GetResumenMesAsync(byte? mes, short? anio)
    {
        var r = await _repo.GetResumenMesAsync(mes, anio);
        return new ResumenMesDto(
            r.ClientesTotales, r.ClientesPagados, r.ClientesPorFacturar,
            r.ClientesPendientes, r.ClientesBloqueados,
            r.MontoCobrado, r.MontoPendiente
        );
    }
}