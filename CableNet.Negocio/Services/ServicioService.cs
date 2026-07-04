using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using CableNet.Domain.Entities;
using CableNet.Domain.Enums;
using CableNet.Domain.Exceptions;
using CableNet.Domain.Interfaces;

namespace CableNet.Business.Services;

public class ServicioService : IServicioService
{
    private readonly IServicioRepository _repo;

    public ServicioService(IServicioRepository repo) => _repo = repo;

    public async Task<int> CrearServicioAsync(CrearServicioRequest req)
    {
        Validar(req.IdTipoServicio, req.VelocidadMbps, req.TipoServicioCable, req.CostoBase);

        var entidad = new Servicio
        {
            IdTipoServicio = req.IdTipoServicio,
            Nombre = req.Nombre.Trim(),
            Descripcion = req.Descripcion,
            VelocidadMbps = req.VelocidadMbps,
            TipoServicioCable = req.TipoServicioCable.HasValue
                                ? (TipoServicioCable)req.TipoServicioCable.Value
                                : null,
            NumeroCanales = req.NumeroCanales,
            CostoBase = req.CostoBase
        };
        return await _repo.CreateAsync(entidad);
    }


    public async Task ActualizarServicioAsync(int id, ActualizarServicioRequest req)
    {
        var existente = await _repo.GetByIdAsync(id)
            ?? throw new NotFoundException("Servicio", id);

        Validar(existente.IdTipoServicio, req.VelocidadMbps, req.TipoServicioCable, req.CostoBase);

        existente.Nombre = req.Nombre.Trim();
        existente.Descripcion = req.Descripcion;
        existente.VelocidadMbps = req.VelocidadMbps;
        existente.TipoServicioCable = req.TipoServicioCable.HasValue
                                      ? (TipoServicioCable)req.TipoServicioCable.Value
                                      : null;
        existente.NumeroCanales = req.NumeroCanales;
        existente.CostoBase = req.CostoBase;

        await _repo.UpdateAsync(existente);
    }

    public Task EliminarServicioAsync(int id) => _repo.DeleteAsync(id);

    public async Task<ServicioDto> ObtenerPorIdAsync(int id)
    {
        var s = await _repo.GetByIdAsync(id);

        if (s is null || !s.Activo)
            throw new NotFoundException("Servicio", id);

        return ToDto(s);
    }

    public async Task<IEnumerable<ServicioDto>> ObtenerTodosAsync(
        bool soloActivos = true, byte? idTipoServicio = null)
    {
        var lista = await _repo.GetAllAsync(soloActivos, idTipoServicio);
        return lista.Select(ToDto);
    }

    private static void Validar(byte tipo, int? velocidad, byte? tipoCable, decimal costo)
    {
        if (costo <= 0)
            throw new BusinessRuleException("El costo debe ser mayor a cero.");

        if (tipo == 1)
        {
            if (velocidad is null || !new[] { 15, 25, 50 }.Contains(velocidad.Value))
                throw new ArgumentException("Internet requiere velocidad de 15, 25 o 50 Mbps.");
        }
        else if (tipo == 2)
        {
            if (tipoCable is null || tipoCable is not (1 or 2))
                throw new BusinessRuleException("Internet requiere velocidad de 15, 25 o 50 Mbps.");
        }
    }

    private static ServicioDto ToDto(Domain.Entities.Servicio s) => new(
        s.IdServicio, s.IdTipoServicio, s.TipoServicio,
        s.Nombre, s.Descripcion, s.VelocidadMbps,
        (byte?)s.TipoServicioCable, s.NumeroCanales, s.CostoBase, s.Activo
    );



}
