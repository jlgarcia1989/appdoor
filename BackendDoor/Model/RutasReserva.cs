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
    public class RutasReserva
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonProperty(PropertyName = "IdRutaReserva")]
        public int IdRutaReserva { get; set; }

        [DataType(DataType.DateTime)]
        [JsonProperty(PropertyName = "FechaHora")]
        public DateTime FechaHora { get; set; }
        public int IdUsuario { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey("IdUsuario")]
        public Usuarios? Usuario { get; set; }
        public int IdRutaConductor { get; set; }

        public int CantidadPasajeros { get; set; }

        public string DireccionOrigen { get; set; }

        public string DireccionDestino { get; set; }

        [ForeignKey("IdRutaConductor")]
        public RutasConductor? RutaConductor { get; set; }
        public int IdTipoReserva { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey("IdTipoReserva")]
        public TiposReserva? TipoReserva { get; set; }
        public int IdEstadoReserva { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey("IdEstadoReserva")]
        public EstadosReserva? EstadoReserva { get; set; }

       
        public virtual ICollection<Encomiendas>? Encomiendas { get; set; }

    }
}
