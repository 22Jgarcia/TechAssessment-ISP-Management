using CableNet.DataAccess.Context;
using CableNet.Domain.Entities;
using CableNet.Domain.Interfaces;
using Dapper;
using System.Data;

namespace CableNet.DataAccess.Repositories;

public class AsignacionRepository : IAsignacionRepository
{
    private readonly ISqlConnectionFactory _factory;

    public AsignacionRepository(ISqlConnectionFactory factory)
        => _factory = factory;

    public async Task AsignarInternetAsync(int idCliente, int idServicio)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_ClienteServicio_AsignarInternet",
            new { IdCliente = idCliente, IdServicio = idServicio },
            commandType: CommandType.StoredProcedure);
    }

    public async Task AsignarCableAsync(int idCliente, int idServicio, string? direccion)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_ClienteServicio_AsignarCable",
            new { IdCliente = idCliente, IdServicio = idServicio, DireccionInstalacion = direccion },
            commandType: CommandType.StoredProcedure);
    }

    public async Task QuitarInternetAsync(int idCliente)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_ClienteServicio_QuitarInternet",
            new { IdCliente = idCliente },
            commandType: CommandType.StoredProcedure);
    }

    public async Task QuitarCableAsync(int idCliente)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_ClienteServicio_QuitarCable",
            new { IdCliente = idCliente },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<ClienteConServicios?> GetServiciosByClienteAsync(int idCliente)
    {
        using var conn = _factory.CreateConnection();

        using var multi = await conn.QueryMultipleAsync(
            "dbo.usp_ClienteServicio_GetByCliente",
            new { IdCliente = idCliente },
            commandType: CommandType.StoredProcedure);

        var cliente = await multi.ReadSingleOrDefaultAsync<ClienteConServicios>();
        var internet = await multi.ReadSingleOrDefaultAsync<ServicioInternetDetalle>();
        var cable = await multi.ReadSingleOrDefaultAsync<ServicioCableDetalle>();

        if (cliente is null) return null;

        cliente.Internet = internet;
        cliente.Cable = cable;

        return cliente;
    }
}