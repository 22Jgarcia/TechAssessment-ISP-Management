using CableNet.DataAccess.Context;
using CableNet.Domain.Entities;
using CableNet.Domain.Interfaces;
using Dapper;
using System.Data;

namespace CableNet.DataAccess.Repositories;

public class ServicioRepository : IServicioRepository
{
    private readonly ISqlConnectionFactory _factory;

    public ServicioRepository(ISqlConnectionFactory factory)
    => _factory = factory;

    public async Task<int> CreateAsync(Servicio s)
    {
        using var conn = _factory.CreateConnection();
        var p = new DynamicParameters();
        p.Add("@IdTipoServicio", s.IdTipoServicio);
        p.Add("@Nombre", s.Nombre);
        p.Add("@Descripcion", s.Descripcion);
        p.Add("@VelocidadMbps", s.VelocidadMbps);
        p.Add("@TipoServicioCable", (byte?)s.TipoServicioCable);
        p.Add("@NumeroCanales", s.NumeroCanales);
        p.Add("@CostoBase", s.CostoBase);
        p.Add("@IdServicio", dbType: DbType.Int32,
                                    direction: ParameterDirection.Output);

        await conn.ExecuteAsync("dbo.usp_Servicio_Insert", p,
            commandType: CommandType.StoredProcedure);
        return p.Get<int>("@IdServicio");

    }

    public async Task UpdateAsync(Servicio s)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_Servicio_Update",
           new
           {
               s.IdServicio,
               s.Nombre,
               s.Descripcion,
               s.VelocidadMbps,
               TipoServicioCable = (byte?)s.TipoServicioCable,
               s.NumeroCanales,
               s.CostoBase
           },
            commandType: CommandType.StoredProcedure);
    }
    public async Task DeleteAsync(int idServicio)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_Servicio_Delete",
            new { IdServicio = idServicio },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<Servicio?> GetByIdAsync(int idServicio)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<Servicio>(
            "dbo.usp_Servicio_GetById",
            new { IdServicio = idServicio },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<Servicio>> GetAllAsync(
        bool soloActivos = true, byte? idTipoServicio = null)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<Servicio>(
            "dbo.usp_Servicio_GetAll",
            new { SoloActivos = soloActivos, IdTipoServicio = idTipoServicio },
            commandType: CommandType.StoredProcedure);
    }


}
