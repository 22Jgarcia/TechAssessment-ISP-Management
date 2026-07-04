using CableNet.Domain.Enums;

namespace CableNet.Domain.Entities;

public class ServicioCable
{
    public int IdServicioCable { get; set; }
    public int IdCliente { get; set; }
    public string? DireccionInstalacion { get; set; }
    public TipoServicioCable TipoServicio { get; set; }
    public decimal Costo { get; set; }
    public DateTime FechaContratacion { get; set; }
    public bool Activo { get; set; } = true;



}

