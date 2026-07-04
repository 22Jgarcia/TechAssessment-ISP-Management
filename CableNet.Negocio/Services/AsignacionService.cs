using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using CableNet.Domain.Exceptions;
using CableNet.Domain.Interfaces;

namespace CableNet.Business.Services;

public class AsignacionService : IAsignacionService
{
    private readonly IAsignacionRepository _repo;
    private const decimal PorcentajeDescuentoPaquete = 0.10m; // 10% configurable aquí

    public AsignacionService(IAsignacionRepository repo) => _repo = repo;

    public async Task AsignarInternetAsync(AsignarInternetRequest req)
        => await _repo.AsignarInternetAsync(req.IdCliente, req.IdServicio);

    public async Task AsignarCableAsync(AsignarCableRequest req)
        => await _repo.AsignarCableAsync(req.IdCliente, req.IdServicio, req.DireccionInstalacion);

    public async Task QuitarInternetAsync(int idCliente)
        => await _repo.QuitarInternetAsync(idCliente);

    public async Task QuitarCableAsync(int idCliente)
        => await _repo.QuitarCableAsync(idCliente);

    public async Task<ResumenContratoDto> GetResumenAsync(int idCliente)
    {
        var cliente = await _repo.GetServiciosByClienteAsync(idCliente)
            ?? throw new NotFoundException("Cliente", idCliente);

        // Mapear servicios al DTO de presentación
        var internet = cliente.Internet is null ? null : new ServicioContratadoDto(
            cliente.Internet.IdServicio,
            cliente.Internet.NombreServicio,
            cliente.Internet.VelocidadMbps,
            null,
            cliente.Internet.Costo,
            cliente.Internet.FechaContratacion
        );

        var cable = cliente.Cable is null ? null : new ServicioContratadoDto(
            cliente.Cable.IdServicio,
            cliente.Cable.NombreServicio,
            null,
            cliente.Cable.DireccionInstalacion,
            cliente.Cable.Costo,
            cliente.Cable.FechaContratacion
        );

        // REGLA DE NEGOCIO: 10% descuento si tiene ambos
        var subtotal = (internet?.CostoMensual ?? 0) + (cable?.CostoMensual ?? 0);
        var tieneAmbos = internet is not null && cable is not null;
        var montoDescuento = tieneAmbos
            ? Math.Round(subtotal * PorcentajeDescuentoPaquete, 2)
            : 0m;
        var total = subtotal - montoDescuento;

        return new ResumenContratoDto(
            cliente.IdCliente,
            cliente.Codigo,
            cliente.Nombre,
            cliente.EstadoNombre,
            internet,
            cable,
            subtotal,
            tieneAmbos,
            tieneAmbos ? PorcentajeDescuentoPaquete * 100 : 0,
            montoDescuento,
            total
        );
    }
}