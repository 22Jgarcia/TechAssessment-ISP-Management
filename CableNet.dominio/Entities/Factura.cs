using CableNet.Domain.Enums;

namespace CableNet.Domain.Entities;

public class Factura
{
    public int IdFactura { get; set; }
    public string NumeroFactura { get; set; } = string.Empty;
    public string Serie { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public int IdCliente { get; set; }
    public string? CodigoCliente { get; set; }
    public string? NombreCliente { get; set; }
    public string? Direccion { get; set; }
    public string? Correo { get; set; }
    public string? Telefono { get; set; }
    public byte MesCobro { get; set; }
    public short AnioCobro { get; set; }
    public decimal Subtotal { get; set; }
    public decimal MontoDescuento { get; set; }
    public decimal Total { get; set; }
    public EstadoFactura IdEstado { get; set; }
    public string? EstadoNombre { get; set; }
    public bool EsPagoAnticipado { get; set; }
    public byte MesesPagados { get; set; }
    public DateTime FechaCreacion { get; set; }


    public List<DetalleFactura> Detalle { get; set; } = new();
    public List<DescuentoFactura> Descuentos { get; set; } = new();
}
