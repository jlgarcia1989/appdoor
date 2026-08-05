using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class Encomiendas
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonProperty(PropertyName = "IdEncomienda")]
        public int IdEncomienda { get; set; }

        [Display(Name = "Dimensiones")]
        [JsonProperty(PropertyName = "Dimensiones")]
        public string? Dimensiones { get; set; }

        [Display(Name = "Destinatario")]
        [JsonProperty(PropertyName = "Destinatario")]
        public string? Destinatario { get; set; }

        [Display(Name = "Telefono")]
        [JsonProperty(PropertyName = "Telefono")]
        public string? Telefono { get; set; }

        public int IdTipoEncomienda { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey("IdTipoEncomienda")]
        public TiposEncomienda? TipoEncomienda { get; set; }

        public int? IdRutaReserva { get; set; }

        [ForeignKey("IdRutaReserva")]
        public RutasReserva? RutasReserva { get; set; }

       
    }
}
