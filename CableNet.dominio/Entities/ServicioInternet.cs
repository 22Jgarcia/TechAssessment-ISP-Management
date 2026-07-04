namespace CableNet.Domain.Entities
{
    public class ServicioInternet
    {
        public int IdServicioInternet { get; set; }
        public int IdCliente { get; set; }
        public int VelocidadMps { get; set; }
        public decimal Costo { get; set; }
        public DateTime FechaContratacion { get; set; }
        public bool Activo { get; set; } = true;


    }
}
