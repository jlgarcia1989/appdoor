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
    public class TiposDocumento
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonProperty(PropertyName = "IdTipoDocumento")]
        public int IdTipoDocumento { get; set; }

        [Display(Name = "Descripcion")]
        [JsonProperty(PropertyName = "Descripcion")]
        public  string? Descripcion { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public virtual  ICollection<DocumentosUsuario> DocumentosUsuario { get; set; }
    }
}
