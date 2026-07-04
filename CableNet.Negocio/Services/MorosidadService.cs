using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using CableNet.Domain.Interfaces;

namespace CableNet.Business.Services;

public class MorosidadService : IMorosidadService
{
    private readonly IMorosidadRepository _repo;

    public MorosidadService(IMorosidadRepository repo) => _repo = repo;

    public async Task<IEnumerable<ClienteMorosoDto>> DetectarAsync(DateTime? fechaCorte)
    {
        var lista = await _repo.DetectarAsync(fechaCorte);
        return lista.Select(m => new ClienteMorosoDto(
            m.IdCliente, m.Codigo, m.Nombre, m.Telefono, m.Correo,
            m.EstadoActual, m.MesesAdeudados, m.DeudaTotal,
            m.PrimerMesDeuda, m.UltimoMesDeuda, m.AccionRequerida
        ));
    }

    public async Task<ResultadoSuspensionDto> AplicarSuspensionAsync(DateTime? fechaCorte)
    {
        var afectados = await _repo.AplicarSuspensionAsync(fechaCorte);
        var mensaje = afectados == 0
            ? "No hay clientes que requieran suspensión."
            : $"Se suspendieron {afectados} cliente(s) por morosidad.";
        return new ResultadoSuspensionDto(afectados, mensaje);
    }

    public Task ReactivarClienteAsync(int idCliente)
        => _repo.ReactivarClienteAsync(idCliente);
}