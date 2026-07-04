using CableNet.DataAccess.Context;
using CableNet.Domain.Entities;
using CableNet.Domain.Interfaces;
using Dapper;
using System.Data;

namespace CableNet.DataAccess.Repositories;

public class EmpleadoRepository : IEmpleadoRepository
{
    private readonly ISqlConnectionFactory _factory;

    public EmpleadoRepository(ISqlConnectionFactory factory) => _factory = factory;

    public async Task<int> CreateAsync(Empleado e)
    {
        using var conn = _factory.CreateConnection();
        var p = new DynamicParameters();
        p.Add("@Codigo", e.Codigo);
        p.Add("@Nombres", e.Nombres);
        p.Add("@Apellidos", e.Apellidos);
        p.Add("@DPI", e.DPI);
        p.Add("@IdTipoPuesto", e.IdTipoPuesto);
        p.Add("@SalarioBase", e.SalarioBase);
        p.Add("@FechaIngreso", e.FechaIngreso);
        p.Add("@IdEmpleado", dbType: DbType.Int32,
                               direction: ParameterDirection.Output);

        await conn.ExecuteAsync("dbo.usp_Empleado_Insert", p,
                                commandType: CommandType.StoredProcedure);
        return p.Get<int>("@IdEmpleado");
    }

    public async Task UpdateAsync(Empleado e)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_Empleado_Update",
            new
            {
                e.IdEmpleado,
                e.Nombres,
                e.Apellidos,
                e.DPI,
                e.IdTipoPuesto,
                e.SalarioBase
            },
            commandType: CommandType.StoredProcedure);
    }

    public async Task DeleteAsync(int id)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_Empleado_Delete",
            new { IdEmpleado = id },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<Empleado>> GetAllAsync()
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<Empleado>(
            "dbo.usp_Empleado_GetAll",
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<NominaCalculo>> CalcularNominaAsync()
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<NominaCalculo>(
            "dbo.usp_Nomina_Calcular",
            commandType: CommandType.StoredProcedure);
    }
}