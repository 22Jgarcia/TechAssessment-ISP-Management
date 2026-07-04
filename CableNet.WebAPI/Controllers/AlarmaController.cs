using CableNet.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CableNet.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlarmaController : ControllerBase
{
    private readonly IAlarmaService _service;

    public AlarmaController(IAlarmaService service) => _service = service;

    // GET api/alarma?mes=6&anio=2026
    [HttpGet]
    public async Task<IActionResult> GetReporte(
        [FromQuery] byte? mes = null,
        [FromQuery] short? anio = null)
        => Ok(await _service.GetClientesPorCobrarAsync(mes, anio));

    // GET api/alarma/resumen?mes=6&anio=2026
    [HttpGet("resumen")]
    public async Task<IActionResult> GetResumen(
        [FromQuery] byte? mes = null,
        [FromQuery] short? anio = null)
        => Ok(await _service.GetResumenMesAsync(mes, anio));
}