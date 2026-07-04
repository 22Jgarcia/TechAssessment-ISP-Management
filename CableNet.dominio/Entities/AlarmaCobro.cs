namespace CableNet.Domain.Entities;

public class AlarmaCobro
{
    public int IdCliente { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Correo { get; set; }
    public string EstadoCliente { get; set; } = string.Empty;
    public decimal MontoAPagar { get; set; }
    public bool TieneDescuentoPaquete { get; set; }
    public int? IdFactura { get; set; }
    public string? NumeroFactura { get; set; }
    public string? Serie { get; set; }
    public DateTime? FechaFactura { get; set; }
    public decimal? TotalFactura { get; set; }
    public decimal? SaldoPendiente { get; set; }
    public byte? IdEstadoFactura { get; set; }
    public bool CubiertoAnticipado { get; set; }
    public string EstadoCobro { get; set; } = string.Empty;
    public int DiasVencido { get; set; }
}

public class ResumenMes
{
    public int ClientesTotales { get; set; }
    public int ClientesPagados { get; set; }
    public int ClientesPorFacturar { get; set; }
    public int ClientesPendientes { get; set; }
    public int ClientesBloqueados { get; set; }
    public decimal MontoCobrado { get; set; }
    public decimal MontoPendiente { get; set; }
}