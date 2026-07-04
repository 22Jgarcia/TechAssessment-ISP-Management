using CableNet.DataAccess.Context;
using CableNet.DataAccess.Repositories;
using CableNet.Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace CableNet.DataAccess
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDataAccess(
            this IServiceCollection services, string connectionString)
        {
            services.AddSingleton<ISqlConnectionFactory>(
                _ => new SqlConnectionFactory(connectionString));

            services.AddScoped<IClienteRepository, ClienteRepository>();
            services.AddScoped<IServicioRepository, ServicioRepository>();
            services.AddScoped<IAsignacionRepository, AsignacionRepository>();
            services.AddScoped<IFacturaRepository, FacturaRepository>();
            services.AddScoped<IPagoRepository, PagoRepository>();
            services.AddScoped<IMorosidadRepository, MorosidadRepository>();
            services.AddScoped<IUpgradeRepository, UpgradeRepository>();
            services.AddScoped<IAlarmaRepository, AlarmaRepository>();
            services.AddScoped<IEmpleadoRepository, EmpleadoRepository>();
            return services;
        }
    }
}
