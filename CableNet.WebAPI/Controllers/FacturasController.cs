using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CableNet.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FacturasController : ControllerBase
{
    private readonly IFacturaService _service;

    public FacturasController(IFacturaService service) => _service = service;

    // GET api/facturas?idCliente=1&anio=2026&mes=6&estado=1
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? idCliente = null,
        [FromQuery] byte? estado = null,
        [FromQuery] short? anio = null,
        [FromQuery] byte? mes = null)
        => Ok(await _service.ObtenerTodasAsync(idCliente, estado, anio, mes));


    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
        => Ok(await _service.ObtenerPorIdAsync(id));


    [HttpPost]
    public async Task<IActionResult> Generar([FromBody] GenerarFacturaRequest req)
    {
        var id = await _service.GenerarAsync(req);
        return CreatedAtAction(nameof(GetById), new { id }, new { idFactura = id });
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Anular(int id)
    {
        await _service.AnularAsync(id);
        return NoContent();
    }


    [HttpGet("cobertura/{idCliente:int}")]
    public async Task<IActionResult> GetCobertura(int idCliente)
        => Ok(await _service.GetCoberturaAnticipadaAsync(idCliente));
}