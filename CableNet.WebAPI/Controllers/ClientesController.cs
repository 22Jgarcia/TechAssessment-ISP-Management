using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CableNet.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ClientesController : ControllerBase
{
    private readonly IClienteService _service;
    public ClientesController(IClienteService service)
        => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool soloActivos = true)
         => Ok(await _service.ObtenerTodosAsync(soloActivos));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
        => Ok(await _service.ObtenerPorIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CrearClienteRequest request)
    {
        var idNuevo = await _service.CrearClienteAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = idNuevo }, new { idCliente = idNuevo });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ActualizarClienteRequest request)
    {
        await _service.ActualizarClienteAsync(id, request);
        return NoContent();
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.EliminarClienteAsync(id);
        return NoContent();
    }


}
