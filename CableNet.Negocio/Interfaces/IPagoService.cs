using CableNet.Business.DTOs;

namespace CableNet.Business.Interfaces;

public interface IPagoService
{
    Task<int> RegistrarAsync(RegistrarPagoRequest req);
    Task<IEnumerable<PagoDto>> GetByFacturaAsync(int idFactura);
    Task<IEnumerable<PagoDto>> GetHistorialClienteAsync(int idCliente, short? anio);
    Task<ResumenPagoFacturaDto> GetResumenFacturaAsync(int idFactura);

}
