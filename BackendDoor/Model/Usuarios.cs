using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Text.Json.Serialization;
using System.Runtime.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding;

using Swashbuckle.AspNetCore.Annotations;
using System.Xml.Serialization;
using YamlDotNet.Serialization;
using NSwag.Annotations;
using Microsoft.AspNetCore.Mvc;

namespace Model
{
    public class Usuarios 
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [SwaggerSchema(ReadOnly = true)]
        public  int IdUsuario { get; private set; }
        [Display(Name = "Nombre")]
        [JsonProperty(PropertyName = "Nombre")]
        public  string? Nombre { get; set; }

        [Display(Name = "PrimerApellido")]
        [JsonProperty(PropertyName = "PrimerApellido")]
        public  string? PrimerApellido { get; set; }
        [Display(Name = "SegundoApellido")]
        [JsonProperty(PropertyName = "SegundoApellido")]
        public string? SegundoApellido { get; set; }
        [Display(Name = "Direccion")]
        [JsonProperty(PropertyName = "Nombre")]
        public string? Direccion { get; set; }
        [Display(Name = "Activo")]
        [JsonProperty(PropertyName = "Activo")]
        public  bool Activo { get; set; }
     
        [Display(Name = "NumeroCelular")]
        [JsonProperty(PropertyName = "NumeroCelular")]
        public string? NumeroCelular { get; set; }

        [Display(Name = "Correo")]
        [JsonProperty(PropertyName = "Correo")]
        public string? Correo { get; set; }

        [Display(Name = "UrlImagen")]
        [JsonProperty(PropertyName = "UrlImagen")]
        public string? UrlImagen { get; set; }
     

       

        [Display(Name = "NumeroIdentificacion")]
        [JsonProperty(PropertyName = "NumeroIdentificacion")]
        public string? NumeroIdentificacion { get; set; }
        [Display(Name = "Fecha Nacimiento")]
        [DataType(DataType.DateTime)]
        [JsonProperty(PropertyName = "FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }
        [JsonProperty(PropertyName = "IdTipoUsuario")]
        [FromForm]
        public int IdTipoUsuario { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey("IdTipoUsuario")]
        public TiposUsuario? TipoUsuario { get;  set; }
        [System.Text.Json.Serialization.JsonIgnore]
        protected virtual  ICollection<DocumentosUsuario>? DocumentosUsuario { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        [JsonProperty("RutasConductor")]
        protected virtual ICollection<RutasConductor>? RutasConductor { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<RutasReserva>? RutasReserva { get; set; }
    }
}
