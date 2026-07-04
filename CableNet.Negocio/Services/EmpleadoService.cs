using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using CableNet.Domain.Entities;
using CableNet.Domain.Exceptions;
using CableNet.Domain.Interfaces;

namespace CableNet.Business.Services;

public class EmpleadoService : IEmpleadoService
{
    private readonly IEmpleadoRepository _repo;

    public EmpleadoService(IEmpleadoRepository repo) => _repo = repo;

    public async Task<int> CrearAsync(CrearEmpleadoRequest r)
    {
        if (string.IsNullOrWhiteSpace(r.Codigo))
            throw new BusinessRuleException("El código es obligatorio.");
        if (string.IsNullOrWhiteSpace(r.Nombres) || string.IsNullOrWhiteSpace(r.Apellidos))
            throw new BusinessRuleException("Nombres y apellidos son obligatorios.");
        if (r.SalarioBase <= 0)
            throw new BusinessRuleException("El salario debe ser mayor a cero.");

        var entidad = new Empleado
        {
            Codigo = r.Codigo.Trim().ToUpper(),
            Nombres = r.Nombres.Trim(),
            Apellidos = r.Apellidos.Trim(),
            DPI = r.DPI,
            IdTipoPuesto = r.IdTipoPuesto,
            SalarioBase = r.SalarioBase,
            FechaIngreso = r.FechaIngreso
        };
        return await _repo.CreateAsync(entidad);
    }

    public async Task ActualizarAsync(int id, ActualizarEmpleadoRequest r)
    {
        await _repo.UpdateAsync(new Empleado
        {
            IdEmpleado = id,
            Nombres = r.Nombres,
            Apellidos = r.Apellidos,
            DPI = r.DPI,
            IdTipoPuesto = r.IdTipoPuesto,
            SalarioBase = r.SalarioBase
        });
    }

    public Task EliminarAsync(int id) => _repo.DeleteAsync(id);

    public async Task<IEnumerable<EmpleadoDto>> ObtenerTodosAsync()
    {
        var lista = await _repo.GetAllAsync();
        return lista.Select(e => new EmpleadoDto(
            e.IdEmpleado, e.Codigo, e.Nombres, e.Apellidos, e.DPI,
            e.IdTipoPuesto, e.NombrePuesto, e.SalarioBase, e.FechaIngreso, e.Activo
        ));
    }

    public async Task<IEnumerable<NominaCalculoDto>> CalcularNominaAsync()
    {
        var lista = await _repo.CalcularNominaAsync();
        return lista.Select(n => new NominaCalculoDto(
            n.IdEmpleado, n.Codigo, n.NombreCompleto, n.Puesto, n.FechaIngreso,
            n.SalarioBase, n.Bonificacion, n.TotalDevengado,
            n.CuotaIGSS, n.RetencionISR, n.PasivoLaboralMensual, n.LiquidoAPagar
        ));
    }
}