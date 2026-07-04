namespace CableNet.Domain.Entities;

public class ClienteElegibleUpgrade
{
    public int IdCliente { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public int IdServicioInternet { get; set; }
    public int VelocidadActual { get; set; }
    public int VelocidadNueva { get; set; }
    public DateTime FechaContratacion { get; set; }
    public int AniosCompletos { get; set; }
    public int TotalFacturas { get; set; }
    public int FacturasATiempo { get; set; }
    public string EstadoElegibilidad { get; set; } = string.Empty;
}