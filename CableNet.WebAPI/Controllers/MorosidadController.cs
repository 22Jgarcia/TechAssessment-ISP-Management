using CableNet.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CableNet.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MorosidadController : ControllerBase
{
    private readonly IMorosidadService _service;

    public MorosidadController(IMorosidadService service) => _service = service;

    // GET api/morosidad?fechaCorte=2026-06-21
    [HttpGet]
    public async Task<IActionResult> Detectar([FromQuery] DateTime? fechaCorte = null)
        => Ok(await _service.DetectarAsync(fechaCorte));

    // POST api/morosidad/suspender?fechaCorte=2026-06-21
    [HttpPost("suspender")]
    public async Task<IActionResult> AplicarSuspension([FromQuery] DateTime? fechaCorte = null)
        => Ok(await _service.AplicarSuspensionAsync(fechaCorte));

    // POST api/morosidad/reactivar/2
    [HttpPost("reactivar/{idCliente:int}")]
    public async Task<IActionResult> Reactivar(int idCliente)
    {
        await _service.ReactivarClienteAsync(idCliente);
        return Ok(new { mensaje = "Cliente reactivado correctamente." });
    }
}