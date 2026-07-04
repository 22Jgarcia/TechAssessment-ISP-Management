namespace CableNet.Domain.Entities;

public class ClienteMoroso
{
    public int IdCliente { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Correo { get; set; }
    public string EstadoActual { get; set; } = string.Empty;
    public int MesesAdeudados { get; set; }
    public decimal DeudaTotal { get; set; }
    public DateTime PrimerMesDeuda { get; set; }
    public DateTime UltimoMesDeuda { get; set; }
    public string AccionRequerida { get; set; } = string.Empty;
}