using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Model;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Api.Request
{
    public class UsuarioDto
    {
        [SwaggerSchema(ReadOnly = true)]
        public int IdUsuario { get; private set; }
 
        public string? Nombre { get; set; }
 
        public string? PrimerApellido { get; set; }
  
        public string? SegundoApellido { get; set; }
   
        public string? Direccion { get; set; }
     
        public bool Activo { get; set; }
    
        public string? NumeroCelular { get; set; }

        public string? Correo { get; set; }

        public bool  EsConductor { get; set; }

        public string? UrlImagen { get; set; }

        public string? NumeroIdentificacion { get; set; }

        public DateTime FechaNacimiento { get; set; }
   
        public int IdTipoUsuario { get; set; }

        public List<IFormFile>? Archivos { get; set; }
    }
}
