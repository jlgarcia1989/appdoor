using Api.Request;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;
using System.Runtime.Intrinsics.Arm;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RutasController : ControllerBase
    {

        ServicioRutas rutas;
        DataContext dtx;
        private readonly IMapper mapper;
        public RutasController(ServicioRutas _rutas, IMapper _mapper, DataContext _dtx)
        {
            rutas = _rutas;
            dtx = _dtx;
            mapper = _mapper;

        }


        [HttpGet("ObtenerUbicacionesReserva")]
        public ActionResult ObtenerUbicacionesReserva(int idUsuario,int idEstadoReserva)
        {
            try
            {
                return Ok(rutas.ObtenerUbicacionesReserva(idUsuario, idEstadoReserva, dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            };
        }

        [HttpGet("ObtenerRutasConductor")]
        public ActionResult ObtenerRutasConductor(int idUsuario,int idEstadoRuta)
        {
            try
            {
                return Ok(rutas.ObtenerRutasConductor(idUsuario, idEstadoRuta, dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            };
        }

        [HttpGet("ObtenerUbicaciones")]
        public ActionResult ObtenerUbicaciones()
        {
            try
            {
                return Ok(rutas.ObtenerUbicaciones( dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            };
        }


        [HttpPost("CrearRutaConductor")]
        public ActionResult CrearRutaConductor(RutaConductorDto rutaConductor)
        {
            if (rutaConductor == null)
            {
                return NotFound();
            }
            try
            {
                return Ok(rutas.CrearRutaConductor(rutaConductor, dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
          ;
        }


        [HttpPost("CrearReservaRuta")]
        public ActionResult CrearReservaRuta(ReservaRutaDto rutaReserva)
        {
            if (rutaReserva == null)
            {
                return NotFound();
            }
            try
            {
                return Ok(rutas.CrearReservaRuta(rutaReserva,mapper, dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
         ;
        }


        [HttpGet("ObtenerEstadosRuta")]
        public ActionResult ObtenerEstadosRuta()
        {
            try
            {
                return Ok(rutas.ObtenerEstadosRuta(dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            };
        }

        [HttpGet("ObtenerEstadosReserva")]
        public ActionResult ObtenerEstadosReserva()
        {
            try
            {
                return Ok(rutas.ObtenerEstadosReserva(dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            };
        }

        [HttpGet("ObtenerTiposReserva")]
        public ActionResult ObtenerTiposReserva()
        {
            try
            {
                return Ok(rutas.ObtenerTiposReserva(dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            };
        }

        [HttpGet("ObtenerReservasPorUsuario")]
        public ActionResult ObtenerReservasPorUsuario(int idUsuario, int idtipoUsuario, int idRutaConductor )
        {
            try
            {
                return Ok(rutas.ObtenerReservasPorUsuario(idUsuario, idtipoUsuario,  idRutaConductor, dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            };
        }

        [HttpPost("CancelarReservaRuta")]
        public ActionResult CancelarReservaRuta(int idReservaRuta)
        {
            if (idReservaRuta == 0)
            {
                return NotFound();
            }
            try
            {
                return Ok(rutas.CancelarReservaRuta(idReservaRuta, dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
         ;
        }
    }
}
