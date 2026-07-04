using CableNet.Domain.Entities;

namespace CableNet.Domain.Interfaces;

public interface IAlarmaRepository
{
    Task<IEnumerable<AlarmaCobro>> GetClientesPorCobrarAsync(byte? mes, short? anio);
    Task<ResumenMes> GetResumenMesAsync(byte? mes, short? anio);
}