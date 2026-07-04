using CableNet.DataAccess.Context;
using CableNet.Domain.Entities;
using CableNet.Domain.Interfaces;
using Dapper;
using System.Data;

namespace CableNet.DataAccess.Repositories;

public class MorosidadRepository : IMorosidadRepository
{
    private readonly ISqlConnectionFactory _factory;

    public MorosidadRepository(ISqlConnectionFactory factory) => _factory = factory;

    public async Task<IEnumerable<ClienteMoroso>> DetectarAsync(DateTime? fechaCorte)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<ClienteMoroso>(
            "dbo.usp_Morosidad_Detectar",
            new { FechaCorte = fechaCorte },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> AplicarSuspensionAsync(DateTime? fechaCorte)
    {
        using var conn = _factory.CreateConnection();
        var p = new DynamicParameters();
        p.Add("@FechaCorte", fechaCorte);
        p.Add("@ClientesAfectados", dbType: DbType.Int32,
                                    direction: ParameterDirection.Output);

        await conn.ExecuteAsync("dbo.usp_Morosidad_AplicarSuspension", p,
                                commandType: CommandType.StoredProcedure);
        return p.Get<int>("@ClientesAfectados");
    }

    public async Task ReactivarClienteAsync(int idCliente)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_Morosidad_ReactivarCliente",
            new { IdCliente = idCliente },
            commandType: CommandType.StoredProcedure);
    }
}