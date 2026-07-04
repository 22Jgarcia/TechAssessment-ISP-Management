namespace CableNet.Domain.Entities;

public class DescuentoFactura
{
    public int IdDescuentoFactura { get; set; }
    public string TipoDescuento { get; set; } = string.Empty;
    public decimal Porcentaje { get; set; }
    public decimal MontoDescuento { get; set; }
}