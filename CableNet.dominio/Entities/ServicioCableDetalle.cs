using CableNet.Domain.Enums;

namespace CableNet.Domain.Entities;

public class ServicioCableDetalle
{
    public int IdServicioCable { get; set; }
    public int IdCliente { get; set; }
    public int IdServicio { get; set; }
    public string NombreServicio { get; set; } = string.Empty;
    public string? DireccionInstalacion { get; set; }
    public TipoServicioCable TipoServicio { get; set; }
    public decimal Costo { get; set; }
    public DateTime FechaContratacion { get; set; }
}