using CableNet.Business.DTOs;

namespace CableNet.Business.Interfaces;

public interface IAlarmaService
{
    Task<IEnumerable<AlarmaCobroDto>> GetClientesPorCobrarAsync(byte? mes, short? anio);
    Task<ResumenMesDto> GetResumenMesAsync(byte? mes, short? anio);
}