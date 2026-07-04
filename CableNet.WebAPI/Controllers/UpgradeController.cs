using CableNet.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CableNet.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UpgradeController : ControllerBase
{
    private readonly IUpgradeService _service;

    public UpgradeController(IUpgradeService service) => _service = service;

    // GET api/upgrade
    [HttpGet]
    public async Task<IActionResult> Detectar([FromQuery] DateTime? fechaCorte = null)
        => Ok(await _service.DetectarElegiblesAsync(fechaCorte));

    // POST api/upgrade/cliente/1
    [HttpPost("cliente/{idCliente:int}")]
    public async Task<IActionResult> AplicarCliente(int idCliente)
        => Ok(await _service.AplicarClienteAsync(idCliente));

    // POST api/upgrade/masivo
    [HttpPost("masivo")]
    public async Task<IActionResult> AplicarMasivo([FromQuery] DateTime? fechaCorte = null)
        => Ok(await _service.AplicarMasivoAsync(fechaCorte));
}