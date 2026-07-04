
using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using CableNet.Domain.Entities;
using CableNet.Domain.Enums;
using CableNet.Domain.Exceptions;
using CableNet.Domain.Interfaces;


namespace CableNet.Business.Services;

public class ClienteService : IClienteService
{
    private readonly IClienteRepository _repo;

    public ClienteService(IClienteRepository repo)
        => _repo = repo;

    public async Task<int> CrearClienteAsync(CrearClienteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Codigo))
            throw new ArgumentException("El código del cliente no puede estar vacío.");
        if (string.IsNullOrWhiteSpace(request.Nombre))
            throw new ArgumentException("El nombre del cliente no puede estar vacío.");

        var cliente = new Cliente
        {
            Codigo = request.Codigo.Trim().ToUpper(),
            Nombre = request.Nombre.Trim(),
            FechaAlta = request.FechaAlta?.Date ?? DateTime.Today,
            Direccion = request.Direccion,
            Correo = request.Correo,
            Telefono = request.Telefono,
            Estado = EstadoCliente.Activo
        };
        return await _repo.CreateAsync(cliente);
    }

    public async Task ActualizarClienteAsync(int idCliente, ActualizarClienteRequest request)
    {
        var existente = await _repo.GetByIdAsync(idCliente)
            ?? throw new NotFoundException("Cliente", idCliente);

        existente.Nombre = request.Nombre.Trim();
        existente.Direccion = request.Direccion;
        existente.Correo = request.Correo;
        existente.Telefono = request.Telefono;
        existente.Estado = request.Estado;

        await _repo.UpdateAsync(existente);

    }

    public Task EliminarClienteAsync(int idCliente)
        => _repo.DeleteAsync(idCliente);

    public async Task<ClienteDto> ObtenerPorIdAsync(int idCliente)
    {
        var c = await _repo.GetByIdAsync(idCliente);

        if (c is null || !c.Activo)
            throw new NotFoundException("Cliente", idCliente);

        return ToDto(c);
    }

    public async Task<IEnumerable<ClienteDto>> ObtenerTodosAsync(bool soloActivos = true)
    {
        var lista = await _repo.GetAllAsync();
        return lista.Select(ToDto);
    }

    private static ClienteDto ToDto(Cliente c) => new(
       c.IdCliente, c.Codigo, c.Nombre, c.FechaAlta,
       c.Direccion, c.Correo, c.Telefono,
       c.Estado, c.EstadoNombre, c.Activo
   );
}
