namespace CableNet.Domain.Entities;

public class Empleado
{
    public int IdEmpleado { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string Apellidos { get; set; } = string.Empty;
    public string? DPI { get; set; }
    public int IdTipoPuesto { get; set; }
    public string? NombrePuesto { get; set; }
    public decimal SalarioBase { get; set; }
    public DateTime FechaIngreso { get; set; }
    public bool Activo { get; set; } = true;
}

public class NominaCalculo
{
    public int IdEmpleado { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public string Puesto { get; set; } = string.Empty;
    public DateTime FechaIngreso { get; set; }
    public decimal SalarioBase { get; set; }
    public decimal Bonificacion { get; set; }
    public decimal TotalDevengado { get; set; }
    public decimal CuotaIGSS { get; set; }
    public decimal RetencionISR { get; set; }
    public decimal PasivoLaboralMensual { get; set; }
    public decimal LiquidoAPagar { get; set; }
}