namespace CableNet.Domain.Entities;

public class Pago
{
    public int IdPago { get; set; }
    public int IdFactura { get; set; }
    public DateTime FechaPago { get; set; }
    public decimal Monto { get; set; }
    public string MetodoPago { get; set; } = string.Empty;
    public string? Referencia { get; set; }


    public string? NumeroFactura { get; set; }
    public string? Serie { get; set; }
    public byte? MesCobro { get; set; }
    public short? AnioCobro { get; set; }
}