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
    public class Ubicaciones
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonProperty(PropertyName = "IdUbicacion")]
        public int IdUbicacion { get; set; }
        [Display(Name = "Nombre")]
        [JsonProperty(PropertyName = "Nombre")]
        public string? Nombre { get; set; }

        [Display(Name = "Latitud")]
        [JsonProperty(PropertyName = "Latitud")]
        public string? Latitud { get; set; }

        [Display(Name = "Longitud")]
        [JsonProperty(PropertyName = "Longitud")]
        public string? Longitud { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<UbicacionesRuta> UbicacionesRuta { get; set; }
    }
}
