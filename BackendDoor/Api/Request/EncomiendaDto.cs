using Model;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Api.Request
{
    public class EncomiendaDto
    {

        public string Dimensiones { get; set; }

        public int IdTipoEncomienda { get; set; }

        public string Destinatario { get; set; }

        public string Telefono { get; set; }
    
    }
}
