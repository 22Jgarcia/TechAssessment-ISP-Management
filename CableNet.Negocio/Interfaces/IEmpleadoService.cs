using CableNet.Business.DTOs;

namespace CableNet.Business.Interfaces;

public interface IEmpleadoService
{
    Task<int> CrearAsync(CrearEmpleadoRequest req);
    Task ActualizarAsync(int id, ActualizarEmpleadoRequest req);
    Task EliminarAsync(int id);
    Task<IEnumerable<EmpleadoDto>> ObtenerTodosAsync();
    Task<IEnumerable<NominaCalculoDto>> CalcularNominaAsync();
}