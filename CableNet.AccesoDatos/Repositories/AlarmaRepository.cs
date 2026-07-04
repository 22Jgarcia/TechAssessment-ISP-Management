using CableNet.DataAccess.Context;
using CableNet.Domain.Entities;
using CableNet.Domain.Interfaces;
using Dapper;
using System.Data;

namespace CableNet.DataAccess.Repositories;

public class AlarmaRepository : IAlarmaRepository
{
    private readonly ISqlConnectionFactory _factory;

    public AlarmaRepository(ISqlConnectionFactory factory) => _factory = factory;

    public async Task<IEnumerable<AlarmaCobro>> GetClientesPorCobrarAsync(byte? mes, short? anio)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<AlarmaCobro>(
            "dbo.usp_Alarma_ClientesPorCobrar",
            new { Mes = mes, Anio = anio },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<ResumenMes> GetResumenMesAsync(byte? mes, short? anio)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QuerySingleAsync<ResumenMes>(
            "dbo.usp_Alarma_ResumenMes",
            new { Mes = mes, Anio = anio },
            commandType: CommandType.StoredProcedure);
    }
}