using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CableNet.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ServiciosController : ControllerBase
{
    private readonly IServicioService _service;

    public ServiciosController(IServicioService service) => _service = service;


    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] byte? tipo)
    {
        var lista = await _service.ObtenerTodosAsync(true, tipo);
        return Ok(lista);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var dto = await _service.ObtenerPorIdAsync(id);
        return dto is null ? NotFound($"Servicio con id '{id}' no fue encontrado.") : Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CrearServicioRequest req)
    {
        var id = await _service.CrearServicioAsync(req);
        return CreatedAtAction(nameof(GetById), new { id }, new { idServicio = id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ActualizarServicioRequest req)
    {
        await _service.ActualizarServicioAsync(id, req);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.EliminarServicioAsync(id);
        return NoContent();
    }
}