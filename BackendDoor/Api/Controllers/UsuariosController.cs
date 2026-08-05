using Api.Request;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Model;
using System;
using YamlDotNet.Core.Tokens;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        ServicioUsuarios usuarios;
        DataContext dtx;
        private readonly IMapper mapper;
        private readonly IConfiguration config;
        private string UrlBase;
        public UsuariosController(ServicioUsuarios _usuarios,DataContext _dtx, IMapper _mapper, IConfiguration _configuration)
        {
            usuarios = _usuarios;
            dtx = _dtx;
            mapper = _mapper;
            config = _configuration;
            UrlBase = config["UrlBases:MainUrl"];
        }


        private List<string> GuardarArchivosEnServidor(List<IFormFile> archivos)
        {
            List<string> rutas = new List<string>();
            if (archivos.Count > 0)
            {
                foreach (var file in archivos)
                {

                    string ruta = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\Documentos");
                  
                    if (!Directory.Exists(ruta))
                        Directory.CreateDirectory(ruta);

                    string fileNameWithPath = Path.Combine(ruta, Guid.NewGuid().ToString() + Path.GetExtension(file.FileName));
                    rutas.Add(fileNameWithPath);



                    using (var stream = new FileStream(fileNameWithPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
            }

            return rutas;

        }

        [HttpPost("GuardarDocumentos")]
        public ActionResult GuardarDocumentos([FromForm] DocumentoDto documentos)
        {
            if (documentos == null)
            {
                return NotFound();
            }
            try
            {
                    var documentosEncontrados = dtx.DocumentosUsuario.Where(d => d.IdUsuario == documentos.IdUsuario && d.IdTipoDocumento == documentos.IdTipoDocumento).ToList ();
                    var documentosUsuario = new List<DocumentosUsuario>();
              
                    if (documentosEncontrados.Any())
                    {
                   
                        EliminarArchivos(documentosEncontrados);
                        
                    }
                

               

                if (documentos.Archivos != null)
                {
                    var rutas = GuardarArchivosEnServidor(documentos.Archivos);

                    for (int i = 0; i < rutas.Count ; i++)
                    {
                        var documentoUsuario = new DocumentosUsuario ();
                        documentoUsuario.UrlDocumento  = UrlBase + rutas.ElementAt(i).Substring(rutas.ElementAt(i).IndexOf("Documentos"));
                        documentoUsuario.IdTipoDocumento = documentos.IdTipoDocumento;
                        documentoUsuario.IdUsuario = documentos.IdUsuario;
                        documentosUsuario.Add(documentoUsuario);
                    }

                }
               

                var ic = dtx.InformacionConductor.Where(d => d.IdInformacionConductor == documentos.IdInformacionDocumento);
                var informacionConductor = new InformacionConductor();

                if (ic.Count() > 0){
                    informacionConductor = ic.First();

                }
                informacionConductor.Placa = documentos.Placa;
                informacionConductor.Licencia = documentos.Licencia;
                informacionConductor.TipoVehiculo = documentos.TipoVehiculo;
                usuarios.GuardarDocumentos(documentosUsuario,documentosEncontrados , informacionConductor, dtx);

                return Ok(documentosUsuario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            ;
        }

        private void EliminarArchivos(List<DocumentosUsuario> documentosEncontrados)
        {
            foreach (var file in documentosEncontrados)
            {
                string ruta = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\Documentos", file.UrlDocumento.Substring(file.UrlDocumento.Trim().IndexOf("\\") + 1));

                if (Directory.Exists(ruta))
                    System.IO.File.Delete(ruta);

            }
        }

      

        [HttpPost("CrearUsuario")]
        public ActionResult CrearUsuario([FromForm] UsuarioDto usuario)
        {

            if (usuario == null)
            {
                return NotFound();
            }
            try
            {
                var model = mapper.Map<Usuarios>(usuario);
                if(usuario.Archivos != null)
                {
                    var rutasArchivos = GuardarArchivosEnServidor(usuario.Archivos);
                    model.UrlImagen = UrlBase + rutasArchivos.ElementAt(0).Substring(rutasArchivos.ElementAt(0).IndexOf("Documentos"));
                }
               
                return Ok(usuarios.CrearUsuario(model, dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            ;
        }


       

        [HttpPut("EditarUsuario")]
        public ActionResult EditarUsuario( [FromForm] UsuarioDto usuario)
        {
            if (usuario == null)
            {
                return NotFound();
            }
            try
            {
                var model = mapper.Map<Usuarios>(usuario);
                if (usuario.Archivos != null && usuario.Archivos.Count > 0)
                {
                    var paths = GuardarArchivosEnServidor(usuario.Archivos);
                    model.UrlImagen = UrlBase + paths.ElementAt(0).Substring(paths.ElementAt(0).IndexOf("Documentos"));
                }

                return Ok(usuarios.EditarUsuario(model, usuario.IdUsuario, dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
           ;
        }

        [HttpGet("ObtenerUsuario")]
        public ActionResult ObtenerUsuario(string numeroCelular)
        {
            try
            {
                return Ok(usuarios.ObtenerUsuario(numeroCelular, dtx, mapper));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            };
        }

        [HttpGet("ObtenerTiposUsuario")]
        public ActionResult ObtenerTiposUsuario()
        {
          
           
            try
            {
                return Ok(usuarios.ObtenerTiposUsuario(dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
          ;
        }


        [HttpPut("ActivarUsuario")]
        public ActionResult ActivarUsuario( int idUsuario, bool activo)
        {
            if (idUsuario == 0)
            {
                return NotFound();
            }
            try
            {
                return Ok(usuarios.ActivarUsuario(idUsuario, activo, dtx));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
           ;
        }

        [HttpGet("ObtenerDocumentosUsuario")]
        public ActionResult ObtenerDocumentosUsuario(int idUsuario, int idTipoDocumento)
        {
            try
            {
                return Ok(usuarios.ObtenerDocumentosUsuario(idUsuario, idTipoDocumento, dtx, mapper));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            };
        }
    }
}
