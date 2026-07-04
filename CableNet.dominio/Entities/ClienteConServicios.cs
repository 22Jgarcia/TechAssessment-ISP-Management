namespace CableNet.Domain.Entities;


public class ClienteConServicios
{
    public int IdCliente { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Direccion { get; set; }
    public string? Correo { get; set; }
    public string? Telefono { get; set; }
    public string? EstadoNombre { get; set; }

    public ServicioInternetDetalle? Internet { get; set; }
    public ServicioCableDetalle? Cable { get; set; }
}