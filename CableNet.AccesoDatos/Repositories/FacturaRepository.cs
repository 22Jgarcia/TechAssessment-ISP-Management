using CableNet.DataAccess.Context;
using CableNet.Domain.Entities;
using CableNet.Domain.Interfaces;
using Dapper;
using System.Data;

namespace CableNet.DataAccess.Repositories;

public class FacturaRepository : IFacturaRepository
{
    private readonly ISqlConnectionFactory _factory;

    public FacturaRepository(ISqlConnectionFactory factory) => _factory = factory;

    public async Task<int> GenerarAsync(int idCliente, byte mes, short anio, string serie, bool esPagoAnticipado)
    {
        using var conn = _factory.CreateConnection();
        var p = new DynamicParameters();
        p.Add("@IdCliente", idCliente);
        p.Add("@MesCobro", mes);
        p.Add("@AnioCobro", anio);
        p.Add("@Serie", serie);
        p.Add("@EsPagoAnticipado", esPagoAnticipado);
        p.Add("@IdFactura", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await conn.ExecuteAsync("dbo.usp_Factura_Generar", p, commandType: CommandType.StoredProcedure);
        return p.Get<int>("@IdFactura");

    }

    public async Task<Factura?> GetByIdAsync(int idFactura)
    {
        using var conn = _factory.CreateConnection();
        using var multi = await conn.QueryMultipleAsync(
            "dbo.usp_Factura_GetById",
            new { IdFactura = idFactura },
            commandType: CommandType.StoredProcedure);
        var factura = await multi.ReadSingleOrDefaultAsync<Factura>();
        if (factura is null) return null;

        factura.Detalle = (await multi.ReadAsync<DetalleFactura>()).ToList();
        factura.Descuentos = (await multi.ReadAsync<DescuentoFactura>()).ToList();
        return factura;
    }

    public async Task<IEnumerable<Factura>> GetAllAsync(
        int? idCliente, byte? idEstado, short? anio, byte? mes)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<Factura>("dbo.usp_Factura_GetAll",
            new
            {
                IdCliente = idCliente,
                IdEstado = idEstado,
                AnioCobro = anio,
                MesCobro = mes
            }, commandType: CommandType.StoredProcedure);

    }

    public async Task AnularAsync(int idFactura)
    {
        using var conn = _factory.CreateConnection();
        await conn.ExecuteAsync("dbo.usp_Factura_Anular", new { IdFactura = idFactura }, commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<CoberturaAnticipada>> GetCoberturaAnticipadaAsync(int idCliente)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<CoberturaAnticipada>(
            "dbo.usp_PagoAnticipado_GetCobertura",
            new { IdCliente = idCliente },
            commandType: CommandType.StoredProcedure);
    }




}
