using CableNet.Business.Interfaces;
using CableNet.Business.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CableNet.Business;

public static class DependencyInjection
{
    public static IServiceCollection AddBusiness(this IServiceCollection services)
    {
        services.AddScoped<IClienteService, ClienteService>();
        services.AddScoped<IServicioService, ServicioService>();
        services.AddScoped<IAsignacionService, AsignacionService>();
        services.AddScoped<IFacturaService, FacturaService>();
        services.AddScoped<IPagoService, PagoService>();
        services.AddScoped<IMorosidadService, MorosidadService>();
        services.AddScoped<IUpgradeService, UpgradeService>();
        services.AddScoped<IAlarmaService, AlarmaService>();
        services.AddScoped<IEmpleadoService, EmpleadoService>();

        return services;
    }
}