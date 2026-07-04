using CableNet.DataAccess.Context;
using CableNet.Domain.Entities;
using CableNet.Domain.Interfaces;
using Dapper;
using System.Data;

namespace CableNet.DataAccess.Repositories;

public class ClienteRepository : IClienteRepository
{
    private readonly ISqlConnectionFactory _factory;

    public ClienteRepository(ISqlConnectionFactory factory)
     => _factory = factory;

    public async Task<int> CreateAsync(Cliente cliente)
    {
        using var conn = _factory.CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("@Codigo", cliente.Codigo);
        parameters.Add("@Nombre", cliente.Nombre);
        parameters.Add("@FechaAlta", cliente.FechaAlta == default ? null : cliente.FechaAlta);
        parameters.Add("@Direccion", cliente.Direccion);
        parameters.Add("@Correo", cliente.Correo);
        parameters.Add("@Telefono", cliente.Telefono);
        parameters.Add("@IdEstadoCliente", (byte)cliente.Estado);
        parameters.Add("@IdCliente", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await conn.ExecuteAsync("dbo.usp_Cliente_Insert",
                                    parameters,
                                    commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("@IdCliente");

    }

    public async Task UpdateAsync(Cliente cliente)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_Cliente_Update",
            new
            {
                cliente.IdCliente,
                cliente.Nombre,
                cliente.Direccion,
                cliente.Correo,
                cliente.Telefono,
                IdEstadoCliente = (byte)cliente.Estado
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task DeleteAsync(int idCliente)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_Cliente_Delete",
            new { IdCliente = idCliente },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Cliente?> GetByIdAsync(int idCliente)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<Cliente>(
            "dbo.usp_Cliente_GetById",
            new { IdCliente = idCliente },
            commandType: CommandType.StoredProcedure);

    }

    public async Task<IEnumerable<Cliente>> GetAllAsync(bool soloActivos = true)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<Cliente>(
            "dbo.usp_Cliente_GetAll",
            new { SoloActivos = soloActivos },
            commandType: CommandType.StoredProcedure);
    }


}
