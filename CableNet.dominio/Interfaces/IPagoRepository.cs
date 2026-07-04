using CableNet.Domain.Entities;

namespace CableNet.Domain.Interfaces;

public interface IPagoRepository
{
    Task<int> RegistrarAsync(int idFactura, decimal monto, string metodoPago, string? referencia);
    Task<IEnumerable<Pago>> GetByFacturaAsync(int idFactura);
    Task<IEnumerable<Pago>> GetHistorialClienteAsync(int idCliente, short? anio);
    Task<ResumenPagoFactura?> GetResumenFacturaAsync(int idFactura);
}