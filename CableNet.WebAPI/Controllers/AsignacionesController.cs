using CableNet.Business.DTOs;
using CableNet.Business.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CableNet.WebAPI.Controllers
{
    [Route("api/clientes/{idCliente:int}/servicios")]
    [ApiController]
    public class AsignacionesController : ControllerBase
    {
        private readonly IAsignacionService _service;

        public AsignacionesController(IAsignacionService service)
            => _service = service;

        // GET api/clientes/1/servicios
        [HttpGet]
        public async Task<IActionResult> GetResumen(int idCliente)
            => Ok(await _service.GetResumenAsync(idCliente));

        // POST api/clientes/1/servicios/internet
        [HttpPost("internet")]
        public async Task<IActionResult> AsignarInternet(
            int idCliente, [FromBody] AsignarInternetRequest req)
        {
            // idCliente viene de la ruta, lo unificamos con el body
            await _service.AsignarInternetAsync(req with { IdCliente = idCliente });
            return Ok(await _service.GetResumenAsync(idCliente)); // devuelve el resumen actualizado
        }

        // POST api/clientes/1/servicios/cable
        [HttpPost("cable")]
        public async Task<IActionResult> AsignarCable(
            int idCliente, [FromBody] AsignarCableRequest req)
        {
            await _service.AsignarCableAsync(req with { IdCliente = idCliente });
            return Ok(await _service.GetResumenAsync(idCliente));
        }

        // DELETE api/clientes/1/servicios/internet
        [HttpDelete("internet")]
        public async Task<IActionResult> QuitarInternet(int idCliente)
        {
            await _service.QuitarInternetAsync(idCliente);
            return Ok(await _service.GetResumenAsync(idCliente));
        }

        // DELETE api/clientes/1/servicios/cable
        [HttpDelete("cable")]
        public async Task<IActionResult> QuitarCable(int idCliente)
        {
            await _service.QuitarCableAsync(idCliente);
            return Ok(await _service.GetResumenAsync(idCliente));
        }
    }
}
