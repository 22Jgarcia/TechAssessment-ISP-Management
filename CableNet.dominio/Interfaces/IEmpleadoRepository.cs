using CableNet.Domain.Entities;

namespace CableNet.Domain.Interfaces;

public interface IEmpleadoRepository
{
    Task<int> CreateAsync(Empleado e);
    Task UpdateAsync(Empleado e);
    Task DeleteAsync(int id);
    Task<IEnumerable<Empleado>> GetAllAsync();
    Task<IEnumerable<NominaCalculo>> CalcularNominaAsync();
}