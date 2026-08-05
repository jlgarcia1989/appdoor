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
    public  class InformacionConductor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonProperty(PropertyName = "IdInformacionConductor")]
        public int IdInformacionConductor { get; set; }
        [Display(Name = "Placa")]
        [JsonProperty(PropertyName = "Placa")]
        public string? Placa { get; set; } = "No aplica";

        [Display(Name = "Licencia")]
        [JsonProperty(PropertyName = "Licencia")]
        public string? Licencia { get; set; } = "No aplica";

        [Display(Name = "TipoVehiculo")]
        [JsonProperty(PropertyName = "TipoVehiculo")]
        public string? TipoVehiculo { get; set; } = "No aplica";

        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<DocumentosUsuario>? DocumentosUsuario { get; set; }
    }
}
