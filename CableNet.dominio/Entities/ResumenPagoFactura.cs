namespace CableNet.Domain.Entities;

public class ResumenPagoFactura
{
    public int IdFactura { get; set; }
    public string NumeroFactura { get; set; } = string.Empty;
    public string Serie { get; set; } = string.Empty;
    public decimal TotalFactura { get; set; }
    public decimal TotalPagado { get; set; }
    public decimal SaldoPendiente { get; set; }
    public byte IdEstado { get; set; }
    public string EstadoNombre { get; set; } = string.Empty;
    public List<Pago> Pagos { get; set; } = new();
}