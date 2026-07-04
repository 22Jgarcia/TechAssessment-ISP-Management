using CableNet.DataAccess.Context;
using CableNet.Domain.Entities;
using CableNet.Domain.Interfaces;
using Dapper;
using System.Data;

namespace CableNet.DataAccess.Repositories;

public class UpgradeRepository : IUpgradeRepository
{
    private readonly ISqlConnectionFactory _factory;

    public UpgradeRepository(ISqlConnectionFactory factory) => _factory = factory;

    public async Task<IEnumerable<ClienteElegibleUpgrade>> DetectarElegiblesAsync(DateTime? fechaCorte)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<ClienteElegibleUpgrade>(
            "dbo.usp_Upgrade_DetectarElegibles",
            new { FechaCorte = fechaCorte },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> AplicarClienteAsync(int idCliente)
    {
        using var conn = _factory.CreateConnection();
        var p = new DynamicParameters();
        p.Add("@IdCliente", idCliente);
        p.Add("@VelocidadNueva", dbType: DbType.Int32,
                                 direction: ParameterDirection.Output);
        await conn.ExecuteAsync("dbo.usp_Upgrade_AplicarCliente", p,
                                commandType: CommandType.StoredProcedure);
        return p.Get<int>("@VelocidadNueva");
    }

    public async Task<int> AplicarMasivoAsync(DateTime? fechaCorte)
    {
        using var conn = _factory.CreateConnection();
        var p = new DynamicParameters();
        p.Add("@FechaCorte", fechaCorte);
        p.Add("@ClientesActualizados", dbType: DbType.Int32,
                                        direction: ParameterDirection.Output);
        await conn.ExecuteAsync("dbo.usp_Upgrade_AplicarMasivo", p,
                                commandType: CommandType.StoredProcedure);
        return p.Get<int>("@ClientesActualizados");
    }
}