using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using CableNet.Domain.Entities;
using CableNet.Domain.Exceptions;
using CableNet.Domain.Interfaces;

namespace CableNet.Business.Services;

public class PagoService : IPagoService
{
    private static readonly string[] MetodosValidos =
        {"Efectivo", "Tarjeta", "Transferencia"};

    private readonly IPagoRepository _repo;

    public PagoService(IPagoRepository repo) => _repo = repo;

    public async Task<int> RegistrarAsync(RegistrarPagoRequest req)
    {
        if (req.Monto <= 0)
            throw new ArgumentException("El monto debe ser mayor a cero.");

        if (string.IsNullOrWhiteSpace(req.MetodoPago) || !MetodosValidos.Contains(req.MetodoPago))
            throw new BusinessRuleException($"Método de pago inválido. Métodos válidos: {string.Join(", ", MetodosValidos)}");

        return await _repo.RegistrarAsync(req.IdFactura, req.Monto, req.MetodoPago, req.Referencia);
    }

    public async Task<IEnumerable<PagoDto>> GetByFacturaAsync(int idFactura)
    {
        var lista = await _repo.GetByFacturaAsync(idFactura);
        return lista.Select(ToDto);
    }

    public async Task<IEnumerable<PagoDto>> GetHistorialClienteAsync(int idCliente, short? anio)
    {
        var lista = await _repo.GetHistorialClienteAsync(idCliente, anio);
        return lista.Select(ToDto);
    }

    public async Task<ResumenPagoFacturaDto> GetResumenFacturaAsync(int idFactura)
    {
        var r = await _repo.GetResumenFacturaAsync(idFactura)
            ?? throw new NotFoundException("Factura", idFactura);

        return new ResumenPagoFacturaDto(
            r.IdFactura, r.NumeroFactura, r.Serie,
            r.TotalFactura, r.TotalPagado, r.SaldoPendiente,
            r.IdEstado, r.EstadoNombre,
            r.Pagos.Select(ToDto)
        );
    }

    private static PagoDto ToDto(Pago p) => new(
        p.IdPago, p.IdFactura, p.FechaPago,
        p.Monto, p.MetodoPago, p.Referencia,
        p.NumeroFactura, p.Serie, p.MesCobro, p.AnioCobro
    );
}
