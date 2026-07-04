namespace CableNet.Domain.Entities;

public class ServicioInternetDetalle
{
    public int IdServicioInternet { get; set; }
    public int IdCliente { get; set; }
    public int IdServicio { get; set; }
    public string NombreServicio { get; set; } = string.Empty;
    public int VelocidadMbps { get; set; }
    public decimal Costo { get; set; }
    public DateTime FechaContratacion { get; set; }
}