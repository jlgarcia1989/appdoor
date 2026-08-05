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
    public class RutasConductor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonProperty(PropertyName = "IdRutaConductor")]
        public int IdRutaConductor { get; set; }

        [Display(Name = "Descripcion")]
        [JsonProperty(PropertyName = "Descripcion")]
        public string? Descripcion { get; set; }

        public int? IdUsuario { get; set; }
        [ForeignKey("IdUsuario")]
     
        public Usuarios? Usuario { get; set; }

        public int IdEstadoRuta { get; set; }

        [ForeignKey("IdEstadoRuta")]
       
        public EstadosRuta? EstadoRuta { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<UbicacionesRuta>? UbicacionesRuta { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<RutasReserva>? RutasReserva { get; set; }


    }
}
