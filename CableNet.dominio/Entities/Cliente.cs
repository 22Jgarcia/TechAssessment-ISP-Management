using CableNet.Domain.Enums;

namespace CableNet.Domain.Entities
{
    public class Cliente
    {
        public int IdCliente { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public DateTime FechaAlta { get; set; }
        public string? Direccion { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public EstadoCliente Estado { get; set; } = EstadoCliente.Activo;
        public string? EstadoNombre { get; set; }
        public bool Activo { get; set; } = true;


        public ServicioInternet? ServicioInternet { get; set; }
        public ServicioCable? ServicioCable { get; set; }


    }
}
