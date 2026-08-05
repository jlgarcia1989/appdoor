using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Request
{
    public class DocumentoDto
    {
        public int IdUsuario { get; set; }
        public int IdInformacionDocumento { get; set; }

        public int IdTipoDocumento { get; set; }

        [DefaultValue("No aplica")]
        public string Placa { get; set; } 

        [DefaultValue("No aplica")]
        public string Licencia { get; set; }
        [DefaultValue("No aplica")]
        public string TipoVehiculo { get; set; } 

        public List<IFormFile>? Archivos { get; set; }

        public   List<string>? UrlDocumentos { get; set; }


    }
}
