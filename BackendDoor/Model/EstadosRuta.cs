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
    public class EstadosRuta
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonProperty(PropertyName = "IdEstadoRuta")]
        public int IdEstadoRuta { get; set; }
        [Required(ErrorMessage = "El dato {0} es necesario")]
        [Display(Name = "Descripcion")]
        [JsonProperty(PropertyName = "Descripcion")]
        public string? Descripcion { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<RutasConductor>? RutasConductor { get; set; }
    }
}
