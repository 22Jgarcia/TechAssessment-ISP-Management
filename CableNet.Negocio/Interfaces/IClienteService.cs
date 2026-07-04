using CableNet.Business.DTOs;

namespace CableNet.Business.Interfaces
{
    public interface IClienteService
    {

        Task<int> CrearClienteAsync(CrearClienteRequest request);
        Task ActualizarClienteAsync(int idCliente, ActualizarClienteRequest request);
        Task EliminarClienteAsync(int idCliente);
        Task<ClienteDto> ObtenerPorIdAsync(int idCliente);
        Task<IEnumerable<ClienteDto>> ObtenerTodosAsync(bool soloActivos = true);

    }
}
