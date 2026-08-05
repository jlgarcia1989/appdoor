using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using YamlDotNet.Core.Tokens;

namespace Model
{
    public class UbicacionesRuta
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonProperty(PropertyName = "IdUbicacionRuta")]
        public int IdUbicacionRuta { get; set; }
        public int IdUbicacion { get; set; }
        [ForeignKey("IdUbicacion")]
        [System.Text.Json.Serialization.JsonIgnore]
        public Ubicaciones? Ubicacion { get; set; }

        [ForeignKey("IdRutaConductor")]
        public RutasConductor? RutaConductor { get; set; }
        public int? IdRutaConductor { get; set; }

       


    }
}
