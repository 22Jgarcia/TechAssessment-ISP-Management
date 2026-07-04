namespace CableNet.Domain.Entities;

public class DetalleFactura
{
    public int IdDetalleFactura { get; set; }
    public int IdServicio { get; set; }
    public string TipoServicio { get; set; } = string.Empty;
    public decimal CostoMensual { get; set; }
    public byte Cantidad { get; set; }
    public decimal Subtotal { get; set; }
}