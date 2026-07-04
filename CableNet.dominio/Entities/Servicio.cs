using CableNet.Domain.Enums;

namespace CableNet.Domain.Entities;

public class Servicio
{
    public int IdServicio { get; set; }
    public byte IdTipoServicio { get; set; }
    public string? TipoServicio { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }

    public int? VelocidadMbps { get; set; }

    public TipoServicioCable? TipoServicioCable { get; set; }

    public int? NumeroCanales { get; set; }

    public decimal CostoBase { get; set; }
    public bool Activo { get; set; } = true;



}
