using CableNet.Domain.Entities;

namespace CableNet.Domain.Interfaces;

public interface IFacturaRepository
{
    Task<int> GenerarAsync(int idCliente, byte mes, short anio, string serie, bool esPagoAnticipado);
    Task<Factura?> GetByIdAsync(int idFactura);

    Task<IEnumerable<Factura>> GetAllAsync(int? idCliente, byte? idEstado, short? anio, byte? mes);
    Task AnularAsync(int idFactura);

    Task<IEnumerable<CoberturaAnticipada>> GetCoberturaAnticipadaAsync(int idCliente);
}