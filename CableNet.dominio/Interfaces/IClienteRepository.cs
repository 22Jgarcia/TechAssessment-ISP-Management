using CableNet.Domain.Entities;

namespace CableNet.Domain.Interfaces;

public interface IClienteRepository
{
    Task<int> CreateAsync(Cliente cliente);
    Task UpdateAsync(Cliente cliente);
    Task DeleteAsync(int IdCliente);
    Task<Cliente?> GetByIdAsync(int IdCliente);
    Task<IEnumerable<Cliente>> GetAllAsync(bool soloActivos = true);


}

