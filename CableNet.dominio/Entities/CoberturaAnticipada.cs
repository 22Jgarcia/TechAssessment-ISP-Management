namespace CableNet.Domain.Entities;

public class CoberturaAnticipada
{
    public int IdFactura { get; set; }
    public string NumeroFactura { get; set; } = string.Empty;
    public string Serie { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public byte MesInicio { get; set; }
    public short AnioInicio { get; set; }
    public byte MesesPagados { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public decimal Total { get; set; }
    public byte IdEstado { get; set; }
    public string EstadoNombre { get; set; } = string.Empty;
}