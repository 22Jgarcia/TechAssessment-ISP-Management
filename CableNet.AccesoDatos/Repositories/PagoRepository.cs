using CableNet.DataAccess.Context;
using CableNet.Domain.Entities;
using CableNet.Domain.Interfaces;
using Dapper;
using System.Data;


namespace CableNet.DataAccess.Repositories;

public class PagoRepository : IPagoRepository
{
    private readonly ISqlConnectionFactory _factory;

    public PagoRepository(ISqlConnectionFactory factory) => _factory = factory;

    public async Task<int> RegistrarAsync(int IdFactura, decimal monto, string metodoPago, string? referencia)
    {
        using var conn = _factory.CreateConnection();
        var p = new DynamicParameters();
        p.Add("@IdFactura", IdFactura);
        p.Add("@Monto", monto);
        p.Add("@MetodoPago", metodoPago);
        p.Add("@Referencia", referencia);
        p.Add("@IdPago", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await conn.ExecuteAsync("dbo.usp_Pago_Registrar", p, commandType: CommandType.StoredProcedure);

        return p.Get<int>("@IdPago");
    }

    public async Task<IEnumerable<Pago>> GetByFacturaAsync(int idFactura)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<Pago>("dbo.usp_Pago_GetByFactura", new { IdFactura = idFactura },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<Pago>> GetHistorialClienteAsync(int idCliente, short? anio)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<Pago>("dbo.usp_Pago_HistorialCliente",
            new { IdCliente = idCliente, Anio = anio },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<ResumenPagoFactura> GetResumenFacturaAsync(int idFactura)
    {
        using var conn = _factory.CreateConnection();
        using var multi = await conn.QueryMultipleAsync(
            "dbo.usp_Pago_ResumenFactura",
            new { IdFactura = idFactura },
            commandType: CommandType.StoredProcedure);

        var resumen = await multi.ReadSingleOrDefaultAsync<ResumenPagoFactura>();
        if (resumen is null) return null;

        resumen.Pagos = (await multi.ReadAsync<Pago>()).ToList();
        return resumen;



    }
}
