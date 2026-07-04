namespace CableNet.Business.DTOs;

public record ClienteElegibleUpgradeDto(
    int IdCliente,
    string Codigo,
    string Nombre,
    int IdServicioInternet,
    int VelocidadActual,
    int VelocidadNueva,
    DateTime FechaContratacion,
    int AniosCompletos,
    int TotalFacturas,
    int FacturasATiempo,
    string EstadoElegibilidad
);

public record ResultadoUpgradeDto(
    int VelocidadNueva,
    string Mensaje
);

public record ResultadoUpgradeMasivoDto(
    int ClientesActualizados,
    string Mensaje
);