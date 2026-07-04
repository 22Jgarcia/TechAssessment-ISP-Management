using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CableNet.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NominaController : ControllerBase
{
    private readonly IEmpleadoService _service;

    public NominaController(IEmpleadoService service) => _service = service;

    [HttpGet("empleados")]
    public async Task<IActionResult> GetEmpleados()
        => Ok(await _service.ObtenerTodosAsync());

    [HttpPost("empleados")]
    public async Task<IActionResult> Crear([FromBody] CrearEmpleadoRequest req)
    {
        var id = await _service.CrearAsync(req);
        return Created($"/api/nomina/empleados/{id}", new { idEmpleado = id });
    }

    [HttpPut("empleados/{id:int}")]
    public async Task<IActionResult> Actualizar(int id, [FromBody] ActualizarEmpleadoRequest req)
    {
        await _service.ActualizarAsync(id, req);
        return NoContent();
    }

    [HttpDelete("empleados/{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        await _service.EliminarAsync(id);
        return NoContent();
    }

    [HttpGet("calcular")]
    public async Task<IActionResult> CalcularNomina()
        => Ok(await _service.CalcularNominaAsync());
}