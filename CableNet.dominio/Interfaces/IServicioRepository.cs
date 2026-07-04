using CableNet.Domain.Entities;

namespace CableNet.Domain.Interfaces;

public interface IServicioRepository
{
    Task<int> CreateAsync(Servicio servicio);
    Task UpdateAsync(Servicio servicio);
    Task DeleteAsync(int idServicio);
    Task<Servicio?> GetByIdAsync(int idServicio);
    Task<IEnumerable<Servicio>> GetAllAsync(bool soloActivos = true, byte? idTipoServicio = null);

}
