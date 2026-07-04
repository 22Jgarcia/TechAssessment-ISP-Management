using CableNet.Business.DTOs;

namespace CableNet.Business.Interfaces;

public interface IServicioService
{

    Task<int> CrearServicioAsync(CrearServicioRequest request);
    Task ActualizarServicioAsync(int idServicio, ActualizarServicioRequest request);
    Task EliminarServicioAsync(int idServicio);
    Task<ServicioDto> ObtenerPorIdAsync(int idServicio);
    Task<IEnumerable<ServicioDto>> ObtenerTodosAsync(bool soloActivos = true, byte? idTipoServicio = null);

}
