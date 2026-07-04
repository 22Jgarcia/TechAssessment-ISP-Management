using CableNet.Business.DTOs;

namespace CableNet.Business.Interfaces;

public interface IFacturaService
{
    Task<int> GenerarAsync(GenerarFacturaRequest req);
    Task<FacturaCompletaDto> ObtenerPorIdAsync(int idFactura);
    Task<IEnumerable<FacturaListaDto>> ObtenerTodasAsync(int? idCliente, byte? idEstado, short? anio, byte? mes);
    Task AnularAsync(int idFactura);
    Task<IEnumerable<CoberturaAnticipadaDto>> GetCoberturaAnticipadaAsync(int idCliente);

}