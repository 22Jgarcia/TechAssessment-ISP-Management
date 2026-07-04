using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CableNet.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PagosController : ControllerBase
{
    private readonly IPagoService _service;

    public PagosController(IPagoService service) => _service = service;

    // POST api/pagos
    [HttpPost]
    public async Task<IActionResult> Registrar([FromBody] RegistrarPagoRequest req)
    {
        var id = await _service.RegistrarAsync(req);
        return Created($"/api/pagos/{id}", new { idPago = id });
    }

    // GET api/pagos/factura/5
    [HttpGet("factura/{idFactura:int}")]
    public async Task<IActionResult> GetByFactura(int idFactura)
        => Ok(await _service.GetByFacturaAsync(idFactura));

    // GET api/pagos/factura/5/resumen
    [HttpGet("factura/{idFactura:int}/resumen")]
    public async Task<IActionResult> GetResumen(int idFactura)
        => Ok(await _service.GetResumenFacturaAsync(idFactura));

    // GET api/pagos/cliente/1?anio=2026
    [HttpGet("cliente/{idCliente:int}")]
    public async Task<IActionResult> GetHistorialCliente(
        int idCliente, [FromQuery] short? anio = null)
        => Ok(await _service.GetHistorialClienteAsync(idCliente, anio));
}