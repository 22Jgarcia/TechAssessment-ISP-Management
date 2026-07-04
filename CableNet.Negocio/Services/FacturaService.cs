using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using CableNet.Domain.Exceptions;
using CableNet.Domain.Interfaces;

namespace CableNet.Business.Services;

public class FacturaService : IFacturaService
{
    private readonly IFacturaRepository _repo;

    public FacturaService(IFacturaRepository repo) => _repo = repo;

    public async Task<int> GenerarAsync(GenerarFacturaRequest req)
    {

        if (req.MesCobro < 1 || req.MesCobro > 12)
            throw new BusinessRuleException("El mes debe estar entre 1 y 12.");

        if (req.AnioCobro < 2020 || req.AnioCobro > 2100)
            throw new BusinessRuleException("El año no es válido.");

        var serie = string.IsNullOrWhiteSpace(req.Serie) ? "A" : req.Serie.Trim();

        return await _repo.GenerarAsync(
            req.IdCliente, req.MesCobro, req.AnioCobro, serie, req.EsPagoAnticipado);
    }

    public async Task<FacturaCompletaDto> ObtenerPorIdAsync(int idFactura)
    {
        var f = await _repo.GetByIdAsync(idFactura)
            ?? throw new NotFoundException("Factura", idFactura);

        return new FacturaCompletaDto(
            f.IdFactura, f.NumeroFactura, f.Serie, f.Fecha,
            f.IdCliente, f.CodigoCliente, f.NombreCliente,
            f.Direccion, f.Correo, f.Telefono,
            f.MesCobro, f.AnioCobro,
            f.Subtotal, f.MontoDescuento, f.Total,
            f.IdEstado, f.EstadoNombre,
            f.EsPagoAnticipado, f.MesesPagados,
            f.Detalle.Select(d => new DetalleFacturaDto(
                d.IdDetalleFactura, d.IdServicio, d.TipoServicio,
                d.CostoMensual, d.Cantidad, d.Subtotal)),
            f.Descuentos.Select(d => new DescuentoFacturaDto(
                d.IdDescuentoFactura, d.TipoDescuento,
                d.Porcentaje, d.MontoDescuento))
        );
    }

    public async Task<IEnumerable<FacturaListaDto>> ObtenerTodasAsync(
        int? idCliente, byte? idEstado, short? anio, byte? mes)
    {
        var lista = await _repo.GetAllAsync(idCliente, idEstado, anio, mes);
        return lista.Select(f => new FacturaListaDto(
            f.IdFactura, f.NumeroFactura, f.Serie, f.Fecha,
            f.IdCliente, f.CodigoCliente, f.NombreCliente,
            f.MesCobro, f.AnioCobro,
            f.Subtotal, f.MontoDescuento, f.Total,
            f.IdEstado, f.EstadoNombre,
            f.EsPagoAnticipado, f.MesesPagados
        ));
    }

    public Task AnularAsync(int idFactura) => _repo.AnularAsync(idFactura);


    public async Task<IEnumerable<CoberturaAnticipadaDto>> GetCoberturaAnticipadaAsync(int idCliente)
    {
        var lista = await _repo.GetCoberturaAnticipadaAsync(idCliente);
        return lista.Select(c => new CoberturaAnticipadaDto(
            c.IdFactura, c.NumeroFactura, c.Serie, c.Fecha,
            c.MesInicio, c.AnioInicio, c.MesesPagados,
            c.FechaInicio, c.FechaFin, c.Total, c.IdEstado, c.EstadoNombre
        ));
    }

}